/* ================================================================
   moderacao.ts — reportar e moderar (C2)
   ================================================================
   Atrás da flag PUBLIC_MODERACAO ('1' liga; desligada por padrão).
   O backend ainda não tem estes endpoints. O contrato que o front
   assume está em docs/contratos/moderacao.md; o que já existe no
   ROADMAP_BACKEND (Etapa 7) é:

     POST  /reports                  { targetType, targetId, reason }
     GET   /admin/reports            (MAINTAINER)
     PATCH /admin/reports/:id        { status, resolution? }
     PATCH /admin/rfcs/:id/hide      (MAINTAINER)
     PATCH /admin/users/:id/suspend  (MAINTAINER)

   O resto (details, unhide, unsuspend, motivo obrigatório, estado
   oculto/suspenso nas leituras públicas) é PROPOSTA.

   Só servidor. Nada aqui lança: falha volta como estado, e 404/405
   viram 'indisponivel'.
   ================================================================ */
import type { AstroCookies } from 'astro';
import { comSessao, type UsuarioSessao } from './sessao';
import { rota, type Idioma } from './i18n';

export const moderacaoLigada = () => import.meta.env.PUBLIC_MODERACAO === '1';

export const ehMantenedor = (u: UsuarioSessao | null | undefined) => u?.role === 'MAINTAINER';

/* ---------- alvo e motivo ---------- */

export const TIPOS_DE_ALVO = ['rfc', 'comentario', 'usuario'] as const;
export type TipoDeAlvo = (typeof TIPOS_DE_ALVO)[number];

/** O que a URL do front chama de um jeito, a API chama de outro. */
const TIPO_NA_API: Record<TipoDeAlvo, 'RFC' | 'COMMENT' | 'USER'> = {
  rfc: 'RFC', comentario: 'COMMENT', usuario: 'USER',
};

export const MOTIVOS = [
  'harassment', 'discrimination', 'personal_data', 'spam', 'illegal', 'other',
] as const;
export type Motivo = (typeof MOTIVOS)[number];

export const ehTipoDeAlvo = (v: unknown): v is TipoDeAlvo =>
  typeof v === 'string' && (TIPOS_DE_ALVO as readonly string[]).includes(v);
export const ehMotivo = (v: unknown): v is Motivo =>
  typeof v === 'string' && (MOTIVOS as readonly string[]).includes(v);

/** Id vindo da querystring: só o que um uuid ou cuid pode ter. */
export const idValido = (v: string) => /^[\w-]{1,64}$/.test(v);

/* ---------- reportar ---------- */

export type ResultadoReporte =
  | { tipo: 'ok' }
  | { tipo: 'sem-sessao' }
  | { tipo: 'indisponivel' }
  | { tipo: 'ja-reportou' }
  | { tipo: 'proprio' }
  | { tipo: 'limite' }
  | { tipo: 'erro'; mensagem: string };

export async function enviarReporte(
  cookies: AstroCookies,
  dados: { tipo: TipoDeAlvo; id: string; motivo: Motivo; detalhes?: string },
): Promise<ResultadoReporte> {
  const r = await comSessao(cookies, 'POST', '/reports', {
    targetType: TIPO_NA_API[dados.tipo],
    targetId: dados.id,
    reason: dados.motivo,
    ...(dados.detalhes ? { details: dados.detalhes } : {}),
  });
  if (r.ok) return { tipo: 'ok' };
  if (r.status === 401) return { tipo: 'sem-sessao' };
  if (r.status === 404 || r.status === 405) return { tipo: 'indisponivel' };
  if (r.status === 409) return { tipo: 'ja-reportou' };
  if (r.status === 403) return { tipo: 'proprio' };
  if (r.status === 429) return { tipo: 'limite' };
  return { tipo: 'erro', mensagem: r.erro ?? '' };
}

/* ---------- fila dos mantenedores ---------- */

export const STATUS_DA_FILA = ['OPEN', 'RESOLVED', 'DISMISSED'] as const;
export type StatusDaFila = (typeof STATUS_DA_FILA)[number];
export const ehStatusDaFila = (v: unknown): v is StatusDaFila =>
  typeof v === 'string' && (STATUS_DA_FILA as readonly string[]).includes(v);

/** O alvo do reporte, já resolvido pela API. Tudo opcional: o painel
 *  se vira com o que vier. Os links são montados daqui, nunca de URL
 *  vinda da API. */
export interface AlvoDoReporte {
  rfcSlug?: string;
  commentId?: string;
  username?: string;
  /** trecho do conteúdo, já cortado pela API */
  excerpt?: string;
  /** a RFC já está oculta */
  hidden?: boolean;
  /** a conta já está suspensa */
  suspended?: boolean;
}

export interface Reporte {
  id: string;
  targetType: 'RFC' | 'COMMENT' | 'USER';
  targetId: string;
  reason: string;
  details?: string | null;
  status: StatusDaFila;
  resolution?: string | null;
  createdAt: string;
  reporter?: { username: string } | null;
  target?: AlvoDoReporte | null;
}

export interface MetaDaFila {
  page: number; limit: number; total: number; totalPages: number;
}

export type EstadoDaFila =
  | { tipo: 'ok'; itens: Reporte[]; meta: MetaDaFila }
  | { tipo: 'sem-sessao' }
  | { tipo: 'proibido' }
  | { tipo: 'indisponivel' }
  | { tipo: 'erro'; mensagem: string };

export async function listarReportes(
  cookies: AstroCookies,
  status: StatusDaFila,
  pagina = 1,
  limite = 20,
): Promise<EstadoDaFila> {
  const r = await comSessao<{ data?: Reporte[]; meta?: MetaDaFila }>(
    cookies, 'GET', `/admin/reports?status=${status}&page=${pagina}&limit=${limite}`,
  );
  if (r.status === 401) return { tipo: 'sem-sessao' };
  if (r.status === 403) return { tipo: 'proibido' };
  if (r.status === 404 || r.status === 405) return { tipo: 'indisponivel' };
  if (!r.ok || !r.dado || !Array.isArray(r.dado.data)) return { tipo: 'erro', mensagem: r.erro ?? '' };
  const itens = r.dado.data;
  return {
    tipo: 'ok',
    itens,
    meta: r.dado.meta ?? { page: pagina, limit: limite, total: itens.length, totalPages: 1 },
  };
}

export const ACOES_NO_ALVO = ['ocultar', 'reexibir', 'suspender', 'reativar'] as const;
export type AcaoNoAlvo = (typeof ACOES_NO_ALVO)[number];
export const ehAcaoNoAlvo = (v: unknown): v is AcaoNoAlvo =>
  typeof v === 'string' && (ACOES_NO_ALVO as readonly string[]).includes(v);

export interface ResultadoAdmin { ok: boolean; status: number }

export async function agirNoAlvo(
  cookies: AstroCookies, acao: AcaoNoAlvo, id: string, motivo: string,
): Promise<ResultadoAdmin> {
  const caminho = {
    ocultar: `/admin/rfcs/${encodeURIComponent(id)}/hide`,
    reexibir: `/admin/rfcs/${encodeURIComponent(id)}/unhide`,
    suspender: `/admin/users/${encodeURIComponent(id)}/suspend`,
    reativar: `/admin/users/${encodeURIComponent(id)}/unsuspend`,
  }[acao];
  const r = await comSessao(cookies, 'PATCH', caminho, { reason: motivo });
  return { ok: r.ok, status: r.status };
}

export async function decidirReporte(
  cookies: AstroCookies, id: string, status: 'RESOLVED' | 'DISMISSED', resolucao: string,
): Promise<ResultadoAdmin> {
  const r = await comSessao(cookies, 'PATCH', `/admin/reports/${encodeURIComponent(id)}`, {
    status, resolution: resolucao,
  });
  return { ok: r.ok, status: r.status };
}

/* ---------- estados visíveis ---------- */

/** O autor de uma leitura pública pode vir anonimizado (conta
 *  suspensa). Aceita as duas formas do contrato: `suspended: true` ou
 *  o username literal "[suspenso]". Sem link pro perfil, que não
 *  existe mais pra quem lê. */
export function autorSuspenso(a: { username: string; suspended?: boolean } | null | undefined) {
  return !!a && (a.suspended === true || a.username === '[suspenso]');
}

/** A RFC está oculta e quem lê não é autor nem mantenedor. */
export function ocultaParaMim(
  rfc: { hiddenAt?: string | null; author: { id: string } } | null,
  usuario: UsuarioSessao | null,
) {
  if (!moderacaoLigada() || !rfc?.hiddenAt) return false;
  return !(usuario && (usuario.id === rfc.author.id || ehMantenedor(usuario)));
}

/** Link do alvo no site, montado só de slug/username/id. */
export function enderecoDoAlvo(r: Reporte, lang: Idioma): string | null {
  const a = r.target;
  if (!a) return null;
  if (r.targetType === 'USER' && a.username) return rota(lang, `/users/${encodeURIComponent(a.username)}`);
  if (a.rfcSlug) {
    return rota(lang, `/rfcs/${encodeURIComponent(a.rfcSlug)}`)
      + (r.targetType === 'COMMENT' ? `#c-${encodeURIComponent(r.targetId)}` : '');
  }
  return null;
}
