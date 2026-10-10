/* atrio — a página inicial (src/pages/index.astro).

   A frase âncora do VISAO §12, "não precisa saber fazer. precisa só
   querer que aconteça.", é o título do hero. O inglês mantém a mesma
   estrutura curta, sem virar slogan.

   Títulos em dois tons vêm em dois pedaços: ".antes" no tom escuro e
   ".apagado" no tom claro. */

const ptBR = {
  'atrio.titulo': 'Idearium · Átrio',

  'atrio.heroi.antes': 'Não precisa saber fazer. ',
  'atrio.heroi.apagado': 'Precisa só querer que aconteça.',
  'atrio.heroi.apoio':
    'O Idearium junta quem vê um problema de perto com quem sabe construir. ' +
    'Sem gatekeeper, sem taxa, e com o crédito dividido.',
  'atrio.heroi.escrever': 'escrever uma ideia',
  'atrio.heroi.ver': 'ver ideias',
  'atrio.heroi.alt': 'Imagem abstrata em gradiente quente, a capa do Idearium',

  'atrio.frase.antes': 'Alguém vê um problema de perto e escreve. ',
  'atrio.frase.apagado': 'Outra pessoa sabe construir e procura no que aplicar isso.',

  'atrio.propor.titulo': 'Propor',
  'atrio.propor.texto':
    'Uma ideia vira proposta numerada. Não precisa saber construir, precisa conhecer o problema.',
  'atrio.discutir.titulo': 'Discutir',
  'atrio.discutir.texto':
    'Gente comenta, contesta, corrige. A proposta muda e o histórico fica: nada é apagado.',
  'atrio.construir.titulo': 'Construir',
  'atrio.construir.texto':
    'Quem sabe fazer se inscreve, sem aprovação e sem contrato. E pode sair quando quiser, em público.',

  'atrio.recentes.antes': 'Ideias abertas, ',
  'atrio.recentes.apagado': 'esperando quem sabe fazer.',
  'atrio.recentes.todas': 'ver todas',
  'atrio.aviso.texto':
    'O que aparece abaixo pode estar incompleto. O conteúdo volta sozinho quando a API responder.',

  'atrio.labs.todos': 'ver os laboratórios',

  'atrio.vazio.falha.texto':
    'Assim que a API voltar, as ideias aparecem aqui sem você precisar fazer nada.',
  'atrio.vazio.titulo': 'Nenhuma ideia publicada ainda',
  'atrio.vazio.texto':
    'A primeira ideia publicada aparece aqui. Não precisa saber fazer, precisa conhecer o problema.',
};

const en: Record<keyof typeof ptBR, string> = {
  'atrio.titulo': 'Idearium · Atrium',

  'atrio.heroi.antes': 'You do not need to know how. ',
  'atrio.heroi.apagado': 'You just need to want it to happen.',
  'atrio.heroi.apoio':
    'Idearium brings together people who see a problem up close and people ' +
    'who know how to build. No gatekeeper, no fee, and the credit is shared.',
  'atrio.heroi.escrever': 'write an idea',
  'atrio.heroi.ver': 'see ideas',
  'atrio.heroi.alt': 'Abstract image in a warm gradient, the Idearium cover',

  'atrio.frase.antes': 'Someone sees a problem up close and writes it down. ',
  'atrio.frase.apagado': 'Someone else knows how to build and is looking for where to apply it.',

  'atrio.propor.titulo': 'Propose',
  'atrio.propor.texto':
    'An idea becomes a numbered proposal. You do not need to know how to build it, you need to know the problem.',
  'atrio.discutir.titulo': 'Discuss',
  'atrio.discutir.texto':
    'People comment, question, correct. The proposal changes and the history stays: nothing is erased.',
  'atrio.construir.titulo': 'Build',
  'atrio.construir.texto':
    'Whoever knows how signs up, with no approval and no contract. And they can leave whenever they want, in public.',

  'atrio.recentes.antes': 'Open ideas, ',
  'atrio.recentes.apagado': 'waiting for someone who knows how.',
  'atrio.recentes.todas': 'see all',
  'atrio.aviso.texto':
    'What appears below may be incomplete. The content comes back on its own when the API responds.',

  'atrio.labs.todos': 'see the labs',

  'atrio.vazio.falha.texto':
    'As soon as the API is back, the ideas show up here without you doing anything.',
  'atrio.vazio.titulo': 'No ideas published yet',
  'atrio.vazio.texto':
    'The first published idea shows up here. You do not need to know how to build it, you need to know the problem.',
};

export default { 'pt-BR': ptBR, en };
