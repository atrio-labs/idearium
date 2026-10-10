/* ================================================================
   sessao.ts — autenticação por cookie httpOnly
   ================================================================
   Regra que orienta este arquivo: **nenhum token pode ser legível por
   JavaScript do cliente**. O backend implementou refresh token opaco,
   hashado, com rotação e revogação (ROADMAP_BACKEND §2.5); guardar
   isso em localStorage devolveria por XSS tudo o que ele protege — e
   este app renderiza texto escrito por usuários.

   Por isso:
     - os dois tokens vivem em cookie httpOnly, sameSite lax
     - o access token só é lido no servidor, pra montar o Authorization
     - a página nunca recebe o token, só o objeto do usuário

   `secure` só é ligado fora de dev: em http://localhost o browser
   descarta cookie secure e o login não gruda.
   ================================================================ */
import type { AstroCookies } from 'astro';
import { idiomaDaRequisicao } from './requisicao';
import { rota, separarIdioma, t } from './i18n';

const BASE = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000';
const PROD = import.meta.env.PROD;

const ACESSO = 'id_acesso';
const RENOVA = 'id_renova';

/** 15min é o TTL do access token na API; deixo o cookie um pouco menor
 *  pra nunca mandar um token que já expirou. */
const VIDA_ACESSO = 14 * 60;
const VIDA_RENOVA = 30 * 24 * 60 * 60;      // JWT_REFRESH_EXPIRES_DAYS

const opcoes = (maxAge: number) => ({
  httpOnly: true,
  secure: PROD,
  sameSite: 'lax' as const,
  path: '/',
  maxAge,
});

export interface UsuarioSessao {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  user?: UsuarioSessao;
}

export function gravarSessao(cookies: AstroCookies, t: Tokens) {
  cookies.set(ACESSO, t.accessToken, opcoes(VIDA_ACESSO));
  cookies.set(RENOVA, t.refreshToken, opcoes(VIDA_RENOVA));
}

export function limparSessao(cookies: AstroCookies) {
  cookies.delete(ACESSO, { path: '/' });
  cookies.delete(RENOVA, { path: '/' });
}

export const lerAcesso = (cookies: AstroCookies) => cookies.get(ACESSO)?.value ?? null;
export const lerRenova = (cookies: AstroCookies) => cookies.get(RENOVA)?.value ?? null;

/* ---------- chamadas de autenticação ---------- */

async function postJson(caminho: string, corpo: unknown) {
  const r = await fetch(BASE + caminho, {
    method: 'POST',
    /* x-lang: a API devolve as mensagens de validação no idioma da página */
    headers: { 'Content-Type': 'application/json', 'x-lang': idiomaDaRequisicao() },
    body: JSON.stringify(corpo),
  });
  const texto = await r.text();
  let dado: any = null;
  try { dado = texto ? JSON.parse(texto) : null; } catch { /* resposta não-JSON */ }
  return { ok: r.ok, status: r.status, dado };
}

/** A API responde erro de validação como array de mensagens já
 *  traduzidas (i18n do Nest). Junta num texto exibível. */
export function mensagemDeErro(dado: any, padrao: string) {
  const m = dado?.message;
  if (Array.isArray(m)) return m.join(' ');
  if (typeof m === 'string') return m;
  return padrao;
}

export async function entrar(cookies: AstroCookies, email: string, senha: string) {
  const r = await postJson('/auth/login', { email, password: senha });
  if (!r.ok) {
    return {
      ok: false as const,
      erro: r.status === 401
        ? t(idiomaDaRequisicao(), 'sessao.login.invalido')
        : mensagemDeErro(r.dado, t(idiomaDaRequisicao(), 'sessao.login.falha')),
    };
  }
  gravarSessao(cookies, r.dado);
  return { ok: true as const, usuario: r.dado.user as UsuarioSessao };
}

export async function criarConta(
  cookies: AstroCookies,
  dados: { username: string; email: string; password: string },
) {
  const r = await postJson('/auth/register', dados);
  if (!r.ok) {
    return {
      ok: false as const,
      erro: r.status === 409
        ? t(idiomaDaRequisicao(), 'sessao.conta.existe')
        : mensagemDeErro(r.dado, t(idiomaDaRequisicao(), 'sessao.conta.falha')),
    };
  }
  gravarSessao(cookies, r.dado);
  return { ok: true as const, usuario: r.dado.user as UsuarioSessao };
}

/** Encerra a sessão. Devolve se a revogação no servidor deu certo.
 *
 *  Os cookies são limpos de qualquer jeito — a pessoa clicou em sair e a
 *  sessão local tem que morrer mesmo que a API esteja fora. Mas o
 *  chamador precisa saber quando a revogação falhou: sem ela o refresh
 *  token continua válido pelos 30 dias de JWT_REFRESH_EXPIRES_DAYS, e
 *  dizer "você saiu" seria mentira em máquina compartilhada.
 *
 *  `postJson` não lança em 4xx/5xx: devolve ok:false. Por isso o
 *  resultado é conferido, e não só o try/catch de rede. */
export async function sair(cookies: AstroCookies): Promise<{ revogado: boolean }> {
  const refreshToken = lerRenova(cookies);
  let revogado = true;

  if (refreshToken) {
    try {
      const r = await postJson('/auth/logout', { refreshToken });
      revogado = r.ok;
    } catch {
      revogado = false;
    }
  }

  limparSessao(cookies);
  return { revogado };
}

/** Troca o refresh por um par novo. A API rotaciona: o refresh antigo
 *  morre no processo, então o novo par precisa ser gravado. */
async function renovar(cookies: AstroCookies): Promise<string | null> {
  const refreshToken = lerRenova(cookies);
  if (!refreshToken) return null;

  const r = await postJson('/auth/refresh', { refreshToken });
  if (!r.ok) { limparSessao(cookies); return null; }

  gravarSessao(cookies, r.dado);
  return r.dado.accessToken as string;
}

/** Quem é a pessoa desta requisição, ou null.
 *  Se o access token expirou, tenta renovar uma vez antes de desistir —
 *  é o que faz a sessão de 30 dias não derrubar ninguém a cada 15min. */
export async function usuarioAtual(cookies: AstroCookies): Promise<UsuarioSessao | null> {
  let token = lerAcesso(cookies);

  if (token) {
    const r = await fetch(BASE + '/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) return (await r.json()) as UsuarioSessao;
    if (r.status !== 401) return null;        // API fora: não desloga à toa
  }

  token = await renovar(cookies);
  if (!token) return null;

  const r = await fetch(BASE + '/auth/me', { headers: { Authorization: `Bearer ${token}` } });
  return r.ok ? ((await r.json()) as UsuarioSessao) : null;
}

/* ---------- chamadas autenticadas ---------- */

export interface Resposta<T> {
  ok: boolean;
  status: number;
  dado: T | null;
  erro?: string;
}

/** Faz a chamada com o access token do cookie; se voltar 401, renova
 *  uma vez e repete. Devolve erro legível em vez de lançar. */
export async function comSessao<T = any>(
  cookies: AstroCookies,
  metodo: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  caminho: string,
  corpo?: unknown,
): Promise<Resposta<T>> {
  const chamar = async (token: string | null) => {
    const r = await fetch(BASE + caminho, {
      method: metodo,
      headers: {
        Accept: 'application/json',
        'x-lang': idiomaDaRequisicao(),
        ...(corpo ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
    const texto = await r.text();
    let dado: any = null;
    try { dado = texto ? JSON.parse(texto) : null; } catch { /* 204 ou não-JSON */ }
    return { r, dado };
  };

  try {
    let { r, dado } = await chamar(lerAcesso(cookies));

    if (r.status === 401) {
      const novo = await renovar(cookies);
      if (novo) ({ r, dado } = await chamar(novo));
    }

    return {
      ok: r.ok,
      status: r.status,
      dado: r.ok ? (dado as T) : null,
      erro: r.ok ? undefined : mensagemDeErro(dado, t(idiomaDaRequisicao(), 'sessao.api.status', { status: r.status })),
    };
  } catch {
    return { ok: false, status: 0, dado: null, erro: t(idiomaDaRequisicao(), 'sessao.rede') };
  }
}

/** Guarda de rota: manda pro login guardando pra onde a pessoa queria ir. */
export function exigirSessao(usuario: UsuarioSessao | null, urlAtual: URL) {
  if (usuario) return null;
  /* Normaliza o prefixo: `pathname` pode chegar com ou sem /en, e o
     destino e o login têm de ficar no idioma de quem foi barrado. */
  const lang = idiomaDaRequisicao();
  const destino = rota(lang, separarIdioma(urlAtual.pathname).caminho) + urlAtual.search;
  return `${rota(lang, '/entrar')}?voltar=${encodeURIComponent(destino)}`;
}

/** Valida o `?voltar=` que `exigirSessao` monta. Só caminho da própria
 *  origem passa.
 *
 *  Comparar prefixo de texto NÃO basta: o parser de URL trata "\" como
 *  "/" em esquema especial, então "/\evil.com" escapa de um teste que só
 *  procura "//" e o Location sai como http://evil.com/ — phishing de
 *  credencial partindo de um link com domínio legítimo. Quem decide aqui
 *  é o mesmo parser que o browser usa: se a origem resolvida não for a
 *  nossa, cai pra raiz. Isso também neutraliza tab e quebra de linha no
 *  meio do valor, que o parser remove antes de resolver.
 *
 *  Mora aqui, e não em cada página, porque a regra tem sutileza: uma cópia
 *  esquecida vira a porta que a outra fechou. */
export function destinoSeguro(bruto: string | null, origem: string): string {
  if (!bruto || !bruto.startsWith('/')) return '/';
  try {
    const url = new URL(bruto, origem);
    if (url.origin !== origem) return '/';
    return url.pathname + url.search;
  } catch {
    return '/';
  }
}

/* ================================================================
   Etapa 6: OAuth, recuperação de senha, verificação de email
   ================================================================
   Chamadas acrescentadas depois das demais; só valem com PUBLIC_OAUTH=1
   (ver lib/oauth.ts). Não devolvem texto de interface: a página traduz
   `status` e `codigo`, que são o contrato com a API. `codigo` vem do
   campo `code` do corpo de erro (ex.: ACCOUNT_EXISTS), quando houver. */

export interface RespostaAuth {
  ok: boolean;
  /** 0 = não consegui falar com a API */
  status: number;
  codigo: string | null;
  dado: any;
}

async function chamarAuth(caminho: string, corpo: unknown = {}): Promise<RespostaAuth> {
  try {
    const r = await postJson(caminho, corpo);
    const codigo = typeof r.dado?.code === 'string' ? r.dado.code : null;
    return { ok: r.ok, status: r.status, codigo, dado: r.dado };
  } catch {
    return { ok: false, status: 0, codigo: null, dado: null };
  }
}

export const pedirRecuperacaoDeSenha = (email: string) =>
  chamarAuth('/auth/forgot-password', { email });

export const redefinirSenha = (token: string, novaSenha: string) =>
  chamarAuth('/auth/reset-password', { token, newPassword: novaSenha });

export const verificarEmail = (token: string) =>
  chamarAuth(`/auth/verify-email/${encodeURIComponent(token)}`);

/** Troca o código de uso único do callback. Login: a API devolve os
 *  tokens como em /auth/login e eles viram cookie aqui. Vínculo: devolve
 *  só `{ linked }` e nada de sessão muda. */
export async function trocarCodigoOAuth(cookies: AstroCookies, code: string) {
  const r = await chamarAuth('/auth/oauth/exchange', { code });
  if (r.ok && r.dado?.accessToken && r.dado?.refreshToken) {
    gravarSessao(cookies, r.dado);
    return { ...r, tipo: 'sessao' as const };
  }
  if (r.ok && r.dado?.linked) return { ...r, tipo: 'vinculo' as const };
  return { ...r, ok: false, tipo: null };
}

/** Os três abaixo exigem sessão (Bearer do cookie). */
export function reenviarVerificacao(cookies: AstroCookies) {
  return comSessao(cookies, 'POST', '/auth/resend-verification');
}

/** Pede à API a URL de autorização do provedor pra vincular à conta
 *  logada. A API amarra o `state` ao usuário e devolve `{ url }`. */
export function iniciarVinculo(
  cookies: AstroCookies,
  provedor: string,
  redirect: string,
  state: string,
) {
  return comSessao<{ url?: string }>(cookies, 'POST', `/users/me/link-${provedor}`, { redirect, state });
}

export function desvincular(cookies: AstroCookies, provedor: string) {
  return comSessao(cookies, 'DELETE', `/users/me/link-${provedor}`);
}
