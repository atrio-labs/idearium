/* conta — /entrar, /criar-conta, /perfil, /sair e a leitura do @username
   que a vitrine de /criar-conta mostra (lib/pseudonimo.ts).

   Mensagens de validação e de credencial vêm da própria API, no idioma
   do header x-lang; aqui ficam só os textos da interface. Vocabulário
   fixo: RFC é "ideia"/"idea", /builders é "mãos"/"hands". */

const ptBR = {
  /* ---------------- /entrar ---------------- */
  'conta.entrar.titulo': 'Idearium · Entrar',
  'conta.entrar.descricao': 'Entre com email e senha pra escrever, discutir e construir ideias.',
  'conta.entrar.rotulo': 'entrar',
  'conta.entrar.h1.antes': 'Continue de onde ',
  'conta.entrar.h1.serif': 'parou',
  'conta.entrar.h1.depois': '.',
  'conta.entrar.sub.volta': 'Entre e você cai direto de volta onde estava.',
  'conta.entrar.sub.normal': 'Email e senha. A sessão fica de pé por 30 dias neste navegador.',
  'conta.entrar.erro.vazio': 'Preencha email e senha.',
  'conta.entrar.erro.rede': 'Não consegui falar com o servidor. Tente de novo em instantes.',
  'conta.entrar.campo.email': 'email',
  'conta.entrar.campo.senha': 'senha',
  'conta.entrar.ajuda.senha':
    'Esqueceu? Por enquanto não há recuperação automática — escreva pra ' +
    'quem mantém o Idearium.',
  'conta.entrar.botao.entrar': 'entrar',
  'conta.entrar.botao.criar': 'criar conta',

  'conta.entrar.aside': 'o que a sessão muda',
  'conta.entrar.veio.rotulo': 'o que te trouxe',
  'conta.entrar.veio.antes': 'Você ia para ',
  'conta.entrar.veio.depois': '.',
  'conta.entrar.mais.volta': 'e o que mais a sessão destrava',
  'conta.entrar.mais.normal': 'a conta não é portão',
  'conta.entrar.intro': 'O Idearium inteiro se lê sem conta. O que a sessão abre são três atos:',

  'conta.entrar.destino.nova': 'Você ia escrever uma ideia.',
  'conta.entrar.destino.perfil': 'Você ia mexer no seu perfil.',
  'conta.entrar.destino.editar.ideia':
    'Você ia corrigir esta ideia. A correção vira errata: nada é apagado.',
  'conta.entrar.destino.editar': 'Você ia corrigir uma ideia.',
  'conta.entrar.destino.ideia': 'Comentar ou se inscrever nesta ideia pede sessão. Ler, não.',
  'conta.entrar.destino.ideia.falha': 'Você ia para uma ideia que não consegui carregar agora.',

  'conta.entrar.ato.escrever': 'escrever uma ideia',
  'conta.entrar.ato.escrever.antes': 'vira',
  'conta.entrar.ato.escrever.gloss': 'não precisa saber fazer. precisa só querer que aconteça.',
  'conta.entrar.ato.comentar': 'comentar numa ideia',
  'conta.entrar.ato.comentar.antes': 'acontece de',
  'conta.entrar.ato.comentar.depois': 'em diante',
  'conta.entrar.ato.inscrever': 'se inscrever pra construir',
  'conta.entrar.ato.inscrever.antes': 'vira',

  'conta.entrar.sessao.entra': 'entra como ',
  'conta.entrar.sessao.vazio': 'seu email',
  'conta.entrar.sessao.nota': 'No site você aparece pelo seu @, nunca pelo email.',

  /* ---------------- /criar-conta ---------------- */
  'conta.criar.titulo': 'Idearium · Criar conta',
  'conta.criar.descricao':
    'Crie uma conta com pseudônimo pra escrever, discutir e construir ideias.',
  'conta.criar.rotulo': 'criar conta',
  'conta.criar.h1.antes': 'Comece pelo ',
  'conta.criar.h1.serif': 'pseudônimo',
  'conta.criar.h1.depois': '.',
  'conta.criar.sub':
    'O @username é a única coisa que pedimos. Nome real é opcional aqui e ' +
    'continua opcional depois.',
  'conta.criar.erro.vazio': 'Preencha nome de usuário, email e senha.',
  'conta.criar.erro.rede': 'Não consegui falar com o servidor. Tente de novo em instantes.',
  'conta.criar.username.rotulo': 'nome de usuário',
  'conta.criar.username.exemplo': '@voce',
  'conta.criar.username.dica':
    '3 a 30 caracteres: letras, dígitos, ponto, hífen ou sublinhado. Começa e ' +
    'termina com letra ou dígito. Maiúscula vira minúscula.',
  'conta.criar.username.ajuda':
    'De 3 a 30 caracteres: letras, dígitos, ponto, hífen e sublinhado. ' +
    'Começa e termina com letra ou dígito. Maiúscula vira minúscula. É ' +
    'público e não muda depois.',
  'conta.criar.email.rotulo': 'email',
  'conta.criar.email.ajuda':
    'Serve pra entrar. Não aparece no seu perfil nem pra quem lê o que você escreve.',
  'conta.criar.senha.rotulo': 'senha',
  'conta.criar.senha.ajuda':
    'No mínimo 10 caracteres. Comprimento vale mais que símbolo obrigatório, ' +
    'então uma frase serve.',
  'conta.criar.botao.criar': 'criar conta',
  'conta.criar.botao.entrar': 'já tenho conta',
  'conta.criar.nota': 'Ninguém precisa saber quem você é pra levar sua ideia a sério.',

  'conta.criar.vitrine.rotulo': 'o que esse nome vira',
  'conta.criar.vitrine.comentario':
    'Isso acontece na minha rua toda chuva forte. Sei descrever o problema, não sei construir.',
  'conta.criar.vitrine.legenda.comentario': 'assinando um comentário na discussão',
  'conta.criar.vitrine.bloco': 'construindo',
  'conta.criar.vitrine.legenda.lista':
    'na lista de quem constrói uma ideia. o pastel é o do lab dela',
  'conta.criar.vitrine.legenda.maos':
    'em /builders, se um dia você marcar que topa construir. lá o pastel do ' +
    'círculo sai do próprio nome, e não do lab',

  /* leitura do @username (lib/pseudonimo.ts) */
  'conta.pseudonimo.exemplo': 'voce',
  'conta.pseudonimo.recado.vazio': 'o de cima é exemplo. o seu entra assim que você digitar.',
  'conta.pseudonimo.recado.recusado': 'esse nome não é aceito: {motivo}.',
  'conta.pseudonimo.motivo.curto': 'são no mínimo 3 caracteres',
  'conta.pseudonimo.motivo.longo': 'são no máximo 30 caracteres',
  'conta.pseudonimo.motivo.caracteres':
    'só letras de a a z sem acento, dígitos, ponto, hífen e sublinhado',
  'conta.pseudonimo.motivo.borda': 'começa e termina com letra ou dígito',

  /* ---------------- /perfil ---------------- */
  'conta.perfil.titulo': 'Idearium · Seu perfil',
  'conta.perfil.descricao': 'Edite seus dados e o que você sabe fazer.',
  'conta.perfil.ver': 'ver como você aparece pros outros',
  'conta.perfil.h1.antes': 'Seu perfil, ',
  'conta.perfil.h1.serif': 'só o que você quiser',
  'conta.perfil.h1.depois': '.',
  'conta.perfil.sub.antes': 'O ',
  'conta.perfil.sub.depois':
    ' é o que as pessoas veem em toda parte. Nome, bio e o resto são ' +
    'opcionais — preencha o que ajudar quem for te encontrar.',

  'conta.perfil.quem.titulo': 'quem você é',
  'conta.perfil.quem.salvo': 'Pronto, seus dados foram salvos.',
  'conta.perfil.erro.salvar': 'Não consegui salvar agora.',
  'conta.perfil.nome.rotulo': 'nome',
  'conta.perfil.nome.ajuda.antes': 'Opcional. Fica ao lado do ',
  'conta.perfil.nome.ajuda.depois': ', nunca no lugar dele.',
  'conta.perfil.bio.rotulo': 'bio',
  'conta.perfil.bio.ajuda': 'Até 500 caracteres. De onde você fala, o que te interessa.',
  'conta.perfil.avatar.rotulo': 'endereço da sua imagem',
  'conta.perfil.avatar.erro':
    'Precisa ser um endereço completo, começando com https:// e com um domínio.',
  'conta.perfil.avatar.ajuda':
    'Uma imagem já hospedada em algum lugar. Deixe em branco pra ficar sem.',
  'conta.perfil.idioma.rotulo': 'idioma',
  'conta.perfil.idioma.ajuda':
    'Fica guardado no seu perfil. Ao salvar, a interface abre neste idioma.',
  'conta.perfil.quem.botao': 'salvar seus dados',

  'conta.perfil.oficio.titulo': 'o que você sabe fazer',
  'conta.perfil.oficio.intro.antes': 'Isto é opcional. Preencher é o que coloca o ',
  'conta.perfil.oficio.intro.meio': ' em ',
  'conta.perfil.oficio.intro.depois':
    ', a lista de quem topa construir ideia dos outros. Sem preencher você ' +
    'continua escrevendo, comentando e entrando em qualquer ideia — só não ' +
    'aparece lá. Depois de salvo, desmarcar a disponibilidade tira você da ' +
    'lista; o que você escreveu aqui continua no seu perfil público.',
  'conta.perfil.oficio.salvo': 'Pronto, salvei o que você sabe fazer.',
  'conta.perfil.headline.rotulo': 'uma linha sobre você',
  'conta.perfil.headline.ajuda': 'Até 140 caracteres.',
  'conta.perfil.temas.rotulo': 'temas',
  'conta.perfil.temas.exemplo': 'educação, dados abertos, ilustração',
  'conta.perfil.temas.max': 'Escolha no máximo {n} temas.',
  'conta.perfil.temas.tamanho': 'Cada tema cabe em {n} caracteres.',
  'conta.perfil.temas.ajuda':
    'Separe por vírgula. Até {max} temas, cada um com no máximo {tamanho} ' +
    'caracteres. É por eles que alguém lendo a lista decide te chamar pra uma ideia.',
  'conta.perfil.disponivel': 'estou disponível pra construir agora',
  'conta.perfil.disponivel.ajuda':
    'Desmarque quando estiver sem tempo: você sai da lista de mãos e volta ' +
    'marcando de novo. O cartão ao lado mostra o que acontece.',
  'conta.perfil.oficio.botao': 'salvar o que você sabe fazer',

  'conta.perfil.vitrine.rotulo': 'em mãos você aparece assim',
  'conta.perfil.vitrine.fora': 'Com a disponibilidade desmarcada você não aparece na lista.',
  'conta.perfil.vitrine.excesso':
    'Com mais de {n} temas não dá pra salvar — tire os que sobram.',
  'conta.perfil.vitrine.nota.dentro.antes': 'Salvar atualiza o que já está em ',
  'conta.perfil.vitrine.nota.dentro.depois': '.',
  'conta.perfil.vitrine.nota.fora.antes': 'Você ainda não está em ',
  'conta.perfil.vitrine.nota.fora.depois': '. Salvar coloca você lá.',

  'conta.perfil.link.publico': 'seu perfil público',
  'conta.perfil.link.sair': 'sair',
  'conta.perfil.falha.titulo': 'Não consegui carregar seu perfil',
  'conta.perfil.falha.texto':
    'A API não respondeu. Seus dados continuam lá; tente de novo em instantes.',

  /* ---------------- /sair ---------------- */
  'conta.sair.titulo': 'Idearium · Sair',
  'conta.sair.descricao': 'Encerrar a sessão neste navegador.',
  'conta.sair.rotulo': 'sair',
  'conta.sair.falha': 'A API não confirmou a revogação do acesso.',
  'conta.sair.falha.h1.antes': 'Saiu daqui, mas o servidor ',
  'conta.sair.falha.h1.serif': 'não confirmou',
  'conta.sair.falha.h1.depois': '.',
  'conta.sair.falha.sub.antes': 'Os cookies deste navegador foram apagados: aqui a sessão de ',
  'conta.sair.falha.sub.depois':
    ' acabou. O pedido de encerrar a sessão no servidor não passou, então ' +
    'quem tiver cópia do cookie antigo ainda consegue usá-la até ela expirar ' +
    'sozinha. Entre de novo e saia mais tarde, quando a API responder.',
  'conta.sair.falha.inicio': 'voltar ao início',
  'conta.sair.falha.entrar': 'entrar de novo',
  'conta.sair.h1.antes': 'Encerrar a sessão de ',
  'conta.sair.h1.depois': '?',
  'conta.sair.sub':
    'Vale só para este navegador. Nada que você escreveu sai do ar: as ' +
    'ideias, os comentários e as inscrições continuam onde estão.',
  'conta.sair.botao.sair': 'sair',
  'conta.sair.botao.ficar': 'ficar',
};

const en: Record<keyof typeof ptBR, string> = {
  /* ---------------- /entrar ---------------- */
  'conta.entrar.titulo': 'Idearium · Sign in',
  'conta.entrar.descricao': 'Sign in with email and password to write, discuss and build ideas.',
  'conta.entrar.rotulo': 'sign in',
  'conta.entrar.h1.antes': 'Pick up where you ',
  'conta.entrar.h1.serif': 'left off',
  'conta.entrar.h1.depois': '.',
  'conta.entrar.sub.volta': 'Sign in and you land right back where you were.',
  'conta.entrar.sub.normal': 'Email and password. The session stays open for 30 days in this browser.',
  'conta.entrar.erro.vazio': 'Fill in email and password.',
  'conta.entrar.erro.rede': 'I could not reach the server. Try again in a moment.',
  'conta.entrar.campo.email': 'email',
  'conta.entrar.campo.senha': 'password',
  'conta.entrar.ajuda.senha':
    'Forgot it? There is no automatic recovery yet — write to whoever ' +
    'maintains Idearium.',
  'conta.entrar.botao.entrar': 'sign in',
  'conta.entrar.botao.criar': 'create account',

  'conta.entrar.aside': 'what a session changes',
  'conta.entrar.veio.rotulo': 'what brought you here',
  'conta.entrar.veio.antes': 'You were going to ',
  'conta.entrar.veio.depois': '.',
  'conta.entrar.mais.volta': 'and what else a session unlocks',
  'conta.entrar.mais.normal': 'an account is not a gate',
  'conta.entrar.intro': 'All of Idearium can be read without an account. A session opens three acts:',

  'conta.entrar.destino.nova': 'You were about to write an idea.',
  'conta.entrar.destino.perfil': 'You were about to edit your profile.',
  'conta.entrar.destino.editar.ideia':
    'You were about to correct this idea. The correction becomes an erratum: nothing is erased.',
  'conta.entrar.destino.editar': 'You were about to correct an idea.',
  'conta.entrar.destino.ideia': 'Commenting on or joining this idea needs a session. Reading does not.',
  'conta.entrar.destino.ideia.falha': 'You were headed to an idea I could not load right now.',

  'conta.entrar.ato.escrever': 'write an idea',
  'conta.entrar.ato.escrever.antes': 'becomes',
  'conta.entrar.ato.escrever.gloss': 'you do not need to know how. you just need to want it to happen.',
  'conta.entrar.ato.comentar': 'comment on an idea',
  'conta.entrar.ato.comentar.antes': 'works from',
  'conta.entrar.ato.comentar.depois': 'onward',
  'conta.entrar.ato.inscrever': 'sign up to build',
  'conta.entrar.ato.inscrever.antes': 'becomes',

  'conta.entrar.sessao.entra': 'signing in as ',
  'conta.entrar.sessao.vazio': 'your email',
  'conta.entrar.sessao.nota': 'On the site you appear by your @, never by your email.',

  /* ---------------- /criar-conta ---------------- */
  'conta.criar.titulo': 'Idearium · Create account',
  'conta.criar.descricao':
    'Create an account with a pseudonym to write, discuss and build ideas.',
  'conta.criar.rotulo': 'create account',
  'conta.criar.h1.antes': 'Start with a ',
  'conta.criar.h1.serif': 'pseudonym',
  'conta.criar.h1.depois': '.',
  'conta.criar.sub':
    'The @username is the only thing we ask for. A real name is optional ' +
    'here and stays optional later.',
  'conta.criar.erro.vazio': 'Fill in username, email and password.',
  'conta.criar.erro.rede': 'I could not reach the server. Try again in a moment.',
  'conta.criar.username.rotulo': 'username',
  'conta.criar.username.exemplo': '@you',
  'conta.criar.username.dica':
    '3 to 30 characters: letters, digits, dot, hyphen or underscore. Starts ' +
    'and ends with a letter or digit. Uppercase becomes lowercase.',
  'conta.criar.username.ajuda':
    '3 to 30 characters: letters, digits, dot, hyphen and underscore. Starts ' +
    'and ends with a letter or digit. Uppercase becomes lowercase. It is ' +
    'public and does not change later.',
  'conta.criar.email.rotulo': 'email',
  'conta.criar.email.ajuda':
    'Used to sign in. It does not show on your profile or to anyone reading what you write.',
  'conta.criar.senha.rotulo': 'password',
  'conta.criar.senha.ajuda':
    'At least 10 characters. Length counts for more than required symbols, ' +
    'so a phrase works.',
  'conta.criar.botao.criar': 'create account',
  'conta.criar.botao.entrar': 'I already have an account',
  'conta.criar.nota': 'Nobody needs to know who you are to take your idea seriously.',

  'conta.criar.vitrine.rotulo': 'what this name becomes',
  'conta.criar.vitrine.comentario':
    'This happens on my street every heavy rain. I can describe the problem, I do not know how to build it.',
  'conta.criar.vitrine.legenda.comentario': 'signing a comment in the discussion',
  'conta.criar.vitrine.bloco': 'building',
  'conta.criar.vitrine.legenda.lista':
    'in the list of people building an idea. the pastel is its lab’s',
  'conta.criar.vitrine.legenda.maos':
    'in /builders, if you ever mark that you are up for building. there the ' +
    'circle’s pastel comes from the name itself, not from the lab',

  'conta.pseudonimo.exemplo': 'you',
  'conta.pseudonimo.recado.vazio': 'the one above is an example. yours shows up as soon as you type.',
  'conta.pseudonimo.recado.recusado': 'this name is not accepted: {motivo}.',
  'conta.pseudonimo.motivo.curto': 'it needs at least 3 characters',
  'conta.pseudonimo.motivo.longo': 'it can have at most 30 characters',
  'conta.pseudonimo.motivo.caracteres':
    'only letters a to z without accents, digits, dot, hyphen and underscore',
  'conta.pseudonimo.motivo.borda': 'it starts and ends with a letter or digit',

  /* ---------------- /perfil ---------------- */
  'conta.perfil.titulo': 'Idearium · Your profile',
  'conta.perfil.descricao': 'Edit your details and what you know how to do.',
  'conta.perfil.ver': 'see how you appear to others',
  'conta.perfil.h1.antes': 'Your profile, ',
  'conta.perfil.h1.serif': 'only what you want',
  'conta.perfil.h1.depois': '.',
  'conta.perfil.sub.antes': '',
  'conta.perfil.sub.depois':
    ' is what people see everywhere. Name, bio and the rest are optional — ' +
    'fill in whatever helps people find you.',

  'conta.perfil.quem.titulo': 'who you are',
  'conta.perfil.quem.salvo': 'Done, your details were saved.',
  'conta.perfil.erro.salvar': 'I could not save right now.',
  'conta.perfil.nome.rotulo': 'name',
  'conta.perfil.nome.ajuda.antes': 'Optional. Shown next to ',
  'conta.perfil.nome.ajuda.depois': ', never in place of it.',
  'conta.perfil.bio.rotulo': 'bio',
  'conta.perfil.bio.ajuda': 'Up to 500 characters. Where you speak from, what interests you.',
  'conta.perfil.avatar.rotulo': 'your image address',
  'conta.perfil.avatar.erro':
    'It must be a full address, starting with https:// and with a domain.',
  'conta.perfil.avatar.ajuda':
    'An image already hosted somewhere. Leave it blank to have none.',
  'conta.perfil.idioma.rotulo': 'language',
  'conta.perfil.idioma.ajuda':
    'Stored in your profile. When you save, the interface opens in this language.',
  'conta.perfil.quem.botao': 'save your details',

  'conta.perfil.oficio.titulo': 'what you know how to do',
  'conta.perfil.oficio.intro.antes': 'This is optional. Filling it in is what puts ',
  'conta.perfil.oficio.intro.meio': ' in ',
  'conta.perfil.oficio.intro.depois':
    ', the list of people up for building other people’s ideas. If you ' +
    'leave it blank you can still write, comment and join any idea — you just ' +
    'do not appear there. Once saved, unchecking availability takes you off ' +
    'the list; what you wrote here stays on your public profile.',
  'conta.perfil.oficio.salvo': 'Done, I saved what you know how to do.',
  'conta.perfil.headline.rotulo': 'one line about you',
  'conta.perfil.headline.ajuda': 'Up to 140 characters.',
  'conta.perfil.temas.rotulo': 'topics',
  'conta.perfil.temas.exemplo': 'education, open data, illustration',
  'conta.perfil.temas.max': 'Choose at most {n} topics.',
  'conta.perfil.temas.tamanho': 'Each topic fits in {n} characters.',
  'conta.perfil.temas.ajuda':
    'Separate with commas. Up to {max} topics, each with at most {tamanho} ' +
    'characters. Topics are how someone reading the list decides to call you to an idea.',
  'conta.perfil.disponivel': 'I am available to build now',
  'conta.perfil.disponivel.ajuda':
    'Uncheck it when you are out of time: you leave the hands list and come ' +
    'back by checking again. The card beside it shows what happens.',
  'conta.perfil.oficio.botao': 'save what you know how to do',

  'conta.perfil.vitrine.rotulo': 'in hands you appear like this',
  'conta.perfil.vitrine.fora': 'With availability unchecked you do not appear on the list.',
  'conta.perfil.vitrine.excesso':
    'With more than {n} topics it cannot be saved — remove the extra ones.',
  'conta.perfil.vitrine.nota.dentro.antes': 'Saving updates what is already in ',
  'conta.perfil.vitrine.nota.dentro.depois': '.',
  'conta.perfil.vitrine.nota.fora.antes': 'You are not in ',
  'conta.perfil.vitrine.nota.fora.depois': ' yet. Saving puts you there.',

  'conta.perfil.link.publico': 'your public profile',
  'conta.perfil.link.sair': 'sign out',
  'conta.perfil.falha.titulo': 'I could not load your profile',
  'conta.perfil.falha.texto':
    'The API did not respond. Your data is still there; try again in a moment.',

  /* ---------------- /sair ---------------- */
  'conta.sair.titulo': 'Idearium · Sign out',
  'conta.sair.descricao': 'End the session in this browser.',
  'conta.sair.rotulo': 'sign out',
  'conta.sair.falha': 'The API did not confirm that access was revoked.',
  'conta.sair.falha.h1.antes': 'You are out here, but the server ',
  'conta.sair.falha.h1.serif': 'did not confirm',
  'conta.sair.falha.h1.depois': '.',
  'conta.sair.falha.sub.antes': 'This browser’s cookies were erased: here, the session of ',
  'conta.sair.falha.sub.depois':
    ' is over. The request to end the session on the server did not go ' +
    'through, so anyone holding a copy of the old cookie can still use it ' +
    'until it expires by itself. Sign in again and sign out later, when the ' +
    'API responds.',
  'conta.sair.falha.inicio': 'back to the start',
  'conta.sair.falha.entrar': 'sign in again',
  'conta.sair.h1.antes': 'End the session of ',
  'conta.sair.h1.depois': '?',
  'conta.sair.sub':
    'It applies to this browser only. Nothing you wrote comes down: your ' +
    'ideas, comments and sign-ups stay where they are.',
  'conta.sair.botao.sair': 'sign out',
  'conta.sair.botao.ficar': 'stay',
};

export default { 'pt-BR': ptBR, en };
