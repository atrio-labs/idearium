/* ================================================================
   ideia.ts — traduções e acompanhar (frente C5)
   ================================================================
   Duas flags, desligadas por padrão ('1' liga; trocar exige build):

     PUBLIC_TRADUCOES    lista as traduções de uma RFC. Precisa de
                         `translations` no GET /rfcs/:slug.
     PUBLIC_ACOMPANHAR   botão acompanhar e a lista "o que acompanho".

   Contrato proposto em docs/contratos/ideia.md. Só servidor, via
   comSessao. Nada aqui lança: 404/405 vira "ainda não disponível".
   ================================================================ */
import type { AstroCookies } from 'astro';
import { comSessao } from './sessao';
import type { Pagina, RfcResumo } from './api';

export const traducoesLigadas = () => import.meta.env.PUBLIC_TRADUCOES === '1';
export const acompanharLigado = () => import.meta.env.PUBLIC_ACOMPANHAR === '1';

/** O idioma pra onde se traduz: o oposto do conteúdo original. */
export const localeOposto = (locale: string): 'pt-BR' | 'en' =>
  locale === 'en' ? 'pt-BR' : 'en';

export const ehLocale = (v: string): v is 'pt-BR' | 'en' => v === 'pt-BR' || v === 'en';

/** Estado de acompanhar: null quando não dá pra saber ou a API
 *  ainda não tem o endpoint (a tela esconde o botão). */
export async function estouAcompanhando(cookies: AstroCookies, rfcId: string): Promise<boolean | null> {
  const r = await comSessao<{ following?: boolean }>(cookies, 'GET', `/rfcs/${encodeURIComponent(rfcId)}/follow`);
  if (!r.ok || typeof r.dado?.following !== 'boolean') return null;
  return r.dado.following;
}

export async function mudarAcompanhar(cookies: AstroCookies, rfcId: string, acompanhar: boolean) {
  const r = await comSessao(cookies, acompanhar ? 'POST' : 'DELETE', `/rfcs/${encodeURIComponent(rfcId)}/follow`);
  return { ok: r.ok, status: r.status };
}

export type EstadoAcompanhadas =
  | { tipo: 'ok'; itens: RfcResumo[]; meta: Pagina<RfcResumo>['meta'] }
  | { tipo: 'indisponivel' }
  | { tipo: 'erro' };

export async function listarAcompanhadas(cookies: AstroCookies, pagina = 1, limite = 20): Promise<EstadoAcompanhadas> {
  const r = await comSessao<Pagina<RfcResumo>>(cookies, 'GET', `/me/follows?page=${pagina}&limit=${limite}`);
  if (r.status === 404 || r.status === 405) return { tipo: 'indisponivel' };
  if (!r.ok || !r.dado || !Array.isArray(r.dado.data)) return { tipo: 'erro' };
  return { tipo: 'ok', itens: r.dado.data, meta: r.dado.meta };
}
