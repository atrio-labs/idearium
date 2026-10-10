/* ================================================================
   /entrar/github e /entrar/google — início do fluxo OAuth (Etapa 6)
   ================================================================
   Servidor, sem tela. Gera o `state`, grava no cookie httpOnly e manda
   a pessoa pra API, que cuida do provedor. Contrato proposto (ver
   ROADMAP_FRONTEND.md):

     GET  /entrar/<provedor>   entrar: redireciona pra
                               <API>/auth/<provedor>?redirect=<WEB>/entrar/callback&state=...
     POST /entrar/<provedor>   vincular a uma conta logada: pede à API a
                               URL de autorização (POST /users/me/link-<provedor>)

   O vínculo é POST porque muda a conta; o login é GET porque é só um
   link. Com PUBLIC_OAUTH desligada a rota não existe (404).
   ================================================================ */
import type { APIRoute } from 'astro';
import { OAUTH_ATIVO, abrirEstado, ehProvedor } from '../../lib/oauth';
import { destinoSeguro, iniciarVinculo } from '../../lib/sessao';
import { idiomaDe, rota, separarIdioma } from '../../lib/i18n';

const API = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000';

const naoExiste = () => new Response(null, { status: 404 });

export const GET: APIRoute = (context) => {
  const provedor = context.params.provedor;
  if (!OAUTH_ATIVO || !ehProvedor(provedor)) return naoExiste();

  const lang = idiomaDe(context);
  const voltar = separarIdioma(
    destinoSeguro(context.url.searchParams.get('voltar'), context.url.origin),
  ).caminho;

  if (context.locals.usuario) return context.redirect(rota(lang, voltar));

  const state = abrirEstado(context.cookies, { provedor, modo: 'entrar', voltar, lang });
  const destino = new URL(`/auth/${provedor}`, API);
  destino.searchParams.set('redirect', `${context.url.origin}/entrar/callback`);
  destino.searchParams.set('state', state);
  return context.redirect(destino.toString());
};

export const POST: APIRoute = async (context) => {
  const provedor = context.params.provedor;
  if (!OAUTH_ATIVO || !ehProvedor(provedor)) return naoExiste();

  const lang = idiomaDe(context);
  if (!context.locals.usuario) {
    return context.redirect(rota(lang, '/entrar?voltar=%2Fperfil'), 303);
  }

  const state = abrirEstado(context.cookies, { provedor, modo: 'vincular', voltar: '/perfil', lang });
  const r = await iniciarVinculo(
    context.cookies,
    provedor,
    `${context.url.origin}/entrar/callback`,
    state,
  );

  const url = r.dado?.url;
  if (r.ok && typeof url === 'string' && /^https?:\/\//.test(url)) {
    return context.redirect(url, 303);
  }
  return context.redirect(rota(lang, '/perfil?conta=erro'), 303);
};
