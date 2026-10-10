/* seguranca — C3: segurança da conta no perfil, /excluir-conta,
   /confirmar-email, avisos no átrio e a linha de termos do cadastro.

   Tudo que depende do backend fica atrás de PUBLIC_CONTA (lib/conta.ts).
   Só a linha de termos e o aviso do átrio existem sem flag.

   Tom: sem alarme. Excluir conta diz o que sai e o que fica, em
   linguagem direta (VISAO §5.3, §11). */

const ptBR = {
  /* ---------------- termos no cadastro e no rodapé ---------------- */
  'seguranca.termos.antes': 'Ao criar a conta você concorda com os ',
  'seguranca.termos.termos': 'termos de uso',
  'seguranca.termos.meio': ' e a ',
  'seguranca.termos.privacidade': 'política de privacidade',
  'seguranca.termos.depois': '.',

  /* ---------------- avisos no átrio ---------------- */
  'seguranca.aviso.conta-removida':
    'Sua conta foi excluída. O que você publicou continua no histórico público, ' +
    'anonimizado como “[conta removida]”.',
  'seguranca.aviso.saiu-todos': 'Você saiu de todos os aparelhos. Entre de novo quando quiser.',

  /* ---------------- perfil: segurança ---------------- */
  'seguranca.secao.titulo': 'Segurança',
  'seguranca.secao.intro': 'Senha, email e sessões abertas. Cada ação pede a sua senha atual.',
  'seguranca.indisponivel': 'Esta função ainda não está disponível no servidor. Nada foi alterado.',
  'seguranca.erro.generico': 'Não consegui concluir agora. Tente de novo em instantes.',
  'seguranca.erro.senha': 'A senha atual não confere.',

  'seguranca.senha.titulo': 'Trocar a senha',
  'seguranca.senha.atual': 'senha atual',
  'seguranca.senha.nova': 'senha nova',
  'seguranca.senha.confirmar': 'repita a senha nova',
  'seguranca.senha.ajuda': 'No mínimo {min} caracteres. Ao trocar, os outros aparelhos saem da sua conta.',
  'seguranca.senha.botao': 'trocar a senha',
  'seguranca.senha.ok': 'Senha trocada. Os outros aparelhos foram desconectados.',
  'seguranca.senha.erro.vazio': 'Preencha os três campos.',
  'seguranca.senha.erro.curta': 'A senha nova precisa ter de {min} a {max} caracteres.',
  'seguranca.senha.erro.diferentes': 'A senha nova e a repetição são diferentes.',
  'seguranca.senha.erro.igual': 'A senha nova precisa ser diferente da atual.',

  'seguranca.email.titulo': 'Trocar o email',
  'seguranca.email.atual': 'Email atual: {email}',
  'seguranca.email.novo': 'email novo',
  'seguranca.email.senha': 'senha atual',
  'seguranca.email.ajuda': 'Mandamos um link ao email novo. O email só muda depois que você abrir o link.',
  'seguranca.email.botao': 'pedir a troca',
  'seguranca.email.ok': 'Mandei um link de confirmação ao email novo. O atual continua valendo até você abri-lo.',
  'seguranca.email.erro.vazio': 'Preencha o email novo e a senha.',
  'seguranca.email.erro.igual': 'Esse já é o seu email.',
  'seguranca.email.erro.existe': 'Esse email não pode ser usado.',

  'seguranca.todos.titulo': 'Sair de todos os aparelhos',
  'seguranca.todos.texto': 'Encerra todas as sessões abertas, inclusive esta. Útil se você entrou em um computador que não é seu.',
  'seguranca.todos.botao': 'sair de todos',

  /* ---------------- perfil: seus dados ---------------- */
  'seguranca.dados.titulo': 'Seus dados',
  'seguranca.dados.intro':
    'Você pode levar uma cópia do que o Idearium guarda sobre você ou excluir a conta. ' +
    'É um direito seu pela LGPD, art. 18.',
  'seguranca.dados.baixar.titulo': 'Baixar meus dados',
  'seguranca.dados.baixar.texto': 'Um arquivo JSON com perfil, ideias, versões, comentários e inscrições.',
  'seguranca.dados.baixar.botao': 'baixar meus dados',
  'seguranca.dados.excluir.titulo': 'Excluir minha conta',
  'seguranca.dados.excluir.texto': 'Os dados pessoais saem; o que você publicou fica no histórico, sem o seu nome.',
  'seguranca.dados.excluir.botao': 'excluir a conta',

  /* ---------------- /excluir-conta ---------------- */
  'seguranca.excluir.titulo': 'Idearium · Excluir conta',
  'seguranca.excluir.descricao': 'Exclua a sua conta e leve os seus dados pessoais embora.',
  'seguranca.excluir.h1.antes': 'Excluir ',
  'seguranca.excluir.h1.apagado': 'a sua conta.',
  'seguranca.excluir.sub': 'Antes de confirmar, o que acontece de verdade:',
  'seguranca.excluir.sai.titulo': 'O que sai',
  'seguranca.excluir.sai.texto':
    'Email, senha, nome completo, bio, foto, perfil de mão, contas conectadas e sessões. ' +
    'Isso é apagado.',
  'seguranca.excluir.fica.titulo': 'O que fica',
  'seguranca.excluir.fica.texto':
    'Ideias, versões, comentários e inscrições são públicos por desenho, em CC BY-SA 4.0, ' +
    'e outras pessoas já podem ter respondido a eles. Eles continuam no histórico, ' +
    'anonimizados como “[conta removida]”. O seu @ deixa de aparecer.',
  'seguranca.excluir.desfazer.titulo': 'Não dá para desfazer',
  'seguranca.excluir.desfazer.texto': 'Se quiser guardar uma cópia, baixe os dados antes.',
  'seguranca.excluir.baixar': 'baixar meus dados antes',
  'seguranca.excluir.username': 'digite {username} para confirmar',
  'seguranca.excluir.senha': 'sua senha',
  'seguranca.excluir.botao': 'excluir minha conta',
  'seguranca.excluir.voltar': 'voltar ao perfil',
  'seguranca.excluir.erro.vazio': 'Digite o seu @username e a sua senha.',
  'seguranca.excluir.erro.username': 'O @username digitado não é o da sua conta.',

  /* ---------------- /confirmar-email/:token ---------------- */
  'seguranca.confirmar.titulo': 'Idearium · Confirmar email',
  'seguranca.confirmar.descricao': 'Confirma a troca do email da sua conta.',
  'seguranca.confirmar.ok.h1.antes': 'Email ',
  'seguranca.confirmar.ok.h1.apagado': 'trocado.',
  'seguranca.confirmar.ok.texto': 'O seu email novo já vale. Use-o na próxima vez que entrar.',
  'seguranca.confirmar.expirado.h1.antes': 'Esse link ',
  'seguranca.confirmar.expirado.h1.apagado': 'expirou.',
  'seguranca.confirmar.expirado.texto': 'Peça a troca de novo no seu perfil. O email atual continua valendo.',
  'seguranca.confirmar.invalido.h1.antes': 'Esse link ',
  'seguranca.confirmar.invalido.h1.apagado': 'não vale.',
  'seguranca.confirmar.invalido.texto': 'Ele já foi usado ou está incompleto. Peça a troca de novo no seu perfil.',
  'seguranca.confirmar.falha.h1.antes': 'Não deu pra ',
  'seguranca.confirmar.falha.h1.apagado': 'confirmar agora.',
  'seguranca.confirmar.falha.texto': 'Não consegui falar com o servidor. Abra o link de novo em instantes.',
};

const en: Record<keyof typeof ptBR, string> = {
  'seguranca.termos.antes': 'By creating an account you agree to the ',
  'seguranca.termos.termos': 'terms of use',
  'seguranca.termos.meio': ' and the ',
  'seguranca.termos.privacidade': 'privacy policy',
  'seguranca.termos.depois': '.',

  'seguranca.aviso.conta-removida':
    'Your account was deleted. What you published stays in the public history, ' +
    'anonymized as “[conta removida]”.',
  'seguranca.aviso.saiu-todos': 'You signed out of every device. Sign in again whenever you want.',

  'seguranca.secao.titulo': 'Security',
  'seguranca.secao.intro': 'Password, email and open sessions. Each action asks for your current password.',
  'seguranca.indisponivel': 'This feature is not available on the server yet. Nothing was changed.',
  'seguranca.erro.generico': 'I could not finish this now. Try again in a moment.',
  'seguranca.erro.senha': 'The current password does not match.',

  'seguranca.senha.titulo': 'Change your password',
  'seguranca.senha.atual': 'current password',
  'seguranca.senha.nova': 'new password',
  'seguranca.senha.confirmar': 'repeat the new password',
  'seguranca.senha.ajuda': 'At least {min} characters. Changing it signs your other devices out.',
  'seguranca.senha.botao': 'change password',
  'seguranca.senha.ok': 'Password changed. Your other devices were signed out.',
  'seguranca.senha.erro.vazio': 'Fill in all three fields.',
  'seguranca.senha.erro.curta': 'The new password must be {min} to {max} characters long.',
  'seguranca.senha.erro.diferentes': 'The new password and the repetition do not match.',
  'seguranca.senha.erro.igual': 'The new password must differ from the current one.',

  'seguranca.email.titulo': 'Change your email',
  'seguranca.email.atual': 'Current email: {email}',
  'seguranca.email.novo': 'new email',
  'seguranca.email.senha': 'current password',
  'seguranca.email.ajuda': 'We send a link to the new address. The email only changes after you open it.',
  'seguranca.email.botao': 'request the change',
  'seguranca.email.ok': 'I sent a confirmation link to the new email. The current one stays valid until you open it.',
  'seguranca.email.erro.vazio': 'Fill in the new email and your password.',
  'seguranca.email.erro.igual': 'That is already your email.',
  'seguranca.email.erro.existe': 'That email cannot be used.',

  'seguranca.todos.titulo': 'Sign out of every device',
  'seguranca.todos.texto': 'Ends every open session, including this one. Useful if you signed in on a computer that is not yours.',
  'seguranca.todos.botao': 'sign out everywhere',

  'seguranca.dados.titulo': 'Your data',
  'seguranca.dados.intro':
    'You can take a copy of what Idearium holds about you, or delete the account. ' +
    'This is your right under Brazil’s LGPD, art. 18.',
  'seguranca.dados.baixar.titulo': 'Download my data',
  'seguranca.dados.baixar.texto': 'A JSON file with your profile, ideas, versions, comments and enrollments.',
  'seguranca.dados.baixar.botao': 'download my data',
  'seguranca.dados.excluir.titulo': 'Delete my account',
  'seguranca.dados.excluir.texto': 'Personal data goes away; what you published stays in the history, without your name.',
  'seguranca.dados.excluir.botao': 'delete the account',

  'seguranca.excluir.titulo': 'Idearium · Delete account',
  'seguranca.excluir.descricao': 'Delete your account and take your personal data with you.',
  'seguranca.excluir.h1.antes': 'Delete ',
  'seguranca.excluir.h1.apagado': 'your account.',
  'seguranca.excluir.sub': 'Before you confirm, what really happens:',
  'seguranca.excluir.sai.titulo': 'What goes away',
  'seguranca.excluir.sai.texto':
    'Email, password, full name, bio, photo, hand profile, connected accounts and sessions. ' +
    'All of it is erased.',
  'seguranca.excluir.fica.titulo': 'What stays',
  'seguranca.excluir.fica.texto':
    'Ideas, versions, comments and enrollments are public by design, under CC BY-SA 4.0, ' +
    'and other people may already have replied to them. They stay in the history, ' +
    'anonymized as “[conta removida]”. Your @ stops appearing.',
  'seguranca.excluir.desfazer.titulo': 'This cannot be undone',
  'seguranca.excluir.desfazer.texto': 'If you want a copy, download your data first.',
  'seguranca.excluir.baixar': 'download my data first',
  'seguranca.excluir.username': 'type {username} to confirm',
  'seguranca.excluir.senha': 'your password',
  'seguranca.excluir.botao': 'delete my account',
  'seguranca.excluir.voltar': 'back to profile',
  'seguranca.excluir.erro.vazio': 'Type your @username and your password.',
  'seguranca.excluir.erro.username': 'The @username you typed is not the one on your account.',

  'seguranca.confirmar.titulo': 'Idearium · Confirm email',
  'seguranca.confirmar.descricao': 'Confirms the change of your account email.',
  'seguranca.confirmar.ok.h1.antes': 'Email ',
  'seguranca.confirmar.ok.h1.apagado': 'changed.',
  'seguranca.confirmar.ok.texto': 'Your new email is now valid. Use it the next time you sign in.',
  'seguranca.confirmar.expirado.h1.antes': 'This link ',
  'seguranca.confirmar.expirado.h1.apagado': 'expired.',
  'seguranca.confirmar.expirado.texto': 'Ask for the change again in your profile. The current email stays valid.',
  'seguranca.confirmar.invalido.h1.antes': 'This link ',
  'seguranca.confirmar.invalido.h1.apagado': 'is not valid.',
  'seguranca.confirmar.invalido.texto': 'It was already used or is incomplete. Ask for the change again in your profile.',
  'seguranca.confirmar.falha.h1.antes': 'Could not ',
  'seguranca.confirmar.falha.h1.apagado': 'confirm right now.',
  'seguranca.confirmar.falha.texto': 'I could not reach the server. Open the link again in a moment.',
};

export default { 'pt-BR': ptBR, en };
