/* GET /labs/:slug/rss.xml (e /en/...) — as ideias de um laboratório (só lê) */
import type { APIRoute } from 'astro';
import { apiIndisponivel, listarTodasRfcs, nomeDoLab, obterLab } from '../../../lib/api';
import { respostaRss } from '../../../lib/feed';
import { idiomaDe, t } from '../../../lib/i18n';
import { origemPublica } from '../../../lib/site';

export const GET: APIRoute = async (context) => {
  const lang = idiomaDe(context);
  const slug = context.params.slug ?? '';
  const lab = await obterLab(slug);
  if (!lab) return new Response('not found', { status: apiIndisponivel() ? 503 : 404 });
  const rfcs = await listarTodasRfcs({ lab: slug });
  const nome = nomeDoLab(lab, lang);
  return respostaRss(
    rfcs,
    {
      titulo: t(lang, 'comum.rss.tituloLab', { lab: nome }),
      descricao: t(lang, 'comum.rss.descricaoLab', { lab: nome }),
      caminho: `/labs/${slug}`, caminhoFeed: `/labs/${slug}/rss.xml`,
    },
    origemPublica(context.url), lang, !apiIndisponivel(),
  );
};
