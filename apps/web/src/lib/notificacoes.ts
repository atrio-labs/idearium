/* ================================================================
   notificacoes.ts — notificações da pessoa logada (F6)
   ================================================================
   Atrás da flag PUBLIC_NOTIFICACOES ('1' liga; desligada por padrão).
   O backend ainda não tem o módulo (ROADMAP_BACKEND, Etapa 5). O que
   está aqui segue o contrato PREVISTO lá e ainda precisa ser fechado
   com o Kae:

     GET   /notifications?page=&limit=   paginado no padrão da API
     PATCH /notifications/:id/read
     PATCH /notifications/read-all

   PROPOSTA: além de { page, limit, total, totalPages }, o `meta` traz
   `unread`, a contagem de não lidas da pessoa (não só da página).
   Sem ele, o marcador da nav não tem como saber se há algo novo.

   Só servidor: as chamadas passam por comSessao, que lê o token do
   cookie httpOnly. Nada aqui lança: falha volta como estado, e a
   página decide o que mostrar.
   ================================================================ */
import type { AstroCookies } from 'astro';
import { comSessao } from './sessao';
import { codigoRfc, rotuloDoStatus, type RfcStatus } from './api';
import { rota, t, temChave, type Idioma } from './i18n';

export const notificacoesLigadas = () => import.meta.env.PUBLIC_NOTIFICACOES === '1';

/* ---------- contrato (proposta) ---------- */

/** Os quatro eventos da Etapa 5. `new_enrollment` e `new_comment` são
 *  os nomes que o ROADMAP_BACKEND já usa; os outros dois são proposta.
 *  Tipo desconhecido não quebra: cai no title/body. */
export type TipoNotificacao =
  | 'new_enrollment'
  | 'new_comment'
  | 'rfc_status_changed'
  | 'mention';

/** Formato proposto do payload. Tudo opcional: o texto se vira com o
 *  que vier e, sem nada, usa o title. */
export interface PayloadNotificacao {
  rfcId?: string;
  rfcSlug?: string;
  rfcNumber?: number | null;
  rfcTitle?: string;
  /** @ de quem causou o evento, sem o "@" */
  actorUsername?: string;
  /** comentário que gerou new_comment ou mention */
  commentId?: string;
  /** status novo, em rfc_status_changed */
  status?: RfcStatus;
}

export interface Notificacao {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  payload?: PayloadNotificacao | null;
  readAt: string | null;
  createdAt: string;
}

export interface MetaNotificacoes {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  /** PROPOSTA: não lidas da pessoa, no total */
  unread?: number;
}

export type EstadoNotificacoes =
  | { tipo: 'ok'; itens: Notificacao[]; meta: MetaNotificacoes }
  /** a sessão morreu: a página manda pro login */
  | { tipo: 'sem-sessao' }
  /** a API respondeu 404: o endpoint ainda não existe */
  | { tipo: 'indisponivel' }
  | { tipo: 'erro'; mensagem: string };

/* ---------- chamadas ---------- */

export async function listarNotificacoes(
  cookies: AstroCookies,
  pagina = 1,
  limite = 20,
): Promise<EstadoNotificacoes> {
  const r = await comSessao<{ data?: Notificacao[]; meta?: MetaNotificacoes }>(
    cookies, 'GET', `/notifications?page=${pagina}&limit=${limite}`,
  );
  if (r.status === 401) return { tipo: 'sem-sessao' };
  if (r.status === 404) return { tipo: 'indisponivel' };
  if (!r.ok || !r.dado || !Array.isArray(r.dado.data)) {
    return { tipo: 'erro', mensagem: r.erro ?? '' };
  }
  const itens = r.dado.data;
  const meta = r.dado.meta ?? { page: pagina, limit: limite, total: itens.length, totalPages: 1 };
  return { tipo: 'ok', itens, meta };
}

/** Há notificação não lida? null quando não dá pra saber (API fora,
 *  endpoint ausente ou `meta.unread` que não veio). */
export async function haNovas(cookies: AstroCookies): Promise<boolean | null> {
  const e = await listarNotificacoes(cookies, 1, 1);
  if (e.tipo !== 'ok' || typeof e.meta.unread !== 'number') return null;
  return e.meta.unread > 0;
}

export async function marcarLida(cookies: AstroCookies, id: string) {
  const r = await comSessao(cookies, 'PATCH', `/notifications/${encodeURIComponent(id)}/read`);
  return { ok: r.ok, status: r.status };
}

export async function marcarTodasLidas(cookies: AstroCookies) {
  const r = await comSessao(cookies, 'PATCH', '/notifications/read-all');
  return { ok: r.ok, status: r.status };
}

/* ---------- texto e destino ---------- */

const STATUS: readonly RfcStatus[] = ['DRAFT', 'IN_DISCUSSION', 'IN_BUILDING', 'PUBLISHED', 'ARCHIVED'];

/** O que a lista mostra: a frase, um detalhe opcional (o body, quando
 *  a frase veio do title) e pra onde o item leva. */
export function lerNotificacao(n: Notificacao, lang: Idioma) {
  const p = n.payload ?? {};
  const chave = `notificacoes.tipo.${n.type}`;

  const rfc = p.rfcTitle?.trim()
    || (typeof p.rfcNumber === 'number' ? codigoRfc(p.rfcNumber, lang) : '')
    || t(lang, 'notificacoes.uma.ideia');
  const autor = p.actorUsername ? `@${p.actorUsername}` : t(lang, 'notificacoes.alguem');
  const status = p.status && STATUS.includes(p.status) ? rotuloDoStatus(p.status, lang) : '';

  /* Tipo conhecido com o que a frase precisa → frase no idioma da
     página. Senão, o que a API gravou. */
  const temDados = p.rfcTitle || p.rfcNumber != null || p.rfcSlug;
  const conhecido = temChave(chave) && temDados && (n.type !== 'rfc_status_changed' || status);

  const texto = conhecido
    ? t(lang, chave as Parameters<typeof t>[1], { autor, rfc, status })
    : n.title?.trim() || t(lang, 'notificacoes.generica');
  const detalhe = conhecido ? null : n.body?.trim() || null;

  /* Destino montado do slug, nunca de uma URL vinda do payload: um
     link arbitrário dentro da central seria porta de phishing. */
  const href = p.rfcSlug
    ? rota(lang, `/rfcs/${encodeURIComponent(p.rfcSlug)}`) + (p.commentId ? `#c-${encodeURIComponent(p.commentId)}` : '')
    : null;

  return { texto, detalhe, href, nova: !n.readAt };
}
