/* GET /og/rfc/:slug.png — a imagem da ideia, com a mesma semente do
   <Materia> da página (materiaDaRfc). RFC inexistente ou ainda sem
   número (rascunho) devolve a imagem padrão: o link continua bonito. */
import type { APIRoute } from 'astro';
import { materiaDaRfc, obterRfc } from '../../../lib/api';
import { imagemOg } from '../../../lib/og-imagem';

export const GET: APIRoute = async ({ params }) => {
  const rfc = await obterRfc(params.slug ?? '');
  let png: Buffer;
  if (rfc && rfc.number != null) {
    const { tipo, semente } = materiaDaRfc(rfc);
    png = imagemOg(tipo, rfc.lab.slug, semente);
  } else {
    png = imagemOg('mancha', 'idearium', 2026);
  }
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': rfc ? 'public, max-age=3600, s-maxage=86400' : 'public, max-age=60',
    },
  });
};
