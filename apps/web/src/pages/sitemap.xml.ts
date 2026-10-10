/* GET /sitemap.xml — átrio, listas, labs, RFCs publicadas, perfis de
   quem escreveu, tags e institucionais, nos dois idiomas (só lê). */
import type { APIRoute } from 'astro';
import { apiIndisponivel, chamarApi, listarLabs, listarTodasRfcs, LIMITE_API, type Pagina } from '../lib/api';
import { origemPublica } from '../lib/site';
import { sitemap } from '../lib/xml';

const FIXAS = ['/', '/rfcs', '/labs', '/tags', '/builders', '/sobre', '/governanca', '/codigo-de-conduta', '/transparencia'];

export const GET: APIRoute = async ({ url }) => {
  const [labs, rfcs, tags] = await Promise.all([
    listarLabs(),
    listarTodasRfcs(),
    chamarApi<Pagina<{ slug: string }>>(`/tags?limit=${LIMITE_API}`),
  ]);
  /* número null é rascunho; a listagem pública já não o traz, mas o
     sitemap não confia só nisso */
  const publicadas = rfcs.filter((r) => r.number != null);
  const autores = new Set(publicadas.map((r) => r.author.username));

  const caminhos = [
    ...FIXAS.map((caminho) => ({ caminho })),
    ...labs.map((l) => ({ caminho: `/labs/${l.slug}` })),
    ...publicadas.map((r) => ({ caminho: `/rfcs/${r.slug}`, lastmod: r.updatedAt })),
    ...[...autores].map((u) => ({ caminho: `/users/${u}` })),
    ...(tags.dado?.data ?? []).map((tg) => ({ caminho: `/tags/${tg.slug}` })),
  ];
  return new Response(sitemap(origemPublica(url), caminhos), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': apiIndisponivel() ? 'no-store' : 'public, s-maxage=600, stale-while-revalidate=3600',
    },
  });
};
