/* ================================================================
   cache.ts — cabeçalho de cache das páginas públicas
   ================================================================
   As páginas públicas deixaram de ser pré-renderizadas: são SSR, e o
   cache HTTP é o que devolve a elas o custo baixo do HTML estático.
   Para quem não está logado, a página é igual pra todo mundo e pode
   ficar num cache compartilhado (CDN, proxy reverso):

     s-maxage=60                 um minuto servindo do cache
     stale-while-revalidate=600  depois disso, serve a cópia velha
                                 enquanto busca a nova por trás

   Ideia nova aparece em até um minuto, sem rebuild.

   Com sessão a página mostra coisa da pessoa (o @ na nav, a inscrição
   dela), então sai `private, no-store`. A sessão é detectada pelo
   cookie da requisição, e não só por `locals.usuario`: um refresh que
   falhou devolve Set-Cookie apagando os tokens, e resposta com
   Set-Cookie não pode ir pra cache compartilhado.

   Requisito pra quem configurar o cache na frente do Node: requisição
   com cookie id_acesso ou id_renova passa direto (bypass), senão a
   pessoa logada recebe a cópia anônima.

   Uso, no fim do frontmatter, DEPOIS das chamadas à API:
     cachePublico(Astro);
   Página com fetch próprio (fora de api.ts) passa a falha dela:
     cachePublico(Astro, caiu);
   ================================================================ */
import { apiIndisponivel } from './api';

const COM_SESSAO = /(?:^|;\s*)id_(?:acesso|renova)=/;

export function cachePublico(
  astro: { request: Request; locals: App.Locals; response: { headers: Headers } },
  falhou = apiIndisponivel(),
) {
  const cookie = astro.request.headers.get('cookie') ?? '';
  const publico =
    astro.request.method === 'GET' &&
    astro.locals.usuario == null &&
    !COM_SESSAO.test(cookie) &&
    /* página montada com a API fora não fica no cache: o aviso de
       queda seria servido por minutos depois de a API voltar */
    !falhou;

  astro.response.headers.set(
    'Cache-Control',
    publico ? 'public, s-maxage=60, stale-while-revalidate=600' : 'private, no-store',
  );
}
