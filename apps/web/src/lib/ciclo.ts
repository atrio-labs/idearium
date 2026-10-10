/* ================================================================
   ciclo.ts — fechar o ciclo da ideia (C1)
   ================================================================
   Atrás da flag PUBLIC_CICLO ('1' liga; desligada por padrão). O
   backend ainda não tem estes endpoints. O que está aqui segue o
   contrato PROPOSTO em docs/contratos/ciclo.md:

     POST /rfcs/:id/ship        marca como PUBLISHED ("virou projeto")
     POST /rfcs/:id/unarchive   traz de volta uma ideia arquivada
     GET  /rfcs/:id/updates     atualizações de progresso, em ordem
     POST /rfcs/:id/updates     publica uma atualização
     PATCH /rfcs/:id            ganha `changeNote` (nota de mudança)

   Só servidor: as chamadas passam por comSessao. Nada aqui lança:
   404 e 405 viram "indisponível", e a tela diz que a API ainda não
   oferece o recurso em vez de quebrar.
   ================================================================ */
import type { AstroCookies } from 'astro';
import { comSessao } from './sessao';
import type { Autor, Rfc } from './api';

export const cicloLigado = () => import.meta.env.PUBLIC_CICLO === '1';

/** Os mesmos números que o contrato propõe pra API. */
export const LIMITE_CICLO = {
  resumoProjeto: { min: 5, max: 280 },
  atualizacao: { min: 5, max: 4000 },
  notaMudanca: { max: 280 },
};

export interface AtualizacaoRfc {
  id: string;
  body: string;
  createdAt: string;
  author: Autor;
}

export type EstadoAtualizacoes =
  | { tipo: 'ok'; itens: AtualizacaoRfc[] }
  /** a API respondeu 404 ou 405: o recurso ainda não existe */
  | { tipo: 'indisponivel' }
  | { tipo: 'erro' };

export interface ResultadoCiclo {
  ok: boolean;
  status: number;
  erro?: string;
  /** 404 ou 405: o endpoint ainda não existe na API */
  indisponivel: boolean;
}

const resultado = (r: { ok: boolean; status: number; erro?: string }): ResultadoCiclo => ({
  ok: r.ok,
  status: r.status,
  erro: r.erro,
  indisponivel: r.status === 404 || r.status === 405,
});

/** Só http e https. O link vem de quem escreveu e vai pra um href:
 *  `javascript:` e afins nunca passam. Devolve a URL normalizada ou
 *  null. */
export function urlDoProjeto(bruto: unknown): string | null {
  if (typeof bruto !== 'string') return null;
  const texto = bruto.trim();
  if (!texto || texto.length > 500) return null;
  try {
    const u = new URL(texto);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
}

/** O que a RFC publicada diz sobre o projeto. Campos propostos
 *  (`projectUrl`, `projectSummary`); a API de hoje não os devolve. */
export function projetoDaRfc(rfc: Rfc): { url: string; resumo: string } | null {
  if (rfc.status !== 'PUBLISHED') return null;
  const extra = rfc as Rfc & { projectUrl?: string | null; projectSummary?: string | null };
  const url = urlDoProjeto(extra.projectUrl);
  return url ? { url, resumo: (extra.projectSummary ?? '').trim() } : null;
}

export async function listarAtualizacoes(
  cookies: AstroCookies,
  rfcId: string,
): Promise<EstadoAtualizacoes> {
  const r = await comSessao<AtualizacaoRfc[]>(cookies, 'GET', `/rfcs/${rfcId}/updates`);
  if (r.status === 404 || r.status === 405) return { tipo: 'indisponivel' };
  if (!r.ok || !Array.isArray(r.dado)) return { tipo: 'erro' };
  const itens = [...r.dado].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return { tipo: 'ok', itens };
}

export async function publicarAtualizacao(cookies: AstroCookies, rfcId: string, body: string) {
  return resultado(await comSessao(cookies, 'POST', `/rfcs/${rfcId}/updates`, { body }));
}

export async function marcarComoProjeto(
  cookies: AstroCookies,
  rfcId: string,
  projectUrl: string,
  projectSummary: string,
) {
  return resultado(await comSessao(cookies, 'POST', `/rfcs/${rfcId}/ship`, { projectUrl, projectSummary }));
}

export async function desarquivar(cookies: AstroCookies, rfcId: string) {
  return resultado(await comSessao(cookies, 'POST', `/rfcs/${rfcId}/unarchive`));
}
