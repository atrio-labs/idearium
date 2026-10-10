/* ciclo — fechar o ciclo da ideia (C1, atrás de PUBLIC_CICLO):
   "virou projeto", trazer de volta, atualizações de progresso e a
   nota de mudança ao editar. Sem número em destaque e sem tom de
   conquista (VISAO §9): a tela diz o que o ato faz. */

const ptBR = {
  'ciclo.indisponivel': 'A API ainda não oferece esta ação.',

  /* ---- virou projeto: no editar ---- */
  'ciclo.projeto.titulo': 'Virou projeto',
  'ciclo.projeto.texto':
    'Quando a ideia já tem algo no ar, marque como publicada e aponte para onde ele está. A página da ideia passa a mostrar o link.',
  'ciclo.projeto.url.rotulo': 'Link do projeto',
  'ciclo.projeto.url.ajuda': 'Repositório ou site, começando por https://.',
  'ciclo.projeto.resumo.rotulo': 'O que ficou pronto',
  'ciclo.projeto.resumo.ajuda': 'Uma frase, de {min} a {max} caracteres.',
  'ciclo.projeto.acao': 'Marcar como publicada',
  'ciclo.projeto.erro.url': 'Use um endereço completo, começando por http:// ou https://.',
  'ciclo.projeto.erro.resumo': 'Escreva de {min} a {max} caracteres sobre o que ficou pronto.',
  'ciclo.projeto.erro.estado': 'Só uma ideia em discussão ou em construção pode virar projeto.',
  'ciclo.projeto.erro.permissao': 'Só quem escreveu a ideia pode marcá-la como publicada.',
  'ciclo.projeto.erro': 'Não consegui marcar agora. Tente de novo em instantes.',
  'ciclo.projeto.feito.titulo': 'Esta ideia virou projeto',

  /* ---- virou projeto: na página da ideia ---- */
  'ciclo.virou.rotulo': 'Virou projeto',
  'ciclo.virou.abrir': 'Abrir o projeto',
  'ciclo.virou.externo': 'abre em outra aba',

  /* ---- trazer de volta ---- */
  'ciclo.volta.titulo': 'Trazer de volta',
  'ciclo.volta.texto':
    'Arquivar não apaga nada. Trazendo a ideia de volta, ela reabre para comentários e inscrições, em discussão ou em construção, conforme quem está inscrito.',
  'ciclo.volta.acao': 'Trazer de volta',
  'ciclo.volta.erro': 'Não consegui trazer a ideia de volta agora. Tente de novo em instantes.',
  'ciclo.volta.erro.estado': 'Esta ideia não está arquivada.',

  /* ---- atualizações de progresso ---- */
  'ciclo.atualizacoes.titulo': 'Atualizações',
  'ciclo.atualizacoes.apoio':
    'O que quem constrói foi fazendo, em ordem. A discussão fica separada, logo abaixo.',
  'ciclo.atualizacoes.vazio': 'Ainda não há atualizações.',
  'ciclo.atualizacoes.vazio.pode': 'Ainda não há atualizações. Quando houver o que contar, conte aqui.',
  'ciclo.atualizacoes.indisponivel': 'A API ainda não oferece atualizações de progresso.',
  'ciclo.atualizacoes.erro': 'Não consegui carregar as atualizações agora. A discussão abaixo continua disponível.',
  'ciclo.atualizacoes.rotulo': 'Nova atualização',
  'ciclo.atualizacoes.ajuda': 'Texto curto, em markdown. De {min} a {max} caracteres.',
  'ciclo.atualizacoes.acao': 'Publicar atualização',
  'ciclo.atualizacoes.erro.tamanho': 'A atualização precisa ter de {min} a {max} caracteres.',
  'ciclo.atualizacoes.erro.permissao': 'Só quem está inscrito para construir, ou escreveu a ideia, publica atualizações.',
  'ciclo.atualizacoes.erro.estado': 'Atualizações só cabem em ideias em construção.',
  'ciclo.atualizacoes.erro.publicar': 'Não consegui publicar agora. Seu texto continua no campo.',
  'ciclo.atualizacoes.autor': 'por @{nome}',

  /* ---- nota de mudança ---- */
  'ciclo.nota.rotulo': 'O que mudou e por quê (opcional)',
  'ciclo.nota.ajuda': 'Uma frase que fica junto da versão, no histórico. Até {max} caracteres.',
  'ciclo.nota.erro': 'A nota pode ter até {max} caracteres.',
  'ciclo.nota.naosalva': 'A API ainda não guarda a nota de mudança; o texto foi salvo sem ela.',
  'ciclo.nota.versao': 'Nota: {nota}',
};

const en: Record<keyof typeof ptBR, string> = {
  'ciclo.indisponivel': 'The API does not offer this action yet.',

  'ciclo.projeto.titulo': 'Became a project',
  'ciclo.projeto.texto':
    'When the idea has something live, mark it as published and point to where it is. The idea page then shows the link.',
  'ciclo.projeto.url.rotulo': 'Project link',
  'ciclo.projeto.url.ajuda': 'Repository or site, starting with https://.',
  'ciclo.projeto.resumo.rotulo': 'What is ready',
  'ciclo.projeto.resumo.ajuda': 'One sentence, {min} to {max} characters.',
  'ciclo.projeto.acao': 'Mark as published',
  'ciclo.projeto.erro.url': 'Use a full address, starting with http:// or https://.',
  'ciclo.projeto.erro.resumo': 'Write {min} to {max} characters about what is ready.',
  'ciclo.projeto.erro.estado': 'Only an idea in discussion or in construction can become a project.',
  'ciclo.projeto.erro.permissao': 'Only the author of the idea can mark it as published.',
  'ciclo.projeto.erro': 'I could not mark it right now. Try again in a moment.',
  'ciclo.projeto.feito.titulo': 'This idea became a project',

  'ciclo.virou.rotulo': 'Became a project',
  'ciclo.virou.abrir': 'Open the project',
  'ciclo.virou.externo': 'opens in another tab',

  'ciclo.volta.titulo': 'Bring it back',
  'ciclo.volta.texto':
    'Archiving deletes nothing. Bringing the idea back reopens it for comments and sign-ups, in discussion or in construction, depending on who is signed up.',
  'ciclo.volta.acao': 'Bring it back',
  'ciclo.volta.erro': 'I could not bring the idea back right now. Try again in a moment.',
  'ciclo.volta.erro.estado': 'This idea is not archived.',

  'ciclo.atualizacoes.titulo': 'Updates',
  'ciclo.atualizacoes.apoio':
    'What the builders have been doing, in order. The discussion is kept apart, just below.',
  'ciclo.atualizacoes.vazio': 'No updates yet.',
  'ciclo.atualizacoes.vazio.pode': 'No updates yet. When there is something to tell, tell it here.',
  'ciclo.atualizacoes.indisponivel': 'The API does not offer progress updates yet.',
  'ciclo.atualizacoes.erro': 'I could not load the updates right now. The discussion below is still available.',
  'ciclo.atualizacoes.rotulo': 'New update',
  'ciclo.atualizacoes.ajuda': 'Short text, in markdown. {min} to {max} characters.',
  'ciclo.atualizacoes.acao': 'Post update',
  'ciclo.atualizacoes.erro.tamanho': 'The update needs {min} to {max} characters.',
  'ciclo.atualizacoes.erro.permissao': 'Only people signed up to build, or the author, can post updates.',
  'ciclo.atualizacoes.erro.estado': 'Updates only fit ideas that are in construction.',
  'ciclo.atualizacoes.erro.publicar': 'I could not post right now. Your text is still in the field.',
  'ciclo.atualizacoes.autor': 'by @{nome}',

  'ciclo.nota.rotulo': 'What changed and why (optional)',
  'ciclo.nota.ajuda': 'One sentence that stays with the version, in the history. Up to {max} characters.',
  'ciclo.nota.erro': 'The note can have up to {max} characters.',
  'ciclo.nota.naosalva': 'The API does not store the change note yet; the text was saved without it.',
  'ciclo.nota.versao': 'Note: {nota}',
};

export default { 'pt-BR': ptBR, en };
