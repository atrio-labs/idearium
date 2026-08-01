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

const BASE = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000';
const PROD = import.meta.env.PROD;

const ACESSO = 'id_acesso';
const RENOVA = 'id_renova';

/* Cookie legível por JS, de propósito. Guarda SÓ o @username, que já é
   público, e serve pra nav de página pré-renderizada saber que há
   sessão — sem ele, quem está logado veria "entrar" no átrio estático.
   Nenhum token passa por aqui: o que dá acesso continua httpOnly. */
const QUEM = 'id_quem';

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
  if (t.user?.username) {
    cookies.set(QUEM, t.user.username, { ...opcoes(VIDA_RENOVA), httpOnly: false });
  }
}

export function limparSessao(cookies: AstroCookies) {
  cookies.delete(ACESSO, { path: '/' });
  cookies.delete(RENOVA, { path: '/' });
  cookies.delete(QUEM, { path: '/' });
}

export const lerAcesso = (cookies: AstroCookies) => cookies.get(ACESSO)?.value ?? null;
export const lerRenova = (cookies: AstroCookies) => cookies.get(RENOVA)?.value ?? null;

/* ---------- chamadas de autenticação ---------- */

async function postJson(caminho: string, corpo: unknown) {
  const r = await fetch(BASE + caminho, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
        ? 'Email ou senha não conferem.'
        : mensagemDeErro(r.dado, 'Não consegui entrar agora. Tente de novo em instantes.'),
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
        ? 'Já existe conta com esse nome de usuário ou email.'
        : mensagemDeErro(r.dado, 'Não consegui criar a conta agora.'),
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
      erro: r.ok ? undefined : mensagemDeErro(dado, `A API respondeu ${r.status}.`),
    };
  } catch {
    return { ok: false, status: 0, dado: null, erro: 'Não consegui falar com o servidor.' };
  }
}

/** Guarda de rota: manda pro login guardando pra onde a pessoa queria ir. */
export function exigirSessao(usuario: UsuarioSessao | null, urlAtual: URL) {
  if (usuario) return null;
  const destino = urlAtual.pathname + urlAtual.search;
  return `/entrar?voltar=${encodeURIComponent(destino)}`;
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
