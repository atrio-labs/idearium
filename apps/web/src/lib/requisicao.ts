/* ================================================================
   requisicao.ts — estado que vale por requisição, não por processo
   ================================================================
   Com tudo em SSR, um `let` de módulo vale pra todas as requisições do
   processo Node ao mesmo tempo. Foi o problema do antigo
   `apiIndisponivel` de api.ts: a primeira queda da API ligava a flag e
   ela nunca mais desligava, contaminando o aviso de todas as páginas.

   O AsyncLocalStorage dá a cada requisição a sua própria cópia. O
   middleware abre o contexto; api.ts e sessao.ts leem dele sem que
   ninguém precise passar o idioma de mão em mão.

   Limite: o contexto é garantido no frontmatter das páginas e no
   middleware. Componente filho renderizado durante o streaming pode
   rodar fora dele; por isso chamada à API mora na página, e o
   componente recebe o dado por prop.

   Só servidor: não importe isto de <script> nem de ilha React.
   ================================================================ */
import { AsyncLocalStorage } from 'node:async_hooks';
import { IDIOMA_PADRAO, type Idioma } from './i18n';

interface Requisicao {
  lang: Idioma;
  /** alguma chamada à API caiu nesta requisição (404 não conta) */
  apiFalhou: boolean;
}

const armazem = new AsyncLocalStorage<Requisicao>();

export const dentroDaRequisicao = <T>(lang: Idioma, fn: () => T): T =>
  armazem.run({ lang, apiFalhou: false }, fn);

/** Idioma pro header x-lang da API. Fora de requisição, o padrão. */
export const idiomaDaRequisicao = (): Idioma => armazem.getStore()?.lang ?? IDIOMA_PADRAO;

export const marcarFalhaDaApi = () => {
  const r = armazem.getStore();
  if (r) r.apiFalhou = true;
};

export const apiFalhouNestaRequisicao = () => armazem.getStore()?.apiFalhou ?? false;
