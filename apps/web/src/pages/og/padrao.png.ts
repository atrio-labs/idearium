/* GET /og/padrao.png — imagem de compartilhamento padrão (só lê, sem estado) */
import type { APIRoute } from 'astro';
import { imagemOg } from '../../lib/og-imagem';

export const GET: APIRoute = () =>
  new Response(imagemOg('mancha', 'idearium', 2026), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
  });
