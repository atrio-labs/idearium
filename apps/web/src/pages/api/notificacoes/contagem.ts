/* ================================================================
   GET /api/notificacoes/contagem — há notificação nova?
   ================================================================
   O que o marcador da nav consulta a cada 60s. Existe porque o token
   mora em cookie httpOnly: o navegador não fala com a API direto, fala
   com este endpoint, que chama a API no servidor com a sessão.

   Responde só { novas: true | false | null }, nunca a contagem. A nav
   não mostra número (VISAO §9), então o número nem sai daqui. null é
   "não deu pra saber" (API fora, endpoint ausente, meta.unread que não
   veio): o cliente mantém o marcador como estava.

   Cache-Control: private, no-store. A resposta é de uma pessoa só.
   ================================================================ */
import type { APIRoute } from 'astro';
import { haNovas, notificacoesLigadas } from '../../../lib/notificacoes';

export const prerender = false;

const json = (status: number, corpo: unknown) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-store' },
  });

export const GET: APIRoute = async ({ cookies, locals }) => {
  if (!notificacoesLigadas()) return json(404, { novas: null });
  if (!locals.usuario) return json(401, { novas: null });
  return json(200, { novas: await haNovas(cookies) });
};
