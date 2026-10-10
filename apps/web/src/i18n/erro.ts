/* erro — a página 404 (pages/404.astro), a mesma pra /x e /en/x. */

const ptBR = {
  'erro.404.titulo': 'Idearium · Página não encontrada',
  'erro.404.vazio': 'Esta página não existe',
  'erro.404.texto': 'O endereço pode ter mudado ou ter sido digitado errado.',
  'erro.404.acao': 'voltar ao início',
};

const en: Record<keyof typeof ptBR, string> = {
  'erro.404.titulo': 'Idearium · Page not found',
  'erro.404.vazio': 'This page does not exist',
  'erro.404.texto': 'The address may have changed or been mistyped.',
  'erro.404.acao': 'back to the start',
};

export default { 'pt-BR': ptBR, en };
