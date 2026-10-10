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
import type { StateCore, Token } from 'markdown-it';
import { rota, type Idioma } from './i18n';

/* Duas instâncias com as mesmas travas de segurança: uma pro corpo da
   RFC e outra pro comentário. A de comentário desliga título e tabela
   (comentário é conversa, não documento) e liga a menção @username. */
function criar(comentario: boolean) {
  const md = new MarkdownIt('default', {
    html: false,
    linkify: true,
    /* aspas e travessões "inteligentes" mudariam o texto que a pessoa
       digitou; o corpo aparece como foi escrito */
    typographer: false,
    /* o corpo vem quebrado em ~80 colunas: parágrafo termina em linha
       vazia, não em Enter */
    breaks: comentario,
  });

  md.disable('image');
  if (comentario) md.disable(['heading', 'lheading', 'table']);

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

  if (comentario) md.core.ruler.push('mencoes', regraMencoes);
  return md;
}

/* Mesmo padrão do username da API (USERNAME_REGEX): 3-30, minúsculas,
   dígitos, ".", "_" e "-". A borda esquerda impede pegar o "@" de um
   email ("a@b.com") ou de uma palavra colada; ponto final de frase
   não entra no nome. */
const MENCAO = /(^|[^\w.@/+-])@([a-z0-9._-]{3,30})(?![a-z0-9_@-])/g;

function regraMencoes(estado: StateCore) {
  const lang = (estado.env as { lang?: Idioma } | undefined)?.lang ?? 'pt-BR';
  for (const bloco of estado.tokens) {
    if (bloco.type !== 'inline' || !bloco.children) continue;
    const saida: Token[] = [];
    let dentroDeLink = 0;
    for (const filho of bloco.children) {
      if (filho.type === 'link_open') dentroDeLink++;
      if (filho.type === 'link_close') dentroDeLink--;
      /* só texto solto: código em linha tem token próprio, e link
         (inclusive o que o linkify faz de email) não é tocado */
      if (filho.type !== 'text' || dentroDeLink > 0 || !filho.content.includes('@')) {
        saida.push(filho);
        continue;
      }
      let resto = 0;
      const texto = filho.content;
      const pedacoDeTexto = (conteudo: string) => {
        if (!conteudo) return;
        const t = new estado.Token('text', '', 0);
        t.content = conteudo;
        saida.push(t);
      };
      for (const m of texto.matchAll(MENCAO)) {
        let nome = m[2];
        /* "@ana." no fim da frase: o ponto é da frase */
        const sobra = /[.]+$/.exec(nome);
        if (sobra) nome = nome.slice(0, -sobra[0].length);
        if (nome.length < 3) continue;
        const inicio = m.index! + m[1].length;
        pedacoDeTexto(texto.slice(resto, inicio));
        const abre = new estado.Token('link_open', 'a', 1);
        abre.attrSet('href', rota(lang, `/users/${nome}`));
        abre.attrSet('class', 'mencao');
        const dentro = new estado.Token('text', '', 0);
        dentro.content = `@${nome}`;
        saida.push(abre, dentro, new estado.Token('link_close', 'a', -1));
        resto = inicio + 1 + nome.length;
      }
      pedacoDeTexto(texto.slice(resto));
    }
    bloco.children = saida;
  }
}

const mdRfc = criar(false);
const mdComentario = criar(true);

/** Markdown escrito por usuário vira HTML seguro pra set:html. */
export function renderizarMarkdown(texto: string): string {
  return mdRfc.render(texto ?? '');
}

/** Comentário: mesmo markdown seguro, sem título nem tabela, e
 *  @username vira link pro perfil (no idioma da interface). */
export function renderizarComentario(texto: string, lang: Idioma = 'pt-BR'): string {
  return mdComentario.render(texto ?? '', { lang });
}
