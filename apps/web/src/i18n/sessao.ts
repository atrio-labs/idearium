/* sessao — mensagens de erro que lib/sessao.ts devolve pras telas.
   O idioma vem do contexto da requisição (requisicao.ts). */

const ptBR = {
  'sessao.login.invalido': 'Email ou senha não conferem.',
  'sessao.login.falha': 'Não consegui entrar agora. Tente de novo em instantes.',
  'sessao.conta.existe': 'Já existe conta com esse nome de usuário ou email.',
  'sessao.conta.falha': 'Não consegui criar a conta agora.',
  'sessao.api.status': 'A API respondeu {status}.',
  'sessao.rede': 'Não consegui falar com o servidor.',
};

const en: Record<keyof typeof ptBR, string> = {
  'sessao.login.invalido': 'Email or password do not match.',
  'sessao.login.falha': 'I could not sign you in right now. Try again in a moment.',
  'sessao.conta.existe': 'An account with that username or email already exists.',
  'sessao.conta.falha': 'I could not create the account right now.',
  'sessao.api.status': 'The API responded {status}.',
  'sessao.rede': 'I could not reach the server.',
};

export default { 'pt-BR': ptBR, en };
