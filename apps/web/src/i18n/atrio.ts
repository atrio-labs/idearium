/* atrio — a página inicial (src/pages/index.astro).

   A frase âncora do VISAO §12, "não precisa saber fazer. precisa só
   querer que aconteça.", aparece na chamada final. O inglês mantém a
   mesma estrutura curta, sem virar slogan. */

const ptBR = {
  'atrio.titulo': 'Idearium · Átrio',

  'atrio.abertura.antes': 'Ideias abertas, esperando ',
  'atrio.abertura.serif': 'quem sabe fazer',
  'atrio.abertura.depois': '.',
  'atrio.abertura.sub':
    'Alguém vê um problema de perto e escreve. Outra pessoa sabe construir e ' +
    'procura no que aplicar isso. O Idearium é o lugar onde os dois se ' +
    'encontram — sem gatekeeper, sem taxa, e com o crédito dividido.',
  'atrio.ciclo': 'uma ideia atravessa quatro estados:',
  'atrio.vira': 'vira',

  'atrio.etapa1.titulo': 'Alguém escreve',
  'atrio.etapa1.texto':
    'Uma ideia vira proposta numerada. Não precisa saber construir — precisa conhecer o problema.',
  'atrio.etapa2.titulo': 'A comunidade refina',
  'atrio.etapa2.texto':
    'Gente comenta, contesta, corrige. A proposta muda e o histórico fica: nada é apagado.',
  'atrio.etapa3.titulo': 'Alguém se inscreve',
  'atrio.etapa3.texto':
    'Quem sabe fazer entra. Sem aprovação e sem contrato — e pode sair quando quiser, publicamente.',
  'atrio.etapa4.titulo': 'Vira real, e segue aberta',
  'atrio.etapa4.texto':
    'Quando existe, o crédito é de todos que passaram por ela. E outra cidade pode construir de novo.',

  'atrio.faixa.rotulo': 'uma delas, agora',
  'atrio.faixa.todas': 'ver todas as ideias abertas →',
  'atrio.aviso.texto':
    'O que aparece abaixo pode estar incompleto. O conteúdo volta sozinho quando a API responder.',

  'atrio.trilha.titulo': 'O que já existe',
  'atrio.trilha.barras': '{dados} de {total} passos dados',
  'atrio.passo.escrita': 'Proposta escrita',
  'atrio.passo.escrita.resto': 'e numerada como {codigo}',
  'atrio.passo.discutida': 'Discutida em público',
  'atrio.passo.discutida.um': '1 comentário',
  'atrio.passo.discutida.varios': '{n} comentários',
  'atrio.passo.discutida.nenhum': '— ninguém comentou ainda',
  'atrio.passo.inscricao': 'Alguém se inscreveu',
  'atrio.passo.inscricao.um': '1 pessoa construindo',
  'atrio.passo.inscricao.varios': '{n} pessoas construindo',
  'atrio.passo.inscricao.nenhum': '— a vaga está aberta',

  'atrio.errata.gatilho': 'errata · 1 correção',
  'atrio.errata.data': 'corrigido {quando} · v0.{versao}',

  'atrio.pedido.rotulo': 'para sair do papel',
  'atrio.pedido.ninguem': 'Ninguém se inscreveu ainda. ',
  'atrio.pedido.ninguem.forte': 'Pode ser você.',
  'atrio.pedido.alguem.antes': 'Já tem ',
  'atrio.pedido.alguem.um': '1 pessoa',
  'atrio.pedido.alguem.varios': '{n} pessoas',
  'atrio.pedido.alguem.depois': ' construindo. Cabe mais.',
  'atrio.acao.construir': 'quero construir',
  'atrio.acao.discussao': 'ler a discussão',
  'atrio.rostos': '{n} pessoas inscritas',

  'atrio.vazio.falha.texto':
    'Assim que a API voltar, as ideias aparecem aqui sem você precisar fazer nada.',
  'atrio.vazio.titulo': 'Nenhuma ideia publicada ainda',
  'atrio.vazio.texto':
    'A primeira ideia publicada aparece aqui. Não precisa saber fazer — precisa conhecer o problema.',

  'atrio.chamada.antes': 'Escreva uma ideia. ',
  'atrio.chamada.serif': 'Não precisa saber fazer.',
  'atrio.chamada.texto':
    'Precisa só querer que aconteça. Quem sabe fazer está aqui, procurando no que aplicar isso.',
  'atrio.chamada.acao': 'escrever uma ideia',
};

const en: Record<keyof typeof ptBR, string> = {
  'atrio.titulo': 'Idearium · Atrium',

  'atrio.abertura.antes': 'Open ideas, waiting for ',
  'atrio.abertura.serif': 'someone who knows how',
  'atrio.abertura.depois': '.',
  'atrio.abertura.sub':
    'Someone sees a problem up close and writes it down. Someone else knows ' +
    'how to build and is looking for where to apply it. Idearium is where ' +
    'the two meet — no gatekeeper, no fee, and the credit is shared.',
  'atrio.ciclo': 'an idea goes through four states:',
  'atrio.vira': 'becomes',

  'atrio.etapa1.titulo': 'Someone writes',
  'atrio.etapa1.texto':
    'An idea becomes a numbered proposal. You do not need to know how to build it — you need to know the problem.',
  'atrio.etapa2.titulo': 'The community refines it',
  'atrio.etapa2.texto':
    'People comment, question, correct. The proposal changes and the history stays: nothing is erased.',
  'atrio.etapa3.titulo': 'Someone signs up',
  'atrio.etapa3.texto':
    'Whoever knows how joins in. No approval and no contract — and they can leave whenever they want, in public.',
  'atrio.etapa4.titulo': 'It becomes real, and stays open',
  'atrio.etapa4.texto':
    'Once it exists, the credit belongs to everyone who worked on it. And another city can build it again.',

  'atrio.faixa.rotulo': 'one of them, right now',
  'atrio.faixa.todas': 'see all open ideas →',
  'atrio.aviso.texto':
    'What appears below may be incomplete. The content comes back on its own when the API responds.',

  'atrio.trilha.titulo': 'What exists so far',
  'atrio.trilha.barras': '{dados} of {total} steps taken',
  'atrio.passo.escrita': 'Proposal written',
  'atrio.passo.escrita.resto': 'and numbered as {codigo}',
  'atrio.passo.discutida': 'Discussed in public',
  'atrio.passo.discutida.um': '1 comment',
  'atrio.passo.discutida.varios': '{n} comments',
  'atrio.passo.discutida.nenhum': '— no one has commented yet',
  'atrio.passo.inscricao': 'Someone signed up',
  'atrio.passo.inscricao.um': '1 person building',
  'atrio.passo.inscricao.varios': '{n} people building',
  'atrio.passo.inscricao.nenhum': '— the spot is open',

  'atrio.errata.gatilho': 'errata · 1 correction',
  'atrio.errata.data': 'corrected {quando} · v0.{versao}',

  'atrio.pedido.rotulo': 'to make it real',
  'atrio.pedido.ninguem': 'No one has signed up yet. ',
  'atrio.pedido.ninguem.forte': 'It could be you.',
  'atrio.pedido.alguem.antes': 'There is already ',
  'atrio.pedido.alguem.um': '1 person',
  'atrio.pedido.alguem.varios': '{n} people',
  'atrio.pedido.alguem.depois': ' building. There is room for more.',
  'atrio.acao.construir': 'I want to build',
  'atrio.acao.discussao': 'read the discussion',
  'atrio.rostos': '{n} people signed up',

  'atrio.vazio.falha.texto':
    'As soon as the API is back, the ideas show up here without you doing anything.',
  'atrio.vazio.titulo': 'No ideas published yet',
  'atrio.vazio.texto':
    'The first published idea shows up here. You do not need to know how to build it — you need to know the problem.',

  'atrio.chamada.antes': 'Write an idea. ',
  'atrio.chamada.serif': 'You do not need to know how.',
  'atrio.chamada.texto':
    'You just need to want it to happen. People who know how are here, looking for where to apply it.',
  'atrio.chamada.acao': 'write an idea',
};

export default { 'pt-BR': ptBR, en };
