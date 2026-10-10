/* GET /rss.xml e /en/rss.xml — as ideias publicadas mais recentes (só lê) */
import type { APIRoute } from 'astro';
import { apiIndisponivel, listarTodasRfcs } from '../lib/api';
import { respostaRss } from '../lib/feed';
import { idiomaDe, t } from '../lib/i18n';
import { origemPublica } from '../lib/site';

export const GET: APIRoute = async (context) => {
  const lang = idiomaDe(context);
  const rfcs = await listarTodasRfcs();
  return respostaRss(
    rfcs,
    { titulo: t(lang, 'comum.rss.titulo'), descricao: t(lang, 'comum.rss.descricao'), caminho: '/rfcs', caminhoFeed: '/rss.xml' },
    origemPublica(context.url), lang, !apiIndisponivel(),
  );
};
