/* auth — Etapa 6: entrar por GitHub/Google, recuperar e redefinir a
   senha, verificar o email, contas conectadas no perfil e os textos do
   CartaoMao. Tudo atrás da flag PUBLIC_OAUTH, exceto os textos do cartão.

   GitHub e Google são jeitos de ENTRAR, não de ser alguém: nome e foto
   de lá nunca viram identidade aqui (VISAO §5.3). Os textos dizem isso. */

const ptBR = {
  /* ---------------- CartaoMao ---------------- */
  'auth.mao.vazio': 'uma linha sobre você aparece aqui',
  'auth.mao.disponivel': 'disponível pra construir',

  /* ---------------- botões sociais (/entrar e /criar-conta) ---------------- */
  'auth.social.ou': 'ou',
  'auth.social.github': 'continuar com GitHub',
  'auth.social.google': 'continuar com Google',
  'auth.social.nota':
    'GitHub e Google servem só pra entrar. Nome e foto de lá não vêm pra cá: ' +
    'no site você aparece pelo seu @.',

  /* ---------------- /entrar ---------------- */
  'auth.entrar.esqueci': 'esqueci a senha',
  'auth.entrar.redefinida': 'Senha trocada. Entre com a nova.',

  /* ---------------- /entrar/callback ---------------- */
  'auth.callback.titulo': 'Idearium · Entrada não concluída',
  'auth.callback.descricao': 'A entrada por GitHub ou Google não foi concluída.',
  'auth.callback.h1.antes': 'Não deu pra ',
  'auth.callback.h1.apagado': 'concluir a entrada.',
  'auth.callback.h1.vinculo.antes': 'Não deu pra ',
  'auth.callback.h1.vinculo.apagado': 'conectar a conta.',
  'auth.callback.erro.estado':
    'A conferência de segurança falhou: o pedido não saiu deste navegador ou ' +
    'passou do prazo. Comece de novo.',
  'auth.callback.erro.existe':
    'Já existe uma conta com esse email. Entre com a senha e conecte o ' +
    '{provedor} no perfil.',
  'auth.callback.erro.negado':
    'A autorização no {provedor} foi cancelada ou recusada. Nada foi alterado.',
  'auth.callback.erro.expirado': 'O código de entrada expirou. Tente de novo: leva menos de um minuto.',
  'auth.callback.erro.emuso': 'Essa conta do {provedor} já está conectada a outro perfil.',
  'auth.callback.erro.generico': 'Não consegui concluir agora. Tente de novo em instantes.',
  'auth.callback.voltar.entrar': 'voltar a entrar',
  'auth.callback.voltar.perfil': 'voltar ao perfil',

  /* ---------------- /recuperar-senha ---------------- */
  'auth.recuperar.titulo': 'Idearium · Recuperar senha',
  'auth.recuperar.descricao': 'Peça um link para criar uma senha nova.',
  'auth.recuperar.rotulo': 'recuperar senha',
  'auth.recuperar.h1.antes': 'Esqueceu a senha? ',
  'auth.recuperar.h1.apagado': 'Crie outra.',
  'auth.recuperar.sub': 'Informe o email da conta. Se ele existir, mandamos um link pra criar uma senha nova.',
  'auth.recuperar.campo.email': 'email',
  'auth.recuperar.botao': 'enviar o link',
  'auth.recuperar.voltar': 'voltar a entrar',
  'auth.recuperar.erro.vazio': 'Preencha o email.',
  'auth.recuperar.erro.falha': 'Não consegui enviar agora. Tente de novo em instantes.',
  'auth.recuperar.enviado':
    'Se esse email tem conta, o link está a caminho. Ele vale por tempo limitado. ' +
    'Confira também o spam.',

  /* ---------------- /redefinir-senha ---------------- */
  'auth.redefinir.titulo': 'Idearium · Nova senha',
  'auth.redefinir.descricao': 'Crie uma senha nova para a sua conta.',
  'auth.redefinir.rotulo': 'nova senha',
  'auth.redefinir.h1.antes': 'Escolha uma ',
  'auth.redefinir.h1.apagado': 'senha nova.',
  'auth.redefinir.sub': 'Depois de trocar, você entra com ela.',
  'auth.redefinir.campo.senha': 'nova senha',
  'auth.redefinir.campo.confirma': 'repita a senha',
  'auth.redefinir.ajuda': 'No mínimo 10 caracteres. Uma frase serve.',
  'auth.redefinir.botao': 'trocar a senha',
  'auth.redefinir.erro.vazio': 'Preencha a senha nova e a confirmação.',
  'auth.redefinir.erro.curta': 'A senha precisa de no mínimo 10 caracteres.',
  'auth.redefinir.erro.diferente': 'As duas senhas não são iguais.',
  'auth.redefinir.erro.falha': 'Não consegui trocar agora. Tente de novo em instantes.',
  'auth.redefinir.invalido.h1.antes': 'Esse link ',
  'auth.redefinir.invalido.h1.apagado': 'não vale mais.',
  'auth.redefinir.invalido.texto':
    'Ele expirou, já foi usado ou está incompleto. Peça um novo: leva menos de um minuto.',
  'auth.redefinir.invalido.acao': 'pedir um link novo',

  /* ---------------- /verificar-email/[token] ---------------- */
  'auth.verificar.titulo': 'Idearium · Verificar email',
  'auth.verificar.descricao': 'Confirmação do email da conta.',
  'auth.verificar.rotulo': 'verificar email',
  'auth.verificar.ok.h1.antes': 'Email ',
  'auth.verificar.ok.h1.apagado': 'confirmado.',
  'auth.verificar.ok.texto': 'Pronto: este email agora está verificado.',
  'auth.verificar.expirado.h1.antes': 'Esse link ',
  'auth.verificar.expirado.h1.apagado': 'expirou.',
  'auth.verificar.expirado.texto': 'Entre na sua conta e peça outra verificação no perfil.',
  'auth.verificar.invalido.h1.antes': 'Esse link ',
  'auth.verificar.invalido.h1.apagado': 'não é válido.',
  'auth.verificar.invalido.texto':
    'Ele pode ter sido copiado pela metade ou já usado. Entre na sua conta e peça outra verificação no perfil.',
  'auth.verificar.falha.h1.antes': 'Não deu pra ',
  'auth.verificar.falha.h1.apagado': 'verificar agora.',
  'auth.verificar.falha.texto': 'O servidor não respondeu. Abra o link de novo em instantes.',
  'auth.verificar.acao.perfil': 'ir ao perfil',
  'auth.verificar.acao.entrar': 'entrar',

  /* ---------------- /perfil ---------------- */
  'auth.perfil.email.aviso': 'Seu email ainda não foi verificado.',
  'auth.perfil.email.reenviar': 'reenviar verificação',
  'auth.perfil.email.reenviado': 'Mandei outro email de verificação.',
  'auth.perfil.email.erro': 'Não consegui reenviar agora. Tente de novo em instantes.',
  'auth.perfil.contas.titulo': 'contas conectadas',
  'auth.perfil.contas.intro':
    'Servem só pra entrar. Nome e foto do GitHub ou do Google não vêm pra cá.',
  'auth.perfil.contas.conectada': 'conectada',
  'auth.perfil.contas.nao': 'não conectada',
  'auth.perfil.contas.conectar': 'conectar',
  'auth.perfil.contas.desconectar': 'desconectar',
  'auth.perfil.contas.ultima':
    'É o único jeito de você entrar. Crie uma senha pelo link "esqueci a senha" ' +
    'antes de desconectar.',
  'auth.perfil.contas.conectou': 'Conta conectada.',
  'auth.perfil.contas.desconectou': 'Conta desconectada.',
  'auth.perfil.contas.erro': 'Não consegui alterar a conta agora. Tente de novo em instantes.',
  'auth.perfil.contas.erro.ultima':
    'Não dá pra desconectar: é o único jeito de você entrar.',
};

const en: Record<keyof typeof ptBR, string> = {
  /* ---------------- CartaoMao ---------------- */
  'auth.mao.vazio': 'a line about you shows up here',
  'auth.mao.disponivel': 'available to build',

  /* ---------------- social buttons ---------------- */
  'auth.social.ou': 'or',
  'auth.social.github': 'continue with GitHub',
  'auth.social.google': 'continue with Google',
  'auth.social.nota':
    'GitHub and Google are only for signing in. Your name and photo from there ' +
    'do not come over: on the site you appear by your @.',

  /* ---------------- /entrar ---------------- */
  'auth.entrar.esqueci': 'forgot password',
  'auth.entrar.redefinida': 'Password changed. Sign in with the new one.',

  /* ---------------- /entrar/callback ---------------- */
  'auth.callback.titulo': 'Idearium · Sign-in not completed',
  'auth.callback.descricao': 'Signing in with GitHub or Google was not completed.',
  'auth.callback.h1.antes': 'I could not ',
  'auth.callback.h1.apagado': 'finish signing you in.',
  'auth.callback.h1.vinculo.antes': 'I could not ',
  'auth.callback.h1.vinculo.apagado': 'connect the account.',
  'auth.callback.erro.estado':
    'The security check failed: the request did not start in this browser, or it ' +
    'timed out. Start again.',
  'auth.callback.erro.existe':
    'An account with that email already exists. Sign in with your password and ' +
    'connect {provedor} in your profile.',
  'auth.callback.erro.negado':
    'The {provedor} authorization was cancelled or refused. Nothing was changed.',
  'auth.callback.erro.expirado': 'The sign-in code expired. Try again: it takes under a minute.',
  'auth.callback.erro.emuso': 'That {provedor} account is already connected to another profile.',
  'auth.callback.erro.generico': 'I could not finish right now. Try again in a moment.',
  'auth.callback.voltar.entrar': 'back to sign in',
  'auth.callback.voltar.perfil': 'back to profile',

  /* ---------------- /recuperar-senha ---------------- */
  'auth.recuperar.titulo': 'Idearium · Recover password',
  'auth.recuperar.descricao': 'Ask for a link to set a new password.',
  'auth.recuperar.rotulo': 'recover password',
  'auth.recuperar.h1.antes': 'Forgot your password? ',
  'auth.recuperar.h1.apagado': 'Set a new one.',
  'auth.recuperar.sub': 'Enter the account email. If it exists, we send a link to set a new password.',
  'auth.recuperar.campo.email': 'email',
  'auth.recuperar.botao': 'send the link',
  'auth.recuperar.voltar': 'back to sign in',
  'auth.recuperar.erro.vazio': 'Fill in the email.',
  'auth.recuperar.erro.falha': 'I could not send it right now. Try again in a moment.',
  'auth.recuperar.enviado':
    'If that email has an account, the link is on its way. It is valid for a ' +
    'limited time. Check spam too.',

  /* ---------------- /redefinir-senha ---------------- */
  'auth.redefinir.titulo': 'Idearium · New password',
  'auth.redefinir.descricao': 'Set a new password for your account.',
  'auth.redefinir.rotulo': 'new password',
  'auth.redefinir.h1.antes': 'Choose a ',
  'auth.redefinir.h1.apagado': 'new password.',
  'auth.redefinir.sub': 'Once it changes, you sign in with it.',
  'auth.redefinir.campo.senha': 'new password',
  'auth.redefinir.campo.confirma': 'repeat the password',
  'auth.redefinir.ajuda': 'At least 10 characters. A sentence works.',
  'auth.redefinir.botao': 'change the password',
  'auth.redefinir.erro.vazio': 'Fill in the new password and the confirmation.',
  'auth.redefinir.erro.curta': 'The password needs at least 10 characters.',
  'auth.redefinir.erro.diferente': 'The two passwords do not match.',
  'auth.redefinir.erro.falha': 'I could not change it right now. Try again in a moment.',
  'auth.redefinir.invalido.h1.antes': 'This link ',
  'auth.redefinir.invalido.h1.apagado': 'is no longer valid.',
  'auth.redefinir.invalido.texto':
    'It expired, was already used or is incomplete. Ask for a new one: it takes under a minute.',
  'auth.redefinir.invalido.acao': 'ask for a new link',

  /* ---------------- /verificar-email/[token] ---------------- */
  'auth.verificar.titulo': 'Idearium · Verify email',
  'auth.verificar.descricao': 'Confirming the account email.',
  'auth.verificar.rotulo': 'verify email',
  'auth.verificar.ok.h1.antes': 'Email ',
  'auth.verificar.ok.h1.apagado': 'confirmed.',
  'auth.verificar.ok.texto': 'Done: this email is now verified.',
  'auth.verificar.expirado.h1.antes': 'This link ',
  'auth.verificar.expirado.h1.apagado': 'expired.',
  'auth.verificar.expirado.texto': 'Sign in and ask for another verification in your profile.',
  'auth.verificar.invalido.h1.antes': 'This link ',
  'auth.verificar.invalido.h1.apagado': 'is not valid.',
  'auth.verificar.invalido.texto':
    'It may have been copied halfway or already used. Sign in and ask for another verification in your profile.',
  'auth.verificar.falha.h1.antes': 'I could not ',
  'auth.verificar.falha.h1.apagado': 'verify right now.',
  'auth.verificar.falha.texto': 'The server did not answer. Open the link again in a moment.',
  'auth.verificar.acao.perfil': 'go to profile',
  'auth.verificar.acao.entrar': 'sign in',

  /* ---------------- /perfil ---------------- */
  'auth.perfil.email.aviso': 'Your email has not been verified yet.',
  'auth.perfil.email.reenviar': 'resend verification',
  'auth.perfil.email.reenviado': 'I sent another verification email.',
  'auth.perfil.email.erro': 'I could not resend it right now. Try again in a moment.',
  'auth.perfil.contas.titulo': 'connected accounts',
  'auth.perfil.contas.intro':
    'They are only for signing in. Your name and photo from GitHub or Google do not come over.',
  'auth.perfil.contas.conectada': 'connected',
  'auth.perfil.contas.nao': 'not connected',
  'auth.perfil.contas.conectar': 'connect',
  'auth.perfil.contas.desconectar': 'disconnect',
  'auth.perfil.contas.ultima':
    'It is your only way to sign in. Set a password with the "forgot password" ' +
    'link before disconnecting.',
  'auth.perfil.contas.conectou': 'Account connected.',
  'auth.perfil.contas.desconectou': 'Account disconnected.',
  'auth.perfil.contas.erro': 'I could not change the account right now. Try again in a moment.',
  'auth.perfil.contas.erro.ultima':
    'I cannot disconnect it: it is your only way to sign in.',
};

export default { 'pt-BR': ptBR, en };
