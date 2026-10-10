/* ================================================================
   conta.ts — segurança da conta, LGPD e exclusão (frente C3)
   ================================================================
   Atrás da flag PUBLIC_CONTA ('1' liga; desligada por padrão). O
   backend ainda não tem estes endpoints; o que está aqui segue o
   CONTRATO PROPOSTO em docs/contratos/conta.md:

     PATCH  /users/me/password   { currentPassword, newPassword }
     POST   /users/me/email      { newEmail, password }
     POST   /auth/confirm-email/:token
     POST   /auth/logout-all
     GET    /users/me/export
     DELETE /users/me            { password, confirmUsername }

   Só servidor. Nada aqui lança: falha volta como `situacao`, e a página
   escolhe o texto. 404/405 é "ainda não disponível" (a API não tem o
   endpoint), nunca erro de quem usa.
   ================================================================ */
import type { AstroCookies } from 'astro';
import { chamarAuth, comSessao, gravarSessao, limparSessao, type Resposta } from './sessao';

export const CONTA_LIGADA = import.meta.env.PUBLIC_CONTA === '1';

export type Situacao = 'ok' | 'indisponivel' | 'senha' | 'conflito' | 'erro';

export interface ResultadoConta {
  situacao: Situacao;
  /** mensagem já traduzida pela API (validação), quando houver */
  erro?: string;
}

/** 404/405 = endpoint ausente. 403 = senha atual errada (contrato
 *  proposto: não é 401 de propósito, pra comSessao não confundir com
 *  token expirado). 409 = conflito (email já em uso). */
export function situacaoDe(r: Pick<Resposta<unknown>, 'ok' | 'status'>): Situacao {
  if (r.ok) return 'ok';
  if (r.status === 404 || r.status === 405) return 'indisponivel';
  if (r.status === 403) return 'senha';
  if (r.status === 409) return 'conflito';
  return 'erro';
}

const resultado = (r: Resposta<unknown>): ResultadoConta => ({
  situacao: situacaoDe(r),
  erro: r.status === 400 ? r.erro : undefined,
});

/** Troca a senha. A API revoga as OUTRAS sessões; se devolver um par
 *  novo de tokens pra esta, ele vira cookie (senão esta sessão cairia
 *  no próximo refresh). */
export async function trocarSenha(cookies: AstroCookies, atual: string, nova: string) {
  const r = await comSessao<{ accessToken?: string; refreshToken?: string }>(
    cookies, 'PATCH', '/users/me/password', { currentPassword: atual, newPassword: nova });
  if (r.ok && r.dado?.accessToken && r.dado?.refreshToken) {
    gravarSessao(cookies, { accessToken: r.dado.accessToken, refreshToken: r.dado.refreshToken });
  }
  return resultado(r);
}

/** Pede a troca; a API manda a confirmação ao email NOVO. O email só
 *  muda quando o link é aberto (/confirmar-email/:token). */
export async function pedirTrocaDeEmail(cookies: AstroCookies, novoEmail: string, senha: string) {
  return resultado(await comSessao(cookies, 'POST', '/users/me/email', { newEmail: novoEmail, password: senha }));
}

export const confirmarEmail = (token: string) =>
  chamarAuth(`/auth/confirm-email/${encodeURIComponent(token)}`);

/** Revoga todos os refresh tokens, inclusive o desta sessão. Os cookies
 *  daqui morrem junto. */
export async function sairDeTodos(cookies: AstroCookies) {
  const r = await comSessao(cookies, 'POST', '/auth/logout-all');
  if (r.ok) limparSessao(cookies);
  return resultado(r);
}

/** Exclui a conta. A API anonimiza o conteúdo público e apaga os dados
 *  pessoais; aqui só se limpa a sessão local depois do sim. */
export async function excluirConta(cookies: AstroCookies, senha: string, confirmUsername: string) {
  const r = await comSessao(cookies, 'DELETE', '/users/me', { password: senha, confirmUsername });
  if (r.ok) limparSessao(cookies);
  return resultado(r);
}

/** Exportação dos dados (LGPD art. 18). Devolve o JSON da API ou null. */
export async function exportarDados(cookies: AstroCookies) {
  const r = await comSessao<unknown>(cookies, 'GET', '/users/me/export');
  return { situacao: situacaoDe(r), dado: r.dado };
}

/* Mesmas regras do cadastro (RegisterDto): 10 a 200 caracteres. */
export const SENHA_MIN = 10;
export const SENHA_MAX = 200;
