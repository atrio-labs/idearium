/* usuario — /users/:username (perfil público). */

const ptBR = {
  'usuario.titulo': 'Idearium · Perfil',
  'usuario.titulo.nome': 'Idearium · @{username}',
  'usuario.descricao': 'Perfil público de @{username}.',
  'usuario.inexistente.titulo': 'Não existe ninguém com o nome @{username}',
  'usuario.inexistente.texto':
    'Confira se o nome está escrito certo. O @ é o identificador da pessoa e não muda.',
  'usuario.acao.ideias': 'ver as ideias',
  'usuario.volta': '← todas as ideias',
  'usuario.disponivel': 'disponível pra construir',
  'usuario.desde': 'por aqui desde {quando}',
  'usuario.escreveu': 'ideias que escreveu',
  'usuario.escreveu.vazio.titulo': 'Ainda não escreveu nenhuma ideia',
  'usuario.escreveu.vazio.texto':
    'Escrever não é obrigatório: dá pra contribuir só construindo, ou só discutindo.',
  'usuario.construindo': 'onde está construindo',
};

const en: Record<keyof typeof ptBR, string> = {
  'usuario.titulo': 'Idearium · Profile',
  'usuario.titulo.nome': 'Idearium · @{username}',
  'usuario.descricao': 'Public profile of @{username}.',
  'usuario.inexistente.titulo': 'There is nobody named @{username}',
  'usuario.inexistente.texto':
    'Check that the name is spelled right. The @ is the person’s identifier and does not change.',
  'usuario.acao.ideias': 'see the ideas',
  'usuario.volta': '← all ideas',
  'usuario.disponivel': 'available to build',
  'usuario.desde': 'here since {quando}',
  'usuario.escreveu': 'ideas written',
  'usuario.escreveu.vazio.titulo': 'No ideas written yet',
  'usuario.escreveu.vazio.texto':
    'Writing is not required: you can contribute just by building, or just by discussing.',
  'usuario.construindo': 'building now',
};

export default { 'pt-BR': ptBR, en };
