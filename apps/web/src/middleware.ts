/* ================================================================
   middleware.ts — resolve a sessão uma vez por requisição
   ================================================================
   Sem isso, cada página autenticada chamaria /auth/me por conta
   própria e a renovação do token poderia disparar em paralelo, com
   duas rotações concorrentes do refresh (a segunda falharia, porque a
   API revoga o token anterior a cada rotação).

   Páginas pré-renderizadas não passam por aqui: elas não têm request.
   ================================================================ */
import { defineMiddleware } from 'astro:middleware';
import { usuarioAtual } from './lib/sessao';

export const onRequest = defineMiddleware(async (context, next) => {
  /* rotas estáticas não têm cookie nem sessão pra resolver */
  if (context.isPrerendered) return next();

  context.locals.usuario = await usuarioAtual(context.cookies);
  return next();
});
