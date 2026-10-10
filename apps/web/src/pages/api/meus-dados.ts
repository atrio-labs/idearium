/* ================================================================
   GET /api/meus-dados — baixar os próprios dados (LGPD art. 18)
   ================================================================
   O token mora em cookie httpOnly, então o navegador não fala com a
   API direto: este endpoint chama GET /users/me/export no servidor,
   com a sessão, e entrega o JSON como download. O token nunca sai.

   Atrás de PUBLIC_CONTA. Sem a flag, 404. Sem sessão, 401. Com a API
   sem o endpoint (404/405), 501 e texto simples: "ainda não disponível".
   Cache-Control: private, no-store. A resposta é de uma pessoa só.
   ================================================================ */
import type { APIRoute } from 'astro';
import { CONTA_LIGADA, exportarDados } from '../../lib/conta';

export const prerender = false;

const texto = (status: number, corpo: string) =>
  new Response(corpo, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'private, no-store' },
  });

export const GET: APIRoute = async ({ cookies, locals }) => {
  if (!CONTA_LIGADA) return texto(404, 'not found');
  const usuario = locals.usuario;
  if (!usuario) return texto(401, 'unauthorized');

  const r = await exportarDados(cookies);
  if (r.situacao === 'indisponivel') return texto(501, 'not available yet');
  if (r.situacao !== 'ok' || r.dado == null) return texto(502, 'could not export now');

  const dia = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify(r.dado, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="idearium-${usuario.username}-${dia}.json"`,
      'Cache-Control': 'private, no-store',
    },
  });
};
