/* notificacoes — a central de notificações (F6) e o texto de cada
   notificação, montado aqui a partir de `type` + `payload`.

   O texto não vem pronto da API de propósito: o `title` gravado no
   banco sai num idioma só, o de quem disparou o evento. Com o tipo e
   os dados do evento, a mesma notificação aparece em pt-BR ou em
   inglês conforme a página. `title` e `body` ficam como reserva pra
   tipo que este dicionário ainda não conhece.

   Nada de número em destaque nem de tom de urgência (VISAO §9): a
   notificação diz o que aconteceu e leva até lá. */

const ptBR = {
  'notificacoes.titulo.antes': 'Notificações',
  'notificacoes.titulo.apagado': 'o que aconteceu nas suas ideias.',
  'notificacoes.apoio':
    'Inscrições, comentários, mudanças de status e menções a você. Nada de curtida, nada de quem viu seu perfil.',

  'notificacoes.marcar.todas': 'marcar todas como lidas',
  'notificacoes.marcar.uma': 'marcar como lida',
  'notificacoes.marcar.uma.rotulo': 'marcar como lida: {texto}',
  'notificacoes.nova': 'nova',
  'notificacoes.lida': 'lida',
  'notificacoes.erro.marcar': 'Não consegui marcar agora. Tente de novo em instantes.',

  'notificacoes.vazio.titulo': 'Nada novo por aqui',
  'notificacoes.vazio.texto':
    'Quando alguém se inscrever numa ideia sua, comentar, mudar o status dela ou mencionar você, aparece aqui.',
  'notificacoes.indisponivel.titulo': 'A API ainda não oferece notificações',
  'notificacoes.indisponivel.texto':
    'Esta tela está pronta, mas o servidor ainda não tem o endereço de notificações. Ela passa a funcionar quando ele tiver.',
  'notificacoes.erro.titulo': 'Não consegui buscar suas notificações',
  'notificacoes.erro.texto': 'O servidor não respondeu. Tente de novo em instantes.',

  'notificacoes.pagina.anterior': 'anteriores',
  'notificacoes.pagina.proxima': 'mais antigas',
  'notificacoes.pagina.rotulo': 'página {n} de {total}',
  'notificacoes.paginacao': 'paginação das notificações',

  /* {autor} vem com o @; {rfc} é o título da ideia ou o código dela */
  'notificacoes.tipo.new_enrollment': '{autor} se inscreveu para construir {rfc}',
  'notificacoes.tipo.new_comment': '{autor} comentou em {rfc}',
  'notificacoes.tipo.rfc_status_changed': '{rfc} agora está {status}',
  'notificacoes.tipo.mention': '{autor} mencionou você em {rfc}',
  'notificacoes.alguem': 'alguém',
  'notificacoes.uma.ideia': 'uma ideia sua',
  'notificacoes.generica': 'Algo novo aconteceu numa ideia sua',
};

const en: Record<keyof typeof ptBR, string> = {
  'notificacoes.titulo.antes': 'Notifications',
  'notificacoes.titulo.apagado': 'what happened to your ideas.',
  'notificacoes.apoio':
    'Sign-ups, comments, status changes and mentions of you. No likes, no who viewed your profile.',

  'notificacoes.marcar.todas': 'mark all as read',
  'notificacoes.marcar.uma': 'mark as read',
  'notificacoes.marcar.uma.rotulo': 'mark as read: {texto}',
  'notificacoes.nova': 'new',
  'notificacoes.lida': 'read',
  'notificacoes.erro.marcar': 'I could not mark it now. Try again in a moment.',

  'notificacoes.vazio.titulo': 'Nothing new here',
  'notificacoes.vazio.texto':
    'When someone signs up for one of your ideas, comments, changes its status or mentions you, it shows up here.',
  'notificacoes.indisponivel.titulo': 'The API does not offer notifications yet',
  'notificacoes.indisponivel.texto':
    'This page is ready, but the server does not have the notifications endpoint yet. It starts working when it does.',
  'notificacoes.erro.titulo': 'I could not fetch your notifications',
  'notificacoes.erro.texto': 'The server did not respond. Try again in a moment.',

  'notificacoes.pagina.anterior': 'newer',
  'notificacoes.pagina.proxima': 'older',
  'notificacoes.pagina.rotulo': 'page {n} of {total}',
  'notificacoes.paginacao': 'notifications pages',

  'notificacoes.tipo.new_enrollment': '{autor} signed up to build {rfc}',
  'notificacoes.tipo.new_comment': '{autor} commented on {rfc}',
  'notificacoes.tipo.rfc_status_changed': '{rfc} is now {status}',
  'notificacoes.tipo.mention': '{autor} mentioned you in {rfc}',
  'notificacoes.alguem': 'someone',
  'notificacoes.uma.ideia': 'one of your ideas',
  'notificacoes.generica': 'Something new happened to one of your ideas',
};

export default { 'pt-BR': ptBR, en };
