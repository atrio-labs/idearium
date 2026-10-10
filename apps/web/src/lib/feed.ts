/* ================================================================
   feed.ts — resposta RSS de uma lista de RFCs (só servidor)
   ================================================================
   Usado por /rss.xml e /labs/:slug/rss.xml (e as versões /en, que o
   middleware reescreve pra mesma rota). O idioma muda o texto do canal
   e os links; o conteúdo das RFCs fica no idioma em que foi escrito.
   ================================================================ */
import { codigoRfc, nomeDoLab, type RfcResumo } from './api';
import { rota, type Idioma } from './i18n';
import { rss } from './xml';

const LIMITE = 50;

export function respostaRss(
  rfcs: RfcResumo[],
  canal: { titulo: string; descricao: string; caminho: string; caminhoFeed: string },
  origem: string,
  lang: Idioma,
  publico: boolean,
) {
  const itens = rfcs
    .filter((r) => r.number != null)
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
    .slice(0, LIMITE)
    .map((r) => ({
      titulo: `${codigoRfc(r.number, lang)} · ${r.title}`,
      link: origem + rota(lang, `/rfcs/${r.slug}`),
      data: r.publishedAt,
      descricao: r.summary,
      categoria: nomeDoLab(r.lab, lang),
    }));
  const corpo = rss(
    {
      titulo: canal.titulo, descricao: canal.descricao, lang,
      link: origem + rota(lang, canal.caminho),
      self: origem + rota(lang, canal.caminhoFeed),
    },
    itens,
  );
  return new Response(corpo, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': publico ? 'public, s-maxage=300, stale-while-revalidate=600' : 'no-store',
    },
  });
}
