/* comum — o que aparece em toda página: nav, rodapé, layout, estado
   vazio, rótulos de status e tempo relativo.

   Os status seguem o vocabulário canônico do VISAO §14; o inglês
   traduz o mesmo termo, sem sinônimo novo. Minúsculo onde o original
   é minúsculo: a nav e os chips são escritos assim de propósito. */

const ptBR = {
  'comum.layout.titulo': 'Idearium',
  'comum.layout.descricao': 'Periódico aberto de construção coletiva',

  'comum.nav.labs': 'laboratórios',
  'comum.nav.rfcs': 'ideias',
  'comum.nav.builders': 'mãos',
  'comum.nav.sobre': 'sobre',
  'comum.nav.buscar': 'buscar',
  'comum.nav.entrar': 'entrar',
  'comum.nav.idioma': 'idioma',

  /* O convite é escrito no idioma pra onde ele leva: quem vai ler em
     inglês lê o convite em inglês. Por isso a página em pt-BR usa as
     chaves de `en` e vice-versa (ver Nav.astro). */
  'comum.sugestao.ler': 'Ler em português',
  'comum.sugestao.dispensar': 'dispensar',

  'comum.rodape.marca': 'idearium · construção coletiva',
  'comum.rodape.governanca': 'governança',
  'comum.rodape.conduta': 'código de conduta',
  'comum.rodape.transparencia': 'transparência',

  'comum.vazio.rotulo.falha': 'sem resposta do servidor',
  'comum.vazio.rotulo.nada': 'nada por aqui',
  'comum.vazio.falha.titulo': 'O servidor não respondeu',
  'comum.api.aviso': 'Não consegui falar com o servidor.',
  'comum.acao.escrever.primeira': 'escrever a primeira',

  'comum.status.DRAFT': 'rascunho',
  'comum.status.IN_DISCUSSION': 'em discussão',
  'comum.status.IN_BUILDING': 'em construção',
  'comum.status.PUBLISHED': 'publicada',
  'comum.status.ARCHIVED': 'arquivada',

  'comum.tempo.hoje': 'hoje',
  'comum.tempo.dia': 'há 1 dia',
  'comum.tempo.dias': 'há {n} dias',
  'comum.tempo.mes': 'há 1 mês',
  'comum.tempo.meses': 'há {n} meses',

  'comum.materia.alt': 'Campo de dados em dithering, {codigo}',
};

const en: Record<keyof typeof ptBR, string> = {
  'comum.layout.titulo': 'Idearium',
  'comum.layout.descricao': 'An open journal of collective building',

  'comum.nav.labs': 'labs',
  'comum.nav.rfcs': 'ideas',
  'comum.nav.builders': 'hands',
  'comum.nav.sobre': 'about',
  'comum.nav.buscar': 'search',
  'comum.nav.entrar': 'sign in',
  'comum.nav.idioma': 'language',

  'comum.sugestao.ler': 'Read in English',
  'comum.sugestao.dispensar': 'dismiss',

  'comum.rodape.marca': 'idearium · collective building',
  'comum.rodape.governanca': 'governance',
  'comum.rodape.conduta': 'code of conduct',
  'comum.rodape.transparencia': 'transparency',

  'comum.vazio.rotulo.falha': 'no response from the server',
  'comum.vazio.rotulo.nada': 'nothing here',
  'comum.vazio.falha.titulo': 'The server did not respond',
  'comum.api.aviso': 'I could not reach the server.',
  'comum.acao.escrever.primeira': 'write the first one',

  'comum.status.DRAFT': 'draft',
  'comum.status.IN_DISCUSSION': 'in discussion',
  'comum.status.IN_BUILDING': 'being built',
  'comum.status.PUBLISHED': 'published',
  'comum.status.ARCHIVED': 'archived',

  'comum.tempo.hoje': 'today',
  'comum.tempo.dia': '1 day ago',
  'comum.tempo.dias': '{n} days ago',
  'comum.tempo.mes': '1 month ago',
  'comum.tempo.meses': '{n} months ago',

  'comum.materia.alt': 'Dithered data field, {codigo}',
};

export default { 'pt-BR': ptBR, en };
