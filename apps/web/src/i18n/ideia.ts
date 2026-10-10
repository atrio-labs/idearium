/* ideia — comentário em markdown, tradução e acompanhar (frente C5). */

const ptBR = {
  'ideia.formato':
    'Markdown simples: **negrito**, *itálico*, `código`, listas com "-", ' +
    'citação com ">". Escreva @nome para chamar alguém.',

  'ideia.traducao.de': 'tradução de',
  'ideia.traducao.acao': 'traduzir esta ideia',
  'ideia.traducao.acao.nota': 'Escreva esta ideia em outro idioma, ligada à original.',
  'ideia.traducoes.titulo': 'traduções desta ideia',
  'ideia.locale.pt-BR': 'português',
  'ideia.locale.en': 'inglês',

  'ideia.nova.locale.rotulo': 'idioma do texto',
  'ideia.nova.locale.ajuda': 'Título, resumo e corpo são escritos neste idioma.',
  'ideia.nova.traducao.antes': 'Você está traduzindo ',
  'ideia.nova.traducao.depois': '. A tradução fica ligada à original e herda o laboratório.',
  'ideia.nova.traducao.erro':
    'Não encontrei a ideia original. Abra a ideia e use "traduzir esta ideia" de novo.',

  'ideia.acompanhar.acao': 'acompanhar',
  'ideia.acompanhar.parar': 'deixar de acompanhar',
  'ideia.acompanhar.nota':
    'Receba avisos desta ideia sem se inscrever para construir. ' +
    'Ninguém vê quem acompanha.',
  'ideia.acompanhar.parar.nota': 'Você recebe os avisos desta ideia. Só você vê isso.',
  'ideia.acompanhar.erro': 'Não consegui mudar o acompanhamento agora. Tente de novo.',
  'ideia.acompanhando.titulo': 'o que acompanho',
  'ideia.acompanhando.vazio':
    'Você não acompanha nenhuma ideia. O botão "acompanhar" fica na página de cada ideia.',
  'ideia.acompanhando.falha': 'Não consegui carregar as ideias que você acompanha.',
};

const en: Record<keyof typeof ptBR, string> = {
  'ideia.formato':
    'Plain markdown: **bold**, *italic*, `code`, lists with "-", ' +
    'quotes with ">". Write @username to mention someone.',

  'ideia.traducao.de': 'translation of',
  'ideia.traducao.acao': 'translate this idea',
  'ideia.traducao.acao.nota': 'Write this idea in another language, linked to the original.',
  'ideia.traducoes.titulo': 'translations of this idea',
  'ideia.locale.pt-BR': 'Portuguese',
  'ideia.locale.en': 'English',

  'ideia.nova.locale.rotulo': 'language of the text',
  'ideia.nova.locale.ajuda': 'Title, summary and body are written in this language.',
  'ideia.nova.traducao.antes': 'You are translating ',
  'ideia.nova.traducao.depois': '. The translation is linked to the original and inherits its lab.',
  'ideia.nova.traducao.erro':
    'I could not find the original idea. Open the idea and use "translate this idea" again.',

  'ideia.acompanhar.acao': 'follow',
  'ideia.acompanhar.parar': 'unfollow',
  'ideia.acompanhar.nota':
    'Get updates on this idea without signing up to build it. ' +
    'Nobody sees who follows.',
  'ideia.acompanhar.parar.nota': 'You get updates on this idea. Only you see this.',
  'ideia.acompanhar.erro': 'I could not change following right now. Try again.',
  'ideia.acompanhando.titulo': 'what I follow',
  'ideia.acompanhando.vazio':
    'You follow no ideas. The "follow" button is on each idea page.',
  'ideia.acompanhando.falha': 'I could not load the ideas you follow.',
};

export default { 'pt-BR': ptBR, en };
