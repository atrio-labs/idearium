/* ================================================================
   markdown.ts — o corpo da RFC, de markdown para HTML
   ================================================================
   O corpo é escrito por qualquer pessoa com conta e injetado na
   página com set:html. Então este arquivo é, antes de tudo, uma
   fronteira de segurança: o que sai daqui vai pro DOM de quem lê.

   Roda só no servidor: a página da RFC e o endpoint de prévia
   (/api/previa) chamam a MESMA função, e por isso o que o editor
   mostra é o que a página vai mostrar.

   O que fecha a porta para XSS, camada por camada:

   1. `html: false`. Tag escrita no texto não vira tag: sai escapada,
      como texto. Não há sanitizador de HTML aqui porque não entra
      HTML pra sanitizar.
   2. validateLink. O padrão do markdown-it já recusa javascript:,
      vbscript:, file: e data: (exceto imagem). Por cima dele, só
      passam http:, https:, mailto: e endereço sem esquema. data:
      cai inteiro, inclusive o de imagem, que só faria sentido com a
      regra de imagem ligada.
   3. Imagem desligada. Não há onde guardar imagem no Idearium, e
      imagem externa é carregada sozinha, sem clique: cada leitura da
      RFC entregaria o IP de quem lê ao dono do servidor da imagem.
      Num projeto de bem comum isso é rastreamento. Com a regra
      desligada, `![x](url)` vira um "!" seguido de link comum, que
      só sai da página se a pessoa clicar.
   4. Link com rel="nofollow ugc noopener noreferrer" e sem target:
      não passa autoridade de busca pra link de usuário, não entrega
      window.opener nem o Referer da RFC, e abre na mesma aba.
   ================================================================ */
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt('default', {
  html: false,
  linkify: true,
  /* aspas e travessões "inteligentes" mudariam o texto que a pessoa
     digitou; o corpo aparece como foi escrito */
  typographer: false,
  /* o corpo vem quebrado em ~80 colunas: parágrafo termina em linha
     vazia, não em Enter */
  breaks: false,
});

md.disable('image');

const ESQUEMAS_ACEITOS = new Set(['http:', 'https:', 'mailto:']);
const validarPadrao = md.validateLink.bind(md);

md.validateLink = (url: string) => {
  if (!validarPadrao(url)) return false;
  const esquema = /^([a-z][a-z0-9+.-]*:)/i.exec(url.trim());
  return !esquema || ESQUEMAS_ACEITOS.has(esquema[1].toLowerCase());
};

/* O título da RFC já é o h1 da página. Seção do corpo começa em h2:
   # e ## viram h2, e daí pra baixo tudo vira h3. Mexer na tag do token
   depois do parse vale pra abertura e fechamento de uma vez. */
md.core.ruler.push('titulos_do_corpo', (estado) => {
  for (const t of estado.tokens) {
    if (t.type !== 'heading_open' && t.type !== 'heading_close') continue;
    const nivel = Number(t.tag.slice(1));
    t.tag = nivel <= 2 ? 'h2' : 'h3';
  }
});

md.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
  const t = tokens[idx];
  t.attrSet('rel', 'nofollow ugc noopener noreferrer');
  /* ninguém põe target pelo markdown, mas a regra fica explícita */
  const alvo = t.attrIndex('target');
  if (alvo >= 0) t.attrs!.splice(alvo, 1);
  return self.renderToken(tokens, idx, options);
};

/** Markdown escrito por usuário vira HTML seguro pra set:html. */
export function renderizarMarkdown(texto: string): string {
  return md.render(texto ?? '');
}
