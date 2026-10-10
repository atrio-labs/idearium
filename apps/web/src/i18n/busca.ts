/* busca — /buscar e a leitura da consulta (lib/leitura-busca.ts).

   "idioma" aqui tem dois sentidos que não se misturam: o idioma da
   interface (o texto das chaves) e o idioma da busca, que escolhe o
   dicionário do índice. Os nomes dos dois dicionários estão em
   `busca.idioma.*`.

   As chaves `busca.leitura.*` também viajam pro navegador, que remonta
   a leitura a cada tecla; por isso as frases com palavra destacada
   usam {marcadores}: leitura-busca.ts parte o texto neles e devolve a
   palavra como trecho em negrito, sem nunca montar HTML. */

const ptBR = {
  'busca.titulo': 'Idearium · Buscar',
  'busca.titulo.termo': 'Idearium · busca por {termo}',
  'busca.descricao': 'Procure ideias abertas por palavra, laboratório e idioma.',
  'busca.h1.antes': 'Procure pelo problema, ',
  'busca.h1.apagado': 'em um idioma por vez.',
  'busca.sub':
    'A busca lê o título, o resumo e o corpo das ideias já publicadas. ' +
    'Rascunho não aparece aqui.',
  'busca.sub.idioma':
    'Ela lê um idioma por vez e não cruza os dois: uma consulta em ' +
    'português só encontra ideias escritas em português, e o mesmo vale ' +
    'para o inglês.',

  'busca.campo.rotulo': 'o que você procura',
  'busca.campo.exemplo': 'alagamento, merenda, transporte',
  'busca.botao': 'buscar',
  'busca.filtro.lab': 'laboratório',
  'busca.filtro.todos': 'todos',
  'busca.filtro.idioma': 'idioma da busca',
  'busca.idioma.pt-BR': 'português',
  'busca.idioma.en': 'inglês',

  'busca.erro.curto': 'Escreva pelo menos duas letras.',
  'busca.erro.recusada':
    'A busca recusou esta consulta. Ela aceita até 200 caracteres no termo.',

  'busca.aviso.resto': 'O resultado abaixo pode estar vazio por isso, não por falta de ideias.',

  'busca.convite.rotulo': 'por onde começar',
  'busca.convite.texto':
    'Escreva uma palavra do problema, não o nome de um projeto. Quem ' +
    'escreveu a ideia descreveu o que dói, e é isso que está indexado.',
  'busca.convite.ordem': 'as mais usadas primeiro · ',
  'busca.convite.todas': 'ver todas as tags',
  'busca.convite.semtags.queda': 'As tags aparecem aqui assim que o servidor responder. ',
  'busca.convite.semtags': 'Nenhuma ideia foi marcada com tag ainda. ',
  'busca.acao.ideias': 'ver todas as ideias',

  'busca.contagem.um': '{n} ideia encontrada',
  'busca.contagem.varios': '{n} ideias encontradas',
  'busca.contagem.lab': ' em {lab}',
  'busca.contagem.idioma': ' · só em {idioma}',
  'busca.contagem.mostrando': ' · mostrando {n}',
  'busca.contagem.ordem': ' · mais próximas da consulta primeiro, não mais recentes',

  'busca.queda.texto': 'Assim que a API voltar, o resultado aparece aqui.',
  'busca.recusada.titulo': 'A consulta não foi aceita',
  'busca.recusada.texto': 'A busca não chegou a rodar. Encurte o termo e tente de novo.',

  'busca.semachado.rotulo': 'a busca rodou e voltou vazia',
  'busca.semachado.titulo': 'Nada encontrado para ',
  'busca.semachado.sugestao': 'A consulta rodou inteira e nenhuma ideia casou com ela.',
  'busca.semachado.recorte':
    'Talvez o recorte esteja apertado. Tente sem escolher laboratório, ou no outro idioma.',
  'busca.semachado.geral':
    'Tente uma palavra mais geral, ou o termo que a pessoa usaria para descrever o problema.',
  'busca.oferta.rotulo': 'esta palavra existe no acervo, com acento',
  'busca.oferta.um': '{n} ideia — buscar assim',
  'busca.oferta.varios': '{n} ideias — buscar assim',

  'busca.leitura.titulo': 'como a busca lê',
  'busca.leitura.descartadas': 'descartadas',
  'busca.leitura.dicionario': 'dicionário',
  'busca.leitura.recorte': 'recorte',
  'busca.leitura.recorte.todos': 'todos os laboratórios',
  'busca.leitura.peso': 'peso',
  'busca.leitura.peso.valor': 'título › resumo › corpo',

  /* usadas por leitura-busca.ts, no servidor e no navegador */
  'busca.leitura.junta': 'e',
  'busca.leitura.nada': 'nada sobrou',
  'busca.leitura.fantasma': 'sua palavra aparece aqui',
  'busca.leitura.exige.nenhuma': 'toda palavra que você escrever vira uma exigência.',
  'busca.leitura.exige.descartou': 'o dicionário descarta todas. Não sobra nada para procurar.',
  'busca.leitura.exige.uma': 'a ideia precisa ter esta palavra.',
  'busca.leitura.exige.duas': 'a ideia precisa ter as duas, na mesma ideia.',
  'busca.leitura.exige.varias': 'todas juntas, na mesma ideia.',
  'busca.leitura.acento.acentuada':
    'você escreveu {palavra} com acento. Para a busca, {sem} seria outra palavra.',
  'busca.leitura.acento.acentuavel':
    'se {palavra} leva acento, escreva com ele. A busca guarda o acento, ' +
    'então a versão acentuada é outra palavra.',
  'busca.leitura.acento.exemplo':
    'a busca guarda o acento: {sem} e {com} são palavras diferentes.',
  'busca.leitura.radical':
    'O dicionário compara radicais — {a} encontra {b} — e descarta ' +
    'palavra comum demais, como {c} ou {d}.',
};

const en: Record<keyof typeof ptBR, string> = {
  'busca.titulo': 'Idearium · Search',
  'busca.titulo.termo': 'Idearium · search for {termo}',
  'busca.descricao': 'Find open ideas by word, lab and language.',
  'busca.h1.antes': 'Search for the problem, ',
  'busca.h1.apagado': 'one language at a time.',
  'busca.sub':
    'Search reads the title, the summary and the body of ideas that are ' +
    'already published. Drafts do not show up here.',
  'busca.sub.idioma':
    'It reads one language at a time and does not cross between them: a ' +
    'query in English only finds ideas written in English, and the same ' +
    'goes for Portuguese.',

  'busca.campo.rotulo': 'what are you looking for',
  'busca.campo.exemplo': 'flooding, school lunch, transit',
  'busca.botao': 'search',
  'busca.filtro.lab': 'lab',
  'busca.filtro.todos': 'all',
  'busca.filtro.idioma': 'search language',
  'busca.idioma.pt-BR': 'Portuguese',
  'busca.idioma.en': 'English',

  'busca.erro.curto': 'Type at least two letters.',
  'busca.erro.recusada':
    'Search refused this query. It accepts up to 200 characters in the term.',

  'busca.aviso.resto': 'The result below may be empty because of that, not because there are no ideas.',

  'busca.convite.rotulo': 'where to start',
  'busca.convite.texto':
    'Type a word from the problem, not the name of a project. Whoever ' +
    'wrote the idea described what hurts, and that is what is indexed.',
  'busca.convite.ordem': 'most used first · ',
  'busca.convite.todas': 'see all tags',
  'busca.convite.semtags.queda': 'Tags show up here as soon as the server responds. ',
  'busca.convite.semtags': 'No idea has been given a tag yet. ',
  'busca.acao.ideias': 'see all ideas',

  'busca.contagem.um': '{n} idea found',
  'busca.contagem.varios': '{n} ideas found',
  'busca.contagem.lab': ' in {lab}',
  'busca.contagem.idioma': ' · only in {idioma}',
  'busca.contagem.mostrando': ' · showing {n}',
  'busca.contagem.ordem': ' · closest to the query first, not most recent',

  'busca.queda.texto': 'As soon as the API is back, the result shows up here.',
  'busca.recusada.titulo': 'The query was not accepted',
  'busca.recusada.texto': 'The search did not run. Shorten the term and try again.',

  'busca.semachado.rotulo': 'the search ran and came back empty',
  'busca.semachado.titulo': 'Nothing found for ',
  'busca.semachado.sugestao': 'The query ran in full and no idea matched it.',
  'busca.semachado.recorte':
    'The filter may be too narrow. Try without choosing a lab, or in the other language.',
  'busca.semachado.geral':
    'Try a more general word, or the term someone would use to describe the problem.',
  'busca.oferta.rotulo': 'this word exists in the collection, with an accent',
  'busca.oferta.um': '{n} idea — search this way',
  'busca.oferta.varios': '{n} ideas — search this way',

  'busca.leitura.titulo': 'how search reads',
  'busca.leitura.descartadas': 'discarded',
  'busca.leitura.dicionario': 'dictionary',
  'busca.leitura.recorte': 'filter',
  'busca.leitura.recorte.todos': 'all labs',
  'busca.leitura.peso': 'weight',
  'busca.leitura.peso.valor': 'title › summary › body',

  'busca.leitura.junta': 'and',
  'busca.leitura.nada': 'nothing left',
  'busca.leitura.fantasma': 'your word shows up here',
  'busca.leitura.exige.nenhuma': 'every word you type becomes a requirement.',
  'busca.leitura.exige.descartou': 'the dictionary discards all of them. Nothing is left to search for.',
  'busca.leitura.exige.uma': 'the idea must have this word.',
  'busca.leitura.exige.duas': 'the idea must have both, in the same idea.',
  'busca.leitura.exige.varias': 'all together, in the same idea.',
  'busca.leitura.acento.acentuada':
    'you wrote {palavra} with an accent. To search, {sem} would be a different word.',
  'busca.leitura.acento.acentuavel':
    'if {palavra} takes an accent, type it with the accent. Search keeps ' +
    'accents, so the accented version is a different word.',
  'busca.leitura.acento.exemplo':
    'search keeps accents: {sem} and {com} are different words.',
  'busca.leitura.radical':
    'The dictionary compares word stems — {a} finds {b} — and discards ' +
    'words too common to matter, like {c} or {d}.',
};

export default { 'pt-BR': ptBR, en };
