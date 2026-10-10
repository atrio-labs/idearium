/* ================================================================
   middleware.ts — idioma e sessão, uma vez por requisição
   ================================================================
   IDIOMA. /en e /en/* servem a mesma página da rota sem prefixo, com
   `locals.lang = 'en'`. Não há página duplicada: o middleware tira o
   prefixo e reescreve com `next(url)`.

   Por que `next(url)` e não `context.rewrite(url)`: no Astro 6 o
   `context.rewrite` roda o middleware inteiro de novo no caminho novo
   (core/rewrites/handler.js). Aqui isso resolveria a sessão duas vezes
   e a segunda passada, já sem o /en, gravaria pt-BR por cima. O
   `next(url)` só troca a rota a renderizar e mantém `locals` e
   cookies (core/middleware/astro-middleware.js). Método e corpo da
   requisição vão junto, então formulário postado em /en/... funciona.

   Pro middleware rodar, o Astro precisa achar alguma rota pra /en/*;
   sem rota casada ele vai direto pro 404. Quem casa é
   pages/en/[...caminho].astro, que só renderiza se a reescrita não
   achar nada (/en/en/...).

   SESSÃO. Sem isso, cada página autenticada chamaria /auth/me por
   conta própria e a renovação do token poderia disparar em paralelo,
   com duas rotações concorrentes do refresh (a segunda falharia,
   porque a API revoga o token anterior a cada rotação). Como nenhuma
   página é mais pré-renderizada, toda requisição passa por aqui.
   ================================================================ */
import { defineMiddleware } from 'astro:middleware';
import { comSessao, usuarioAtual } from './lib/sessao';
import { COOKIE_SUGESTAO_DISPENSADA, separarIdioma } from './lib/i18n';
import { dentroDaRequisicao } from './lib/requisicao';

export const onRequest = defineMiddleware((context, next) => {
  const { lang, caminho } = separarIdioma(context.url.pathname);
  context.locals.lang = lang;
  context.locals.idiomaPreferido = null;

  return dentroDaRequisicao(lang, async () => {
    /* Com a API fora, usuarioAtual lança (o fetch de /auth/me ou do
       refresh falha na rede). Antes isso derrubava só as rotas com
       sessão; agora que toda página passa por aqui, derrubaria o site
       inteiro pra quem tem cookie. Sem resposta, a requisição segue
       como anônima e os cookies ficam intactos: não é logout. */
    const usuario = await usuarioAtual(context.cookies).catch(() => null);
    context.locals.usuario = usuario;

    /* Idioma salvo no perfil, só pra decidir a sugestão "Read in
       English" (Nav.astro). /auth/me não traz o campo, então custa uma
       chamada a /users/me — e só acontece quando a sugestão ainda pode
       aparecer: GET, sem prefixo, logado e sem ter dispensado. */
    if (
      usuario && lang === 'pt-BR' && context.request.method === 'GET' &&
      !context.cookies.has(COOKIE_SUGESTAO_DISPENSADA)
    ) {
      const r = await comSessao<{ preferredLocale?: string }>(context.cookies, 'GET', '/users/me');
      context.locals.idiomaPreferido = r.dado?.preferredLocale === 'en' ? 'en' : 'pt-BR';
    }

    if (lang === 'pt-BR') return next();
    return next(new URL(caminho + context.url.search, context.url));
  });
});
