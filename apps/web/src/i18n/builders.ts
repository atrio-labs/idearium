/* builders — /builders (as "mãos"). */

const ptBR = {
  'builders.titulo': 'Idearium · Mãos',
  'builders.descricao':
    'Quem preencheu perfil dizendo o que sabe fazer e topa construir ideia dos outros.',
  'builders.rotulo': 'mãos disponíveis',
  'builders.h1.antes': 'Quem topa ',
  'builders.h1.serif': 'construir',
  'builders.h1.depois': '.',
  'builders.sub':
    'Ninguém aqui cobra e ninguém contrata: não é marketplace nem diretório ' +
    'de freelancer. São pessoas que escreveram o que sabem fazer e topam ' +
    'construir ideia dos outros de graça. O contato acontece em público, na ' +
    'discussão de uma ideia — não há mensagem privada, proposta nem preço.',
  'builders.aviso.resto':
    'A lista abaixo pode estar incompleta ou vazia por isso, não por falta de gente.',
  'builders.contagem.um': '{n} pessoa · ',
  'builders.contagem.varios': '{n} pessoas · ',
  'builders.contagem.ordem': 'quem atualizou o perfil por último aparece primeiro',
  'builders.regra': 'sem contagem por pessoa, sem ordem por atividade',
  'builders.slot.pausado.marca': 'o seu está guardado',
  'builders.slot.novo.marca': 'o seu entra aqui',
  'builders.slot.pausado.frase':
    'Você escreveu o seu cartão e está fora da lista agora. Marcar a ' +
    'disponibilidade em perfil traz ele de volta, do jeito que ficou.',
  'builders.slot.novo.frase':
    'Uma linha sobre o que você sabe fazer e os temas que te puxam. Você ' +
    'vê o cartão se montando enquanto escreve.',
  'builders.slot.pausado.acao': 'voltar pra lista em perfil',
  'builders.slot.novo.acao': 'preencher em perfil',
  'builders.queda.texto': 'As pessoas continuam lá. Só não consegui carregar a lista agora.',
  'builders.vazio.titulo': 'Ninguém disponível agora',
  'builders.vazio.texto':
    'A lista mostra quem marcou que topa construir neste momento. Preencher ' +
    'leva um minuto: uma linha sobre o que você sabe fazer e os assuntos que ' +
    'te puxam. A primeira pode ser você.',
  'builders.vazio.acao': 'preencher o meu',
};

const en: Record<keyof typeof ptBR, string> = {
  'builders.titulo': 'Idearium · Hands',
  'builders.descricao':
    'People who filled in a profile saying what they can do and are up for building other people’s ideas.',
  'builders.rotulo': 'hands available',
  'builders.h1.antes': 'Who is up for ',
  'builders.h1.serif': 'building',
  'builders.h1.depois': '.',
  'builders.sub':
    'Nobody here charges and nobody hires: this is not a marketplace or a ' +
    'freelancer directory. These are people who wrote down what they can ' +
    'do and are up for building other people’s ideas for free. Contact ' +
    'happens in public, in the discussion of an idea — there are no ' +
    'private messages, proposals or prices.',
  'builders.aviso.resto':
    'The list below may be incomplete or empty because of that, not because there are no people.',
  'builders.contagem.um': '{n} person · ',
  'builders.contagem.varios': '{n} people · ',
  'builders.contagem.ordem': 'whoever updated their profile last comes first',
  'builders.regra': 'no count per person, no ordering by activity',
  'builders.slot.pausado.marca': 'yours is on hold',
  'builders.slot.novo.marca': 'yours goes here',
  'builders.slot.pausado.frase':
    'You wrote your card and you are off the list right now. Marking ' +
    'yourself as available in your profile brings it back, as you left it.',
  'builders.slot.novo.frase':
    'One line about what you can do and the topics that pull you. You ' +
    'see the card taking shape as you write.',
  'builders.slot.pausado.acao': 'get back on the list in your profile',
  'builders.slot.novo.acao': 'fill in your profile',
  'builders.queda.texto': 'The people are still there. I just could not load the list right now.',
  'builders.vazio.titulo': 'Nobody available right now',
  'builders.vazio.texto':
    'The list shows who marked themselves as up for building right now. ' +
    'Filling it in takes a minute: one line about what you can do and the ' +
    'topics that pull you. The first one could be you.',
  'builders.vazio.acao': 'fill in mine',
};

export default { 'pt-BR': ptBR, en };
