/* rfcs — as telas de ideia: lista (/rfcs), detalhe (/rfcs/:slug),
   escrever (/rfcs/nova), editar, versões, o editor do corpo com a
   prévia e as mensagens do endpoint /api/previa.

   Os prefixos seguem a tela: rfcs.lista, rfcs.det, rfcs.nova,
   rfcs.editar, rfcs.versoes, rfcs.editor, rfcs.previa. O que nova e
   editar dividem (rótulos do formulário, mensagens de validação, o
   contador de caracteres) mora em rfcs.form, rfcs.erro e rfcs.contador.

   Texto com "{nome}" também serve pro cliente: a página passa o texto
   pronto num data-attribute, com o marcador no lugar da variável, e o
   script troca o marcador (ver nova.astro e a lista). */

const ptBR = {
  'rfcs.volta': '← todas as ideias',

  /* ---------- lista ---------- */
  'rfcs.lista.titulo': 'Idearium · Ideias',
  'rfcs.lista.h1.antes': 'Ideias abertas, ',
  'rfcs.lista.h1.apagado': 'esperando',
  'rfcs.lista.h1.depois': '.',
  'rfcs.lista.sub':
    'Cada uma é uma proposta numerada, escrita por alguém que conhece o ' +
    'problema. Filtre por domínio ou por momento do ciclo.',
  'rfcs.lista.aviso':
    ' A lista abaixo pode estar incompleta ou vazia por isso, não por ' +
    'falta de ideias.',
  'rfcs.lista.filtro.lab': 'laboratório',
  'rfcs.lista.filtro.todos': 'todos',
  'rfcs.lista.filtro.momento': 'momento',
  'rfcs.lista.filtro.qualquer': 'qualquer',
  'rfcs.lista.qtd.um': '{n} ideia',
  'rfcs.lista.qtd.varios': '{n} ideias',
  'rfcs.lista.qtd.filtrada.um': '{visiveis} de {total} ideia',
  'rfcs.lista.qtd.filtrada.varios': '{visiveis} de {total} ideias',
  'rfcs.lista.filtro.vazio.titulo': 'Nenhuma ideia com esse recorte',
  'rfcs.lista.filtro.vazio.texto':
    'Nenhuma ideia combina o laboratório e o momento escolhidos. Tente ' +
    'afrouxar um dos dois.',
  'rfcs.lista.falha.texto': 'Assim que a API voltar, a lista aparece aqui.',
  'rfcs.lista.vazio.titulo': 'Nenhuma ideia publicada ainda',
  'rfcs.lista.vazio.texto':
    'Ninguém publicou nada por enquanto. A primeira pode ser sua.',
  'rfcs.lista.vazio.acao': 'escrever uma ideia',

  /* ---------- detalhe ---------- */
  'rfcs.det.inexistente.titulo': 'Esta ideia não existe',
  'rfcs.det.inexistente.texto':
    'O endereço não corresponde a nenhuma ideia que você possa abrir.',
  'rfcs.det.inexistente.acao': 'ver as ideias abertas',
  'rfcs.det.falha.titulo': 'Não consegui carregar esta ideia',
  'rfcs.det.falha.texto':
    'O servidor não respondeu. A ideia continua onde estava; tente de ' +
    'novo em instantes.',

  'rfcs.det.rascunho.negrito': 'Este rascunho só aparece pra você.',
  'rfcs.det.rascunho.texto':
    ' Enquanto não for publicado, ninguém mais lê, comenta nem se ' +
    'inscreve. Publicar é o que dá número à ideia. ',
  'rfcs.det.rascunho.acao': 'editar e publicar',

  'rfcs.det.discussao': 'discussão',
  'rfcs.det.comentarios.um': '{n} comentário',
  'rfcs.det.comentarios.varios': '{n} comentários',
  'rfcs.det.pagina': ' · página {p} de {n}',
  'rfcs.det.anteriores': 'ver comentários anteriores',
  'rfcs.det.seguintes': 'ver comentários seguintes',
  'rfcs.det.editado': '· editado',
  'rfcs.det.editar.rotulo': 'editar seu comentário',
  'rfcs.det.salvar': 'salvar',
  'rfcs.det.cancelar': 'cancelar',
  'rfcs.det.editar': 'editar',
  'rfcs.det.remover': 'remover',
  'rfcs.det.remover.confirmar':
    'Remover deixa a marca [removido] no lugar do texto, e isso não ' +
    'volta atrás. Remover mesmo assim?',
  'rfcs.det.vazio.falha.titulo': 'Não consegui carregar a discussão',
  'rfcs.det.vazio.titulo': 'Ninguém comentou ainda',
  'rfcs.det.vazio.falha.texto':
    'O servidor não respondeu. Pode haver conversa aqui: recarregue em ' +
    'instantes.',
  'rfcs.det.vazio.arquivada':
    'A ideia foi arquivada sem discussão. O que está escrito continua ' +
    'aqui pra leitura.',
  'rfcs.det.vazio.logado':
    'A discussão é o que transforma uma ideia solta em proposta com ' +
    'escopo. Comece você, logo abaixo.',
  'rfcs.det.vazio.anonimo':
    'A discussão é o que transforma uma ideia solta em proposta com ' +
    'escopo. Comentar exige conta.',
  'rfcs.det.vazio.entrar': 'entrar para comentar',
  'rfcs.det.arquivada.convite':
    'Ideia arquivada: a discussão fica pra leitura e não recebe ' +
    'comentário novo.',
  'rfcs.det.novo.rotulo': 'escrever na discussão',
  'rfcs.det.novo.placeholder': 'o que ainda falta pra isso sair do papel?',
  'rfcs.det.novo.ajuda':
    'Comentário é público e fica no histórico. Editar marca "editado"; ' +
    'remover deixa "[removido]" no lugar do texto.',
  'rfcs.det.novo.acao': 'comentar',
  'rfcs.det.anonimo.convite':
    'A discussão é aberta pra leitura e exige conta pra escrever.',

  'rfcs.det.lado.titulo': 'para sair do papel',
  'rfcs.det.lado.falha':
    'Não consegui carregar quem está construindo: o servidor não ' +
    'respondeu. Pode haver gente aqui.',
  'rfcs.det.lado.ninguem':
    'Ninguém se inscreveu ainda. Quem sabe fazer entra sem aprovação e ' +
    'sem contrato.',
  'rfcs.det.lado.um': '{n} pessoa está construindo. Cabe mais.',
  'rfcs.det.lado.varios': '{n} pessoas estão construindo. Cabe mais.',
  'rfcs.det.lado.rascunho':
    'Rascunho não recebe inscrição. Publicar é o que abre a ideia pra ' +
    'quem quiser construir.',
  'rfcs.det.lado.arquivada':
    'Ideia arquivada. O que foi escrito continua aqui, mas não entra ' +
    'mais gente.',
  'rfcs.det.construir': 'quero construir',
  'rfcs.det.sair': 'sair desta ideia',
  'rfcs.det.sair.nota':
    'Sair tira seu nome de quem está construindo, e a discussão que ' +
    'você escreveu continua onde está. Voltar depois é entrar de novo.',
  'rfcs.det.entrar.nota':
    'Sem aprovação e sem contrato. Sair depois também é um clique.',
  'rfcs.det.construindo': 'construindo',
  'rfcs.det.voce.se.entrar': 'você, se entrar',
  'rfcs.det.passaram': 'passaram por aqui',
  'rfcs.det.historico': 'histórico',
  'rfcs.det.escrita.por': 'escrita por',
  'rfcs.det.publicada': 'publicada',
  'rfcs.det.ultima.mudanca': 'última mudança',
  'rfcs.det.versoes': 'versões',
  'rfcs.det.versoes.nota':
    'Nada é apagado: cada edição do corpo vira uma versão nova.',
  'rfcs.det.tags': 'tags',

  'rfcs.det.erro.inscricao.conflito':
    'Essa inscrição não vale mais. Recarregue a página para ver como a ' +
    'ideia está agora.',
  'rfcs.det.erro.inscricao':
    'Não consegui te inscrever agora. Tente de novo em instantes.',
  'rfcs.det.erro.sair.naoestava': 'Você já não estava nesta ideia.',
  'rfcs.det.erro.sair':
    'Não consegui te tirar daqui agora. Tente de novo em instantes.',
  'rfcs.det.erro.comentar.vazio': 'Comentário vazio não vai. Escreva alguma coisa.',
  'rfcs.det.erro.comentar.arquivada':
    'Esta ideia foi arquivada. A discussão não recebe comentário novo.',
  'rfcs.det.erro.comentar':
    'Não consegui publicar seu comentário agora. Tente de novo em instantes.',
  'rfcs.det.erro.editar.vazio':
    'Comentário vazio não vai. Para tirar o texto do ar, use remover.',
  'rfcs.det.erro.editar.alheio': 'Só quem escreveu o comentário pode editar.',
  'rfcs.det.erro.editar':
    'Não consegui salvar a edição agora. Tente de novo em instantes.',
  'rfcs.det.erro.remover.alheio': 'Só quem escreveu o comentário pode remover.',
  'rfcs.det.erro.remover':
    'Não consegui remover o comentário agora. Tente de novo em instantes.',

  /* ---------- formulário (nova e editar) ---------- */
  'rfcs.form.titulo': 'título',
  'rfcs.form.resumo': 'resumo',
  'rfcs.form.corpo': 'corpo',
  'rfcs.form.tags': 'tags',
  'rfcs.form.faixa': 'De {min} a {max} caracteres.',
  'rfcs.form.falta.negrito': 'Falta ajustar alguma coisa.',
  'rfcs.form.falta.texto':
    ' Os campos com problema estão marcados abaixo. Nada do que você ' +
    'escreveu se perdeu.',
  'rfcs.contador.min': '{n} / mínimo {min}',

  'rfcs.erro.titulo.min': 'O título precisa de pelo menos {min} caracteres.',
  'rfcs.erro.titulo.max': 'O título passou de {max} caracteres.',
  'rfcs.erro.resumo.min': 'O resumo precisa de pelo menos {min} caracteres.',
  'rfcs.erro.resumo.max': 'O resumo passou de {max} caracteres.',
  'rfcs.erro.corpo.min': 'O corpo precisa de pelo menos {min} caracteres.',
  'rfcs.erro.corpo.max': 'O corpo passou de {max} caracteres.',
  'rfcs.erro.tags.max': 'No máximo {max} tags.',
  'rfcs.erro.tags.tamanho': 'Cada tag precisa ter de {min} a {max} caracteres.',
  'rfcs.erro.tags.semletras':
    'Tag é guardada só por letras e números, e de {lista} não sobra ' +
    'nada. Reescreva com pelo menos {min} letras ou números.',
  'rfcs.erro.tags.repetidas':
    'Acento e pontuação não separam tags: {lista} são a mesma. Deixe ' +
    'uma só.',
  'rfcs.erro.tags.par': '{a} e {b}',

  /* ---------- escrever ---------- */
  'rfcs.nova.titulo': 'Escrever uma ideia · Idearium',
  'rfcs.nova.descricao':
    'Escreva uma proposta. Salvar cria um rascunho; publicar é um ' +
    'segundo passo.',
  'rfcs.nova.h1.antes': 'Escrever uma ',
  'rfcs.nova.h1.serif': 'ideia',
  'rfcs.nova.h1.depois': '.',
  'rfcs.nova.sub':
    'Você está começando um rascunho. Salvar não publica nada: o texto ' +
    'fica só com você até decidir publicar, num segundo passo deliberado.',
  'rfcs.nova.semlabs.falha':
    'Toda ideia pertence a um laboratório, e não consegui carregar a ' +
    'lista. Sem ela não dá pra começar o rascunho. Tente de novo em ' +
    'instantes.',
  'rfcs.nova.semlabs.titulo': 'Nenhum laboratório cadastrado',
  'rfcs.nova.semlabs.texto':
    'Toda ideia pertence a um laboratório, e ainda não existe nenhum. ' +
    'Fale com quem mantém o Idearium.',
  'rfcs.nova.semlabs.acao': 'voltar para as ideias',
  'rfcs.nova.erro.salvar.negrito': 'Não consegui salvar.',
  'rfcs.nova.erro.salvar': 'Não consegui salvar o rascunho agora.',
  'rfcs.nova.erro.corpo.min':
    'O corpo precisa de pelo menos {min} caracteres. Descreva o problema ' +
    'antes da solução.',
  'rfcs.nova.erro.lab': 'Escolha o laboratório onde a ideia vive.',

  'rfcs.nova.titulo.placeholder': 'Biblioteca cooperativa de bairro',
  'rfcs.nova.titulo.ajuda': ' Nomeie o problema, não a solução.',
  'rfcs.nova.resumo.placeholder':
    'Uma frase que faça alguém que não conhece o assunto entender o que ' +
    'está em jogo.',
  'rfcs.nova.resumo.ajuda':
    ' É o que aparece no cartão da listagem, então é por ele que a ' +
    'ideia é escolhida ou ignorada.',
  'rfcs.nova.lab.rotulo': 'laboratório',
  'rfcs.nova.lab.escolha': 'escolha um laboratório',
  'rfcs.nova.lab.ajuda':
    'O laboratório é o recorte temático, não um silo: quem transita por ' +
    'outros labs continua enxergando a ideia.',
  'rfcs.nova.corpo.placeholder':
    '## O problema\n\nQuem sente, onde, com que frequência.\n\n' +
    '## O que eu proponho\n\n- primeiro passo\n- segundo passo\n\n' +
    '## O que ainda não sei\n\nSeja honesto aqui. É o que atrai quem ' +
    'sabe fazer.',
  'rfcs.nova.corpo.ajuda':
    'Mínimo de {min} caracteres, máximo de {max}. Aceita markdown: o ' +
    'quadro ao lado lista o que é reconhecido, e "ver como fica" mostra ' +
    'o texto como a página da ideia vai mostrar.',
  'rfcs.nova.tags.placeholder': 'mobilidade, praça, orçamento participativo',
  'rfcs.nova.tags.ajuda':
    'Opcional. Separe por vírgula, até {max} tags de {min} a {tam} ' +
    'caracteres cada. Só letras e números contam, então "praça" e ' +
    '"praca" são a mesma tag. Dá pra mudar depois.',
  'rfcs.nova.salvar': 'salvar como rascunho',
  'rfcs.nova.descartar': 'descartar',

  'rfcs.nova.previa.rotulo': 'o que você está fabricando',
  'rfcs.nova.previa.titulo': 'Sua ideia aparece aqui',
  'rfcs.nova.previa.resumo':
    'E o resumo dela aqui — uma frase que diga o que está em jogo.',
  'rfcs.nova.previa.lab': 'escolha o laboratório',
  'rfcs.nova.medida.ok': '{atual}/{max}',
  'rfcs.nova.medida.fora':
    '{atual}/{max} · {sobra} a mais do que cabe; não dá pra salvar assim',
  'rfcs.nova.previa.nota.antes': 'O chip fica em ',
  'rfcs.nova.previa.nota.negrito': 'rascunho',
  'rfcs.nova.previa.nota.depois':
    ' e o cartão não tem número: ele só é atribuído na publicação, e ' +
    'esta tela não publica. A capa é desenhada a partir da identidade e ' +
    'do número da ideia, então este desenho é provisório — o ' +
    'laboratório é a única parte dela que você escolhe aqui.',

  'rfcs.nova.bloco.titulo': 'salvar não publica',
  'rfcs.nova.bloco.texto.antes': 'Por isso o chip do cartão está travado em ',
  'rfcs.nova.bloco.texto.negrito': 'rascunho',
  'rfcs.nova.bloco.texto.depois':
    ': o que você salvar aqui não aparece em nenhuma listagem, ninguém ' +
    'além de você abre, e ainda não tem número.',
  'rfcs.nova.bloco.aosalvar': 'ao salvar',
  'rfcs.nova.bloco.aopublicar': 'ao publicar',
  'rfcs.nova.bloco.nota':
    'Publicar é um botão separado, na tela de edição. É lá que a ideia ' +
    'ganha o número permanente.',

  'rfcs.nova.md.titulo': 'markdown reconhecido',
  'rfcs.nova.md.secao': 'seção',
  'rfcs.nova.md.subsecao': 'subseção',
  'rfcs.nova.md.negrito': 'negrito',
  'rfcs.nova.md.italico': 'itálico',
  'rfcs.nova.md.link': 'link',
  'rfcs.nova.md.lista': 'lista',
  'rfcs.nova.md.numerada': 'lista numerada',
  'rfcs.nova.md.citacao': 'citação',
  'rfcs.nova.md.codigo': 'código',
  'rfcs.nova.md.bloco': 'bloco de código',
  'rfcs.nova.md.divisoria': 'divisória',
  'rfcs.nova.md.tabela': 'tabela',
  'rfcs.nova.md.nota':
    'HTML aparece como texto. Imagem não entra: vira link, porque ' +
    'imagem de fora entrega o endereço de quem lê ao dono dela.',
  'rfcs.nova.como.titulo': 'como se escreve aqui',
  'rfcs.nova.como.texto':
    'Comece pelo problema e por quem o sente. Diga o que você não sabe ' +
    'fazer: é isso que faz alguém se inscrever. Não precisa estar ' +
    'pronta — precisa estar clara.',

  /* ---------- editar ---------- */
  'rfcs.editar.titulo': 'Editar · {titulo}',
  'rfcs.editar.titulo.inexistente': 'Não encontrei essa ideia · Idearium',
  'rfcs.editar.inexistente.antes': 'Não encontrei essa ',
  'rfcs.editar.inexistente.serif': 'ideia',
  'rfcs.editar.inexistente.depois': '.',
  'rfcs.editar.inexistente.falha.titulo': 'O servidor não respondeu',
  'rfcs.editar.inexistente.titulo': 'Nada para editar neste endereço',
  'rfcs.editar.inexistente.falha.texto':
    'Não consegui falar com a API, então não sei nem se essa ideia ' +
    'existe. Tente de novo em instantes.',
  'rfcs.editar.inexistente.texto':
    'Ou o endereço está errado, ou essa ideia não é sua para editar. ' +
    'Rascunho só existe para quem escreveu.',
  'rfcs.editar.inexistente.acao': 'ver as ideias abertas',

  'rfcs.editar.volta': '← ver a ideia',
  'rfcs.editar.h1': 'Editando ',
  'rfcs.editar.sub.rascunho':
    'Ainda é rascunho: só você enxerga, e ela ainda não tem número. O ' +
    'cartão ao lado é o que o resto do mundo vai ver quando você publicar.',
  'rfcs.editar.sub.publicada':
    'Já está publicada e tem número permanente. Toda mudança no corpo ' +
    'entra no histórico, à vista de quem lê.',
  'rfcs.editar.sub.arquivada':
    'Foi arquivada antes de ser publicada, então nunca recebeu número. O ' +
    'texto continua aqui e continua editável.',
  'rfcs.editar.criada.negrito': 'Rascunho criado.',
  'rfcs.editar.criada.texto':
    ' Ele existe, mas ninguém além de você o vê. Quando quiser, publique.',
  'rfcs.editar.tagsfalhou.negrito': 'As tags não foram salvas.',
  'rfcs.editar.tagsfalhou.texto':
    ' O rascunho está inteiro, só o conjunto de tags não passou. Tente ' +
    'de novo no bloco de tags.',

  'rfcs.editar.ok.tags': 'Tags trocadas. O conjunto agora é exatamente o que está no campo.',
  'rfcs.editar.ok.tags.vazio': 'Tags removidas: a ideia ficou sem nenhuma.',
  'rfcs.editar.ok.versao':
    'Salvo. O corpo mudou, então nasceu a versão {n} — a anterior ' +
    'continua no histórico.',
  'rfcs.editar.ok.semversao':
    'Salvo. O corpo não mudou, então nenhuma versão nova foi criada.',
  'rfcs.editar.erro.publicar': 'Não consegui publicar agora.',
  'rfcs.editar.erro.arquivar.rascunho':
    'Rascunho não se arquiva: ele já está fora de todas as listagens. Ou ' +
    'publique, ou deixe onde está.',
  'rfcs.editar.erro.arquivar.confirmar': 'Marque a confirmação antes de arquivar.',
  'rfcs.editar.erro.arquivar': 'Não consegui arquivar agora.',
  'rfcs.editar.erro.tags': 'Não consegui trocar as tags agora.',
  'rfcs.editar.erro.salvar': 'Não consegui salvar agora.',

  'rfcs.editar.titulo.ajuda': ' O endereço da ideia não muda quando o título muda.',
  'rfcs.editar.resumo.ajuda': ' É o que aparece no cartão da listagem.',
  'rfcs.editar.corpo.ajuda.antes': 'Mínimo de {min} caracteres. Aceita markdown: seções (',
  'rfcs.editar.corpo.ajuda.depois':
    ', links, listas, citação (',
  'rfcs.editar.corpo.ajuda.fim':
    '), código, tabela. HTML aparece como texto e imagem vira link. "Ver ' +
    'como fica" mostra o resultado.',
  'rfcs.editar.corpo.ajuda.negrito': 'negrito',
  'rfcs.editar.corpo.ajuda.italico': 'itálico',
  'rfcs.editar.salvar': 'salvar',
  'rfcs.editar.vercomo': 'ver como ficou',

  'rfcs.editar.previa.rotulo': 'o cartão público desta ideia',
  'rfcs.editar.previa.agora': 'agora',
  'rfcs.editar.previa.depois': 'depois de publicar',
  'rfcs.editar.previa.grupo': 'o cartão, antes e depois de publicar',
  'rfcs.editar.previa.vazio.titulo': 'sua ideia aparece aqui',
  'rfcs.editar.previa.vazio.resumo':
    'e o resumo, aqui — é por ele que alguém escolhe entrar',
  'rfcs.editar.previa.capa': 'a capa nasce com o número',
  'rfcs.editar.previa.nota': 'Título e resumo acompanham o formulário enquanto você escreve.',
  'rfcs.editar.previa.nota.rascunho':
    ' O chip e o número só mudam quando você publicar — e a capa é ' +
    'desenhada a partir do número, então ela nasce junto com ele.',
  'rfcs.editar.previa.nota.publicada':
    ' O número já é permanente e não acompanha nada.',
  'rfcs.editar.previa.nota.arquivada':
    ' Ela nunca recebeu número, então o cartão mostra "rascunho" no lugar dele.',

  'rfcs.editar.publicar.titulo': 'publicar',
  'rfcs.editar.publicar.texto':
    'Publicar tira a ideia da gaveta: ela entra nas listagens, abre para ' +
    'discussão e para quem quiser construir. É este botão que troca o ' +
    'chip do cartão acima.',
  'rfcs.editar.publicar.fraco':
    'No mesmo instante o banco atribui o número, em sequência. Nem esta ' +
    'tela sabe qual será — por isso a vaga aparece em branco. Depois de ' +
    'atribuído ele nunca muda, e publicar não tem desfazer.',
  'rfcs.editar.publicar.acao': 'publicar',
  'rfcs.editar.publicada.titulo': 'já publicada',
  'rfcs.editar.publicada.numero': 'número',
  'rfcs.editar.publicada.quando': 'publicada',
  'rfcs.editar.publicada.nota':
    'O número é permanente. Ele identifica a ideia mesmo depois de o ' +
    'título mudar.',
  'rfcs.editar.nunca.titulo': 'nunca publicada',
  'rfcs.editar.nunca.texto':
    'Ela foi arquivada enquanto ainda era rascunho: não recebeu número e ' +
    'não passou por nenhuma listagem.',
  'rfcs.editar.nunca.nenhum': 'nenhum',
  'rfcs.editar.nunca.quando': 'arquivada',
  'rfcs.editar.nunca.nota':
    'Publicar exige rascunho, e ela deixou de ser um ao ser arquivada. ' +
    'Hoje não existe caminho de volta.',

  'rfcs.editar.errata.titulo': 'a errata que nasce',
  'rfcs.editar.errata.versoes': 'versões hoje',
  'rfcs.editar.errata.ultima': 'última mudança',
  'rfcs.editar.errata.igual':
    'O corpo está igual ao que já foi salvo. Salvar agora não cria ' +
    'versão nova, e nada aparece no histórico.',
  'rfcs.editar.errata.acrescido.antes':
    'O corpo mudou, mas nenhum trecho foi trocado: o que você fez foi ' +
    'acrescentar ou cortar. A ',
  'rfcs.editar.errata.acrescido.depois':
    ' nasce do mesmo jeito, e o texto anterior continua no histórico.',
  'rfcs.editar.errata.gatilho': 'errata · o trecho que você trocou',
  'rfcs.editar.errata.data': 'vai nascer como v0.{n} quando você salvar',
  'rfcs.editar.errata.fraco':
    'Errata é isto: o trecho antigo continua legível, riscado, com a ' +
    'correção ao lado e datada. Editar não sobrescreve — nada se perde. ' +
    'Só o corpo cria versão; título e resumo mudam em silêncio.',

  'rfcs.editar.tags.titulo': 'tags',
  'rfcs.editar.tags.ilegiveis.negrito': 'Não consegui ler as tags desta ideia.',
  'rfcs.editar.tags.ilegiveis.texto':
    ' O formulário fica fora do ar de propósito: campo vazio aqui ' +
    'significa apagar todas, e eu não sei o que há para apagar. Recarregue ' +
    'em instantes.',
  'rfcs.editar.tags.rotulo': 'o conjunto inteiro',
  'rfcs.editar.tags.placeholder': 'mobilidade, praça',
  'rfcs.editar.tags.ajuda.antes': 'Separe por vírgula, até {max} tags. O que você enviar',
  'rfcs.editar.tags.ajuda.negrito': ' substitui todas as tags de uma vez',
  'rfcs.editar.tags.ajuda.depois':
    ': o que sair do campo sai da ideia. Campo vazio remove todas. Só ' +
    'letras e números contam, então "praça" e "praca" são a mesma tag.',
  'rfcs.editar.tags.acao': 'trocar tags',

  'rfcs.editar.arquivada.titulo': 'arquivada',
  'rfcs.editar.arquivada.texto':
    'Foi arquivada {quando}. Nada foi deletado: o texto continua legível ' +
    'no endereço dela, com a discussão, as inscrições e todas as ' +
    'versões. Tirar do arquivo ainda não existe — nenhuma tela e nenhuma ' +
    'rota devolvem a ideia ao estado anterior.',
  'rfcs.editar.arquivar.titulo': 'arquivar',
  'rfcs.editar.arquivar.antes': 'Arquivar diz que a ideia esfriou, e só isso. ',
  'rfcs.editar.arquivar.negrito': 'Não deleta.',
  'rfcs.editar.arquivar.depois':
    ' Ela sai das listagens, mas continua legível no endereço dela, com o ' +
    'texto, a discussão, as inscrições e todas as versões de pé.',
  'rfcs.editar.arquivar.fraco':
    'Voltar do arquivo é previsto no desenho do produto, mas ainda não ' +
    'existe tela nem rota que desarquive. Hoje, quando arquivar, fica ' +
    'arquivada.',
  'rfcs.editar.arquivar.confirmo':
    'entendo que a ideia sai das listagens e que hoje não há como desarquivar',
  'rfcs.editar.arquivar.acao': 'arquivar',

  /* ---------- versões ---------- */
  'rfcs.versoes.titulo': 'Versões · {titulo}',
  'rfcs.versoes.titulo.padrao': 'Versões · Idearium',
  'rfcs.versoes.falha.antes': 'Não consegui abrir esta ',
  'rfcs.versoes.falha.apagado': 'ideia',
  'rfcs.versoes.falha.depois': '.',
  'rfcs.versoes.falha.titulo': 'O servidor não respondeu',
  'rfcs.versoes.falha.texto':
    'Não consegui falar com a API. A ideia e as versões dela continuam ' +
    'onde estavam; tente de novo em instantes.',
  'rfcs.versoes.falha.acao': 'ver as ideias abertas',
  'rfcs.versoes.volta': '← voltar para a ideia',
  'rfcs.versoes.h1': 'Versões de ',
  'rfcs.versoes.sub':
    'Nada é apagado: cada edição do corpo vira uma versão nova, e dá ' +
    'para comparar quaisquer duas. Só o corpo é versionado; o título e o ' +
    'resumo mostram sempre o estado de agora.',
  'rfcs.versoes.aviso.negrito': 'Não consegui carregar as versões.',
  'rfcs.versoes.aviso.texto': ' A API não respondeu. A ideia está intacta; recarregue em instantes.',
  'rfcs.versoes.primeira.titulo': 'Esta ideia ainda está na primeira versão',
  'rfcs.versoes.primeira.texto':
    'Quando o corpo for editado, a versão anterior fica guardada aqui e ' +
    'dá para ver o que mudou.',
  'rfcs.versoes.primeira.acao': 'voltar para a ideia',
  'rfcs.versoes.unica.texto':
    'Quando o corpo for editado, a versão anterior fica guardada aqui e ' +
    'dá para ver o que mudou. Por enquanto, só existe o texto original.',
  'rfcs.versoes.unica.acao': 'ler o texto da v1',
  'rfcs.versoes.invalida.negrito': 'Versão não encontrada.',
  'rfcs.versoes.invalida.v':
    'Não existe a versão “{v}” desta ideia. As versões vão de v1 a v{max}.',
  'rfcs.versoes.invalida.par':
    'Não consegui comparar essas versões. Escolha duas entre v1 e v{max}.',
  'rfcs.versoes.comparar': 'comparar',
  'rfcs.versoes.de': 'de (antes)',
  'rfcs.versoes.para': 'para (depois)',
  'rfcs.versoes.texto.titulo': 'texto da v{n} · {quando}',
  'rfcs.versoes.texto.nota': 'Este é o markdown como foi escrito, sem formatação aplicada.',
  'rfcs.versoes.texto.mudou': 'Ver o que mudou em relação à v{n}',
  'rfcs.versoes.diff.titulo': 'o que mudou · v{de} → v{para}',
  'rfcs.versoes.diff.mesma':
    'Você escolheu a mesma versão dos dois lados, então não há o que comparar.',
  'rfcs.versoes.diff.identico': 'Essas duas versões têm o corpo idêntico.',
  'rfcs.versoes.diff.tiradas.um': '{n} linha tirada',
  'rfcs.versoes.diff.tiradas.varios': '{n} linhas tiradas',
  'rfcs.versoes.diff.acrescentadas.um': '{n} linha acrescentada',
  'rfcs.versoes.diff.acrescentadas.varios': '{n} linhas acrescentadas',
  'rfcs.versoes.diff.rotulo': 'Diferença entre a v{de} e a v{para}',
  'rfcs.versoes.diff.iguais.um': '{n} linha igual',
  'rfcs.versoes.diff.iguais.varios': '{n} linhas iguais',
  'rfcs.versoes.diff.removido': 'removido: ',
  'rfcs.versoes.diff.acrescentado': 'acrescentado: ',
  'rfcs.versoes.lado.titulo': 'todas as versões',
  'rfcs.versoes.atual': 'atual',
  'rfcs.versoes.por': 'por @{nome}',
  'rfcs.versoes.ler': 'ler texto',
  'rfcs.versoes.omudou': 'o que mudou',

  /* ---------- editor do corpo (EditorCorpo.astro) ---------- */
  'rfcs.editor.modo': 'modo do corpo',
  'rfcs.editor.escrever': 'escrever',
  'rfcs.editor.ver': 'ver como fica',
  'rfcs.editor.carregando': 'montando a prévia…',
  'rfcs.editor.vazio':
    'Nada escrito ainda. Volte para escrever e o texto aparece aqui ' +
    'como vai ficar na página da ideia.',
  'rfcs.editor.rede':
    'Não consegui falar com o servidor. Seu texto continua no campo; ' +
    'volte para escrever e tente de novo.',
  'rfcs.editor.padrao':
    'Não consegui montar a prévia agora. Seu texto continua no campo.',

  /* ---------- endpoint /api/previa ---------- */
  'rfcs.previa.sessao': 'Sua sessão expirou. Entre de novo para ver a prévia.',
  'rfcs.previa.json': 'A prévia só aceita JSON.',
  'rfcs.previa.grande': 'Texto grande demais para a prévia.',
  'rfcs.previa.pedido': 'Não entendi o pedido de prévia.',
  'rfcs.previa.caracteres': 'O corpo passou de {max} caracteres.',
};

const en: Record<keyof typeof ptBR, string> = {
  'rfcs.volta': '← all ideas',

  /* ---------- list ---------- */
  'rfcs.lista.titulo': 'Idearium · Ideas',
  'rfcs.lista.h1.antes': 'Open ideas, ',
  'rfcs.lista.h1.apagado': 'waiting',
  'rfcs.lista.h1.depois': '.',
  'rfcs.lista.sub':
    'Each one is a numbered proposal, written by someone who knows the ' +
    'problem. Filter by domain or by stage of the cycle.',
  'rfcs.lista.aviso':
    ' The list below may be incomplete or empty because of that, not ' +
    'because there are no ideas.',
  'rfcs.lista.filtro.lab': 'lab',
  'rfcs.lista.filtro.todos': 'all',
  'rfcs.lista.filtro.momento': 'stage',
  'rfcs.lista.filtro.qualquer': 'any',
  'rfcs.lista.qtd.um': '{n} idea',
  'rfcs.lista.qtd.varios': '{n} ideas',
  'rfcs.lista.qtd.filtrada.um': '{visiveis} of {total} idea',
  'rfcs.lista.qtd.filtrada.varios': '{visiveis} of {total} ideas',
  'rfcs.lista.filtro.vazio.titulo': 'No ideas match this filter',
  'rfcs.lista.filtro.vazio.texto':
    'No idea matches the lab and stage you picked. Try loosening one of ' +
    'the two.',
  'rfcs.lista.falha.texto': 'As soon as the API is back, the list shows up here.',
  'rfcs.lista.vazio.titulo': 'No ideas published yet',
  'rfcs.lista.vazio.texto':
    'Nobody has published anything so far. The first one could be yours.',
  'rfcs.lista.vazio.acao': 'write an idea',

  /* ---------- detail ---------- */
  'rfcs.det.inexistente.titulo': 'This idea does not exist',
  'rfcs.det.inexistente.texto':
    'The address does not match any idea you can open.',
  'rfcs.det.inexistente.acao': 'see the open ideas',
  'rfcs.det.falha.titulo': 'I could not load this idea',
  'rfcs.det.falha.texto':
    'The server did not respond. The idea is still where it was; try ' +
    'again in a moment.',

  'rfcs.det.rascunho.negrito': 'Only you can see this draft.',
  'rfcs.det.rascunho.texto':
    ' Until it is published, nobody else can read it, comment on it or ' +
    'sign up. Publishing is what gives the idea a number. ',
  'rfcs.det.rascunho.acao': 'edit and publish',

  'rfcs.det.discussao': 'discussion',
  'rfcs.det.comentarios.um': '{n} comment',
  'rfcs.det.comentarios.varios': '{n} comments',
  'rfcs.det.pagina': ' · page {p} of {n}',
  'rfcs.det.anteriores': 'see earlier comments',
  'rfcs.det.seguintes': 'see later comments',
  'rfcs.det.editado': '· edited',
  'rfcs.det.editar.rotulo': 'edit your comment',
  'rfcs.det.salvar': 'save',
  'rfcs.det.cancelar': 'cancel',
  'rfcs.det.editar': 'edit',
  'rfcs.det.remover': 'remove',
  'rfcs.det.remover.confirmar':
    'Removing leaves a [removed] mark in place of the text, and it ' +
    'cannot be undone. Remove anyway?',
  'rfcs.det.vazio.falha.titulo': 'I could not load the discussion',
  'rfcs.det.vazio.titulo': 'Nobody has commented yet',
  'rfcs.det.vazio.falha.texto':
    'The server did not respond. There may be conversation here: reload ' +
    'in a moment.',
  'rfcs.det.vazio.arquivada':
    'The idea was archived without any discussion. What is written is ' +
    'still here to read.',
  'rfcs.det.vazio.logado':
    'Discussion is what turns a loose idea into a proposal with a scope. ' +
    'Start it yourself, right below.',
  'rfcs.det.vazio.anonimo':
    'Discussion is what turns a loose idea into a proposal with a scope. ' +
    'Commenting needs an account.',
  'rfcs.det.vazio.entrar': 'sign in to comment',
  'rfcs.det.arquivada.convite':
    'Archived idea: the discussion stays open for reading and takes no ' +
    'new comments.',
  'rfcs.det.novo.rotulo': 'write in the discussion',
  'rfcs.det.novo.placeholder': 'what is still missing to get this off the page?',
  'rfcs.det.novo.ajuda':
    'A comment is public and stays in the history. Editing marks it ' +
    '"edited"; removing leaves "[removed]" in place of the text.',
  'rfcs.det.novo.acao': 'comment',
  'rfcs.det.anonimo.convite':
    'The discussion is open to read and needs an account to write.',

  'rfcs.det.lado.titulo': 'to get off the page',
  'rfcs.det.lado.falha':
    'I could not load who is building: the server did not respond. ' +
    'There may be people here.',
  'rfcs.det.lado.ninguem':
    'Nobody has signed up yet. Anyone who knows how to build can join ' +
    'without approval and without a contract.',
  'rfcs.det.lado.um': '{n} person is building this. There is room for more.',
  'rfcs.det.lado.varios': '{n} people are building this. There is room for more.',
  'rfcs.det.lado.rascunho':
    'A draft takes no sign-ups. Publishing is what opens the idea to ' +
    'anyone who wants to build.',
  'rfcs.det.lado.arquivada':
    'Archived idea. What was written is still here, but nobody else can ' +
    'join.',
  'rfcs.det.construir': 'I want to build',
  'rfcs.det.sair': 'leave this idea',
  'rfcs.det.sair.nota':
    'Leaving takes your name off the people building, and the ' +
    'discussion you wrote stays where it is. Coming back later means ' +
    'joining again.',
  'rfcs.det.entrar.nota':
    'No approval and no contract. Leaving later is one click too.',
  'rfcs.det.construindo': 'building',
  'rfcs.det.voce.se.entrar': 'you, if you join',
  'rfcs.det.passaram': 'passed through',
  'rfcs.det.historico': 'history',
  'rfcs.det.escrita.por': 'written by',
  'rfcs.det.publicada': 'published',
  'rfcs.det.ultima.mudanca': 'last change',
  'rfcs.det.versoes': 'versions',
  'rfcs.det.versoes.nota':
    'Nothing is deleted: every edit to the body becomes a new version.',
  'rfcs.det.tags': 'tags',

  'rfcs.det.erro.inscricao.conflito':
    'That sign-up is no longer valid. Reload the page to see how the ' +
    'idea looks now.',
  'rfcs.det.erro.inscricao':
    'I could not sign you up right now. Try again in a moment.',
  'rfcs.det.erro.sair.naoestava': 'You were not in this idea anyway.',
  'rfcs.det.erro.sair':
    'I could not take you out right now. Try again in a moment.',
  'rfcs.det.erro.comentar.vazio': 'An empty comment will not go through. Write something.',
  'rfcs.det.erro.comentar.arquivada':
    'This idea was archived. The discussion takes no new comments.',
  'rfcs.det.erro.comentar':
    'I could not publish your comment right now. Try again in a moment.',
  'rfcs.det.erro.editar.vazio':
    'An empty comment will not go through. To take the text down, use remove.',
  'rfcs.det.erro.editar.alheio': 'Only the author of a comment can edit it.',
  'rfcs.det.erro.editar':
    'I could not save the edit right now. Try again in a moment.',
  'rfcs.det.erro.remover.alheio': 'Only the author of a comment can remove it.',
  'rfcs.det.erro.remover':
    'I could not remove the comment right now. Try again in a moment.',

  /* ---------- form (new and edit) ---------- */
  'rfcs.form.titulo': 'title',
  'rfcs.form.resumo': 'summary',
  'rfcs.form.corpo': 'body',
  'rfcs.form.tags': 'tags',
  'rfcs.form.faixa': 'From {min} to {max} characters.',
  'rfcs.form.falta.negrito': 'Something needs fixing.',
  'rfcs.form.falta.texto':
    ' The fields with a problem are marked below. Nothing you wrote ' +
    'was lost.',
  'rfcs.contador.min': '{n} / minimum {min}',

  'rfcs.erro.titulo.min': 'The title needs at least {min} characters.',
  'rfcs.erro.titulo.max': 'The title is over {max} characters.',
  'rfcs.erro.resumo.min': 'The summary needs at least {min} characters.',
  'rfcs.erro.resumo.max': 'The summary is over {max} characters.',
  'rfcs.erro.corpo.min': 'The body needs at least {min} characters.',
  'rfcs.erro.corpo.max': 'The body is over {max} characters.',
  'rfcs.erro.tags.max': 'At most {max} tags.',
  'rfcs.erro.tags.tamanho': 'Each tag needs to be {min} to {max} characters long.',
  'rfcs.erro.tags.semletras':
    'A tag is stored by its letters and numbers only, and nothing is ' +
    'left of {lista}. Rewrite it with at least {min} letters or numbers.',
  'rfcs.erro.tags.repetidas':
    'Accents and punctuation do not tell tags apart: {lista} are the ' +
    'same tag. Keep only one.',
  'rfcs.erro.tags.par': '{a} and {b}',

  /* ---------- write ---------- */
  'rfcs.nova.titulo': 'Write an idea · Idearium',
  'rfcs.nova.descricao':
    'Write a proposal. Saving creates a draft; publishing is a second ' +
    'step.',
  'rfcs.nova.h1.antes': 'Write an ',
  'rfcs.nova.h1.serif': 'idea',
  'rfcs.nova.h1.depois': '.',
  'rfcs.nova.sub':
    'You are starting a draft. Saving does not publish anything: the ' +
    'text stays with you until you decide to publish, in a deliberate ' +
    'second step.',
  'rfcs.nova.semlabs.falha':
    'Every idea belongs to a lab, and I could not load the list. ' +
    'Without it there is no way to start the draft. Try again in a moment.',
  'rfcs.nova.semlabs.titulo': 'No labs set up',
  'rfcs.nova.semlabs.texto':
    'Every idea belongs to a lab, and none exists yet. Talk to whoever ' +
    'maintains Idearium.',
  'rfcs.nova.semlabs.acao': 'back to the ideas',
  'rfcs.nova.erro.salvar.negrito': 'I could not save.',
  'rfcs.nova.erro.salvar': 'I could not save the draft right now.',
  'rfcs.nova.erro.corpo.min':
    'The body needs at least {min} characters. Describe the problem ' +
    'before the solution.',
  'rfcs.nova.erro.lab': 'Pick the lab where the idea lives.',

  'rfcs.nova.titulo.placeholder': 'Neighborhood cooperative library',
  'rfcs.nova.titulo.ajuda': ' Name the problem, not the solution.',
  'rfcs.nova.resumo.placeholder':
    'One sentence that lets someone who does not know the subject ' +
    'understand what is at stake.',
  'rfcs.nova.resumo.ajuda':
    ' This is what shows on the card in the list, so it is what an ' +
    'idea gets picked or ignored for.',
  'rfcs.nova.lab.rotulo': 'lab',
  'rfcs.nova.lab.escolha': 'pick a lab',
  'rfcs.nova.lab.ajuda':
    'A lab is a thematic cut, not a silo: people who move between other ' +
    'labs can still see the idea.',
  'rfcs.nova.corpo.placeholder':
    '## The problem\n\nWho feels it, where, how often.\n\n' +
    '## What I propose\n\n- first step\n- second step\n\n' +
    '## What I do not know yet\n\nBe honest here. It is what draws in ' +
    'people who know how to build.',
  'rfcs.nova.corpo.ajuda':
    'At least {min} characters, at most {max}. Markdown works: the panel ' +
    'beside this lists what is recognized, and "preview" shows the text ' +
    'the way the idea page will show it.',
  'rfcs.nova.tags.placeholder': 'mobility, public square, participatory budgeting',
  'rfcs.nova.tags.ajuda':
    'Optional. Separate with commas, up to {max} tags of {min} to {tam} ' +
    'characters each. Only letters and numbers count, so "café" and ' +
    '"cafe" are the same tag. You can change this later.',
  'rfcs.nova.salvar': 'save as draft',
  'rfcs.nova.descartar': 'discard',

  'rfcs.nova.previa.rotulo': 'what you are making',
  'rfcs.nova.previa.titulo': 'Your idea shows up here',
  'rfcs.nova.previa.resumo':
    'And its summary here — one sentence saying what is at stake.',
  'rfcs.nova.previa.lab': 'pick the lab',
  'rfcs.nova.medida.ok': '{atual}/{max}',
  'rfcs.nova.medida.fora':
    '{atual}/{max} · {sobra} more than fits; it cannot be saved like this',
  'rfcs.nova.previa.nota.antes': 'The chip stays on ',
  'rfcs.nova.previa.nota.negrito': 'draft',
  'rfcs.nova.previa.nota.depois':
    ' and the card has no number: it is only assigned on publication, ' +
    'and this screen does not publish. The cover is drawn from the ' +
    'idea\'s identity and number, so this picture is provisional — the ' +
    'lab is the only part of it you choose here.',

  'rfcs.nova.bloco.titulo': 'saving does not publish',
  'rfcs.nova.bloco.texto.antes': 'That is why the chip on the card is locked on ',
  'rfcs.nova.bloco.texto.negrito': 'draft',
  'rfcs.nova.bloco.texto.depois':
    ': what you save here shows up in no list, nobody but you can open ' +
    'it, and it has no number yet.',
  'rfcs.nova.bloco.aosalvar': 'on save',
  'rfcs.nova.bloco.aopublicar': 'on publish',
  'rfcs.nova.bloco.nota':
    'Publishing is a separate button, on the edit screen. That is where ' +
    'the idea gets its permanent number.',

  'rfcs.nova.md.titulo': 'recognized markdown',
  'rfcs.nova.md.secao': 'section',
  'rfcs.nova.md.subsecao': 'subsection',
  'rfcs.nova.md.negrito': 'bold',
  'rfcs.nova.md.italico': 'italic',
  'rfcs.nova.md.link': 'link',
  'rfcs.nova.md.lista': 'list',
  'rfcs.nova.md.numerada': 'numbered list',
  'rfcs.nova.md.citacao': 'quote',
  'rfcs.nova.md.codigo': 'code',
  'rfcs.nova.md.bloco': 'code block',
  'rfcs.nova.md.divisoria': 'divider',
  'rfcs.nova.md.tabela': 'table',
  'rfcs.nova.md.nota':
    'HTML shows up as text. Images are not allowed: they become links, ' +
    'because an outside image hands the reader\'s address to its owner.',
  'rfcs.nova.como.titulo': 'how to write here',
  'rfcs.nova.como.texto':
    'Start with the problem and the people who feel it. Say what you do ' +
    'not know how to do: that is what makes someone sign up. It does ' +
    'not need to be finished — it needs to be clear.',

  /* ---------- edit ---------- */
  'rfcs.editar.titulo': 'Edit · {titulo}',
  'rfcs.editar.titulo.inexistente': 'I could not find that idea · Idearium',
  'rfcs.editar.inexistente.antes': 'I could not find this ',
  'rfcs.editar.inexistente.serif': 'idea',
  'rfcs.editar.inexistente.depois': '.',
  'rfcs.editar.inexistente.falha.titulo': 'The server did not respond',
  'rfcs.editar.inexistente.titulo': 'Nothing to edit at this address',
  'rfcs.editar.inexistente.falha.texto':
    'I could not reach the API, so I do not even know whether this idea ' +
    'exists. Try again in a moment.',
  'rfcs.editar.inexistente.texto':
    'Either the address is wrong, or this idea is not yours to edit. A ' +
    'draft only exists for whoever wrote it.',
  'rfcs.editar.inexistente.acao': 'see the open ideas',

  'rfcs.editar.volta': '← see the idea',
  'rfcs.editar.h1': 'Editing ',
  'rfcs.editar.sub.rascunho':
    'Still a draft: only you can see it, and it has no number yet. The ' +
    'card beside this is what everyone else will see once you publish.',
  'rfcs.editar.sub.publicada':
    'Already published, with a permanent number. Every change to the ' +
    'body goes into the history, in plain view of readers.',
  'rfcs.editar.sub.arquivada':
    'It was archived before it was published, so it never got a number. ' +
    'The text is still here and still editable.',
  'rfcs.editar.criada.negrito': 'Draft created.',
  'rfcs.editar.criada.texto':
    ' It exists, but nobody except you can see it. Publish when you are ready.',
  'rfcs.editar.tagsfalhou.negrito': 'The tags were not saved.',
  'rfcs.editar.tagsfalhou.texto':
    ' The draft is intact; only the set of tags did not go through. Try ' +
    'again in the tags block.',

  'rfcs.editar.ok.tags': 'Tags replaced. The set is now exactly what is in the field.',
  'rfcs.editar.ok.tags.vazio': 'Tags removed: the idea now has none.',
  'rfcs.editar.ok.versao':
    'Saved. The body changed, so version {n} was created — the previous ' +
    'one stays in the history.',
  'rfcs.editar.ok.semversao':
    'Saved. The body did not change, so no new version was created.',
  'rfcs.editar.erro.publicar': 'I could not publish right now.',
  'rfcs.editar.erro.arquivar.rascunho':
    'A draft cannot be archived: it is already out of every list. Either ' +
    'publish it, or leave it where it is.',
  'rfcs.editar.erro.arquivar.confirmar': 'Tick the confirmation before archiving.',
  'rfcs.editar.erro.arquivar': 'I could not archive right now.',
  'rfcs.editar.erro.tags': 'I could not replace the tags right now.',
  'rfcs.editar.erro.salvar': 'I could not save right now.',

  'rfcs.editar.titulo.ajuda': ' The idea\'s address does not change when the title does.',
  'rfcs.editar.resumo.ajuda': ' This is what shows on the card in the list.',
  'rfcs.editar.corpo.ajuda.antes': 'At least {min} characters. Markdown works: sections (',
  'rfcs.editar.corpo.ajuda.depois':
    ', links, lists, quotes (',
  'rfcs.editar.corpo.ajuda.fim':
    '), code, tables. HTML shows up as text and images become links. ' +
    '"Preview" shows the result.',
  'rfcs.editar.corpo.ajuda.negrito': 'bold',
  'rfcs.editar.corpo.ajuda.italico': 'italic',
  'rfcs.editar.salvar': 'save',
  'rfcs.editar.vercomo': 'see how it looks',

  'rfcs.editar.previa.rotulo': 'the public card of this idea',
  'rfcs.editar.previa.agora': 'now',
  'rfcs.editar.previa.depois': 'after publishing',
  'rfcs.editar.previa.grupo': 'the card, before and after publishing',
  'rfcs.editar.previa.vazio.titulo': 'your idea shows up here',
  'rfcs.editar.previa.vazio.resumo':
    'and the summary, here — it is what makes someone choose to join',
  'rfcs.editar.previa.capa': 'the cover is born with the number',
  'rfcs.editar.previa.nota': 'Title and summary follow the form as you write.',
  'rfcs.editar.previa.nota.rascunho':
    ' The chip and the number only change when you publish — and the ' +
    'cover is drawn from the number, so it is born along with it.',
  'rfcs.editar.previa.nota.publicada':
    ' The number is already permanent and follows nothing.',
  'rfcs.editar.previa.nota.arquivada':
    ' It never got a number, so the card shows "draft" in its place.',

  'rfcs.editar.publicar.titulo': 'publish',
  'rfcs.editar.publicar.texto':
    'Publishing takes the idea out of the drawer: it enters the lists ' +
    'and opens up to discussion and to anyone who wants to build. This ' +
    'button is what changes the chip on the card above.',
  'rfcs.editar.publicar.fraco':
    'At that moment the database assigns the number, in sequence. Not ' +
    'even this screen knows which one it will be — that is why the slot ' +
    'shows blank. Once assigned it never changes, and publishing cannot ' +
    'be undone.',
  'rfcs.editar.publicar.acao': 'publish',
  'rfcs.editar.publicada.titulo': 'already published',
  'rfcs.editar.publicada.numero': 'number',
  'rfcs.editar.publicada.quando': 'published',
  'rfcs.editar.publicada.nota':
    'The number is permanent. It identifies the idea even after the ' +
    'title changes.',
  'rfcs.editar.nunca.titulo': 'never published',
  'rfcs.editar.nunca.texto':
    'It was archived while it was still a draft: it got no number and ' +
    'never went through any list.',
  'rfcs.editar.nunca.nenhum': 'none',
  'rfcs.editar.nunca.quando': 'archived',
  'rfcs.editar.nunca.nota':
    'Publishing needs a draft, and it stopped being one when it was ' +
    'archived. Today there is no way back.',

  'rfcs.editar.errata.titulo': 'the erratum being born',
  'rfcs.editar.errata.versoes': 'versions today',
  'rfcs.editar.errata.ultima': 'last change',
  'rfcs.editar.errata.igual':
    'The body is the same as what was already saved. Saving now creates ' +
    'no new version, and nothing shows up in the history.',
  'rfcs.editar.errata.acrescido.antes':
    'The body changed, but no passage was replaced: what you did was ' +
    'add or cut. The ',
  'rfcs.editar.errata.acrescido.depois':
    ' is born the same way, and the previous text stays in the history.',
  'rfcs.editar.errata.gatilho': 'erratum · the passage you replaced',
  'rfcs.editar.errata.data': 'will be born as v0.{n} when you save',
  'rfcs.editar.errata.fraco':
    'This is what an erratum is: the old passage stays readable, struck ' +
    'through, with the correction beside it and dated. Editing does not ' +
    'overwrite — nothing is lost. Only the body creates a version; title ' +
    'and summary change silently.',

  'rfcs.editar.tags.titulo': 'tags',
  'rfcs.editar.tags.ilegiveis.negrito': 'I could not read the tags of this idea.',
  'rfcs.editar.tags.ilegiveis.texto':
    ' The form is down on purpose: an empty field here means delete ' +
    'all, and I do not know what there is to delete. Reload in a moment.',
  'rfcs.editar.tags.rotulo': 'the whole set',
  'rfcs.editar.tags.placeholder': 'mobility, public square',
  'rfcs.editar.tags.ajuda.antes': 'Separate with commas, up to {max} tags. What you send',
  'rfcs.editar.tags.ajuda.negrito': ' replaces all the tags at once',
  'rfcs.editar.tags.ajuda.depois':
    ': what leaves the field leaves the idea. An empty field removes ' +
    'all. Only letters and numbers count, so "café" and "cafe" are the ' +
    'same tag.',
  'rfcs.editar.tags.acao': 'replace tags',

  'rfcs.editar.arquivada.titulo': 'archived',
  'rfcs.editar.arquivada.texto':
    'It was archived {quando}. Nothing was deleted: the text is still ' +
    'readable at its address, with the discussion, the sign-ups and ' +
    'every version. Taking it out of the archive does not exist yet — ' +
    'no screen and no route return the idea to its earlier state.',
  'rfcs.editar.arquivar.titulo': 'archive',
  'rfcs.editar.arquivar.antes': 'Archiving says the idea went cold, and nothing more. ',
  'rfcs.editar.arquivar.negrito': 'It does not delete.',
  'rfcs.editar.arquivar.depois':
    ' It leaves the lists, but stays readable at its address, with the ' +
    'text, the discussion, the sign-ups and every version still in place.',
  'rfcs.editar.arquivar.fraco':
    'Coming back from the archive is planned in the product design, but ' +
    'no screen or route unarchives yet. Today, once archived, it stays ' +
    'archived.',
  'rfcs.editar.arquivar.confirmo':
    'I understand the idea leaves the lists and that today there is no ' +
    'way to unarchive it',
  'rfcs.editar.arquivar.acao': 'archive',

  /* ---------- versions ---------- */
  'rfcs.versoes.titulo': 'Versions · {titulo}',
  'rfcs.versoes.titulo.padrao': 'Versions · Idearium',
  'rfcs.versoes.falha.antes': 'I could not open this ',
  'rfcs.versoes.falha.apagado': 'idea',
  'rfcs.versoes.falha.depois': '.',
  'rfcs.versoes.falha.titulo': 'The server did not respond',
  'rfcs.versoes.falha.texto':
    'I could not reach the API. The idea and its versions are still ' +
    'where they were; try again in a moment.',
  'rfcs.versoes.falha.acao': 'see the open ideas',
  'rfcs.versoes.volta': '← back to the idea',
  'rfcs.versoes.h1': 'Versions of ',
  'rfcs.versoes.sub':
    'Nothing is deleted: every edit to the body becomes a new version, ' +
    'and you can compare any two. Only the body is versioned; the title ' +
    'and summary always show the current state.',
  'rfcs.versoes.aviso.negrito': 'I could not load the versions.',
  'rfcs.versoes.aviso.texto': ' The API did not respond. The idea is intact; reload in a moment.',
  'rfcs.versoes.primeira.titulo': 'This idea is still on its first version',
  'rfcs.versoes.primeira.texto':
    'Once the body is edited, the previous version is kept here and you ' +
    'can see what changed.',
  'rfcs.versoes.primeira.acao': 'back to the idea',
  'rfcs.versoes.unica.texto':
    'Once the body is edited, the previous version is kept here and you ' +
    'can see what changed. For now, only the original text exists.',
  'rfcs.versoes.unica.acao': 'read the text of v1',
  'rfcs.versoes.invalida.negrito': 'Version not found.',
  'rfcs.versoes.invalida.v':
    'There is no version “{v}” of this idea. Versions run from v1 to v{max}.',
  'rfcs.versoes.invalida.par':
    'I could not compare those versions. Pick two between v1 and v{max}.',
  'rfcs.versoes.comparar': 'compare',
  'rfcs.versoes.de': 'from (before)',
  'rfcs.versoes.para': 'to (after)',
  'rfcs.versoes.texto.titulo': 'text of v{n} · {quando}',
  'rfcs.versoes.texto.nota': 'This is the markdown as it was written, with no formatting applied.',
  'rfcs.versoes.texto.mudou': 'See what changed compared to v{n}',
  'rfcs.versoes.diff.titulo': 'what changed · v{de} → v{para}',
  'rfcs.versoes.diff.mesma':
    'You picked the same version on both sides, so there is nothing to compare.',
  'rfcs.versoes.diff.identico': 'These two versions have an identical body.',
  'rfcs.versoes.diff.tiradas.um': '{n} line removed',
  'rfcs.versoes.diff.tiradas.varios': '{n} lines removed',
  'rfcs.versoes.diff.acrescentadas.um': '{n} line added',
  'rfcs.versoes.diff.acrescentadas.varios': '{n} lines added',
  'rfcs.versoes.diff.rotulo': 'Difference between v{de} and v{para}',
  'rfcs.versoes.diff.iguais.um': '{n} unchanged line',
  'rfcs.versoes.diff.iguais.varios': '{n} unchanged lines',
  'rfcs.versoes.diff.removido': 'removed: ',
  'rfcs.versoes.diff.acrescentado': 'added: ',
  'rfcs.versoes.lado.titulo': 'all versions',
  'rfcs.versoes.atual': 'current',
  'rfcs.versoes.por': 'by @{nome}',
  'rfcs.versoes.ler': 'read text',
  'rfcs.versoes.omudou': 'what changed',

  /* ---------- body editor (EditorCorpo.astro) ---------- */
  'rfcs.editor.modo': 'body mode',
  'rfcs.editor.escrever': 'write',
  'rfcs.editor.ver': 'preview',
  'rfcs.editor.carregando': 'building the preview…',
  'rfcs.editor.vazio':
    'Nothing written yet. Go back to writing and the text shows up ' +
    'here as it will look on the idea page.',
  'rfcs.editor.rede':
    'I could not reach the server. Your text is still in the field; go ' +
    'back to writing and try again.',
  'rfcs.editor.padrao':
    'I could not build the preview right now. Your text is still in the field.',

  /* ---------- endpoint /api/previa ---------- */
  'rfcs.previa.sessao': 'Your session expired. Sign in again to see the preview.',
  'rfcs.previa.json': 'The preview only accepts JSON.',
  'rfcs.previa.grande': 'Text too large for the preview.',
  'rfcs.previa.pedido': 'I did not understand the preview request.',
  'rfcs.previa.caracteres': 'The body is over {max} characters.',
};

export default { 'pt-BR': ptBR, en };
