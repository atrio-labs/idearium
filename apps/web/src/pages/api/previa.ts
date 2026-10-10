/* ================================================================
   POST /api/previa — o corpo em markdown, renderizado como a RFC
   ================================================================
   O editor manda o texto e recebe o HTML que a página da RFC vai
   mostrar. É a mesma função (lib/markdown.ts), então a prévia não tem
   como divergir do resultado — e o renderer, que é a fronteira de
   segurança, continua só no servidor.

   Não grava nada. Exige sessão mesmo assim: só quem escreve RFC
   precisa de prévia, e sem a guarda isto seria um renderer de
   markdown aberto pra qualquer um usar como serviço.
   ================================================================ */
import type { APIRoute } from 'astro';
import { renderizarMarkdown } from '../../lib/markdown';
import { IDIOMA_PADRAO, IDIOMAS, t, type Idioma } from '../../lib/i18n';

export const prerender = false;

/* O corpo aceita até 50.000 caracteres (CreateRfcDto). Em UTF-8 isso
   pode passar de 100 kB com acento e símbolo, então o teto em bytes
   fica folgado e o de caracteres é o que espelha a API. */
const MAX_CARACTERES = 50_000;
const MAX_BYTES = 256 * 1024;

const json = (status: number, corpo: unknown) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

/* O editor manda o idioma da tela no header X-Idioma; valor que não é
   um idioma conhecido cai no padrão. */
const idiomaDe = (request: Request): Idioma => {
  const pedido = request.headers.get('x-idioma');
  return IDIOMAS.find((i) => i === pedido) ?? IDIOMA_PADRAO;
};

export const POST: APIRoute = async ({ request, locals }) => {
  const lang = idiomaDe(request);
  if (!locals.usuario) return json(401, { erro: t(lang, 'rfcs.previa.sessao') });

  /* JSON e não formulário: um site de fora não consegue mandar esse
     tipo sem preflight, e o cookie sameSite lax já não iria junto */
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json(415, { erro: t(lang, 'rfcs.previa.json') });
  }

  const declarado = Number(request.headers.get('content-length'));
  if (declarado > MAX_BYTES) return json(413, { erro: t(lang, 'rfcs.previa.grande') });

  const bruto = await request.text();
  if (new TextEncoder().encode(bruto).length > MAX_BYTES) {
    return json(413, { erro: t(lang, 'rfcs.previa.grande') });
  }

  let corpo: unknown;
  try {
    corpo = (JSON.parse(bruto) as { corpo?: unknown })?.corpo;
  } catch {
    return json(400, { erro: t(lang, 'rfcs.previa.pedido') });
  }
  if (typeof corpo !== 'string') return json(400, { erro: t(lang, 'rfcs.previa.pedido') });
  if (corpo.length > MAX_CARACTERES) {
    return json(413, {
      erro: t(lang, 'rfcs.previa.caracteres', {
        max: MAX_CARACTERES.toLocaleString(lang === 'en' ? 'en' : 'pt-BR'),
      }),
    });
  }

  return json(200, { html: renderizarMarkdown(corpo) });
};
