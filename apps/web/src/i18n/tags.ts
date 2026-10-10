/* tags — /tags e /tags/:slug. */

const ptBR = {
  'tags.titulo': 'Idearium · Tags',
  'tags.descricao': 'Os recortes que atravessam os laboratórios, ordenados por uso.',
  'tags.h1.antes': 'Recortes que atravessam os labs, ',
  'tags.h1.apagado': 'escolhidos por quem escreve.',
  'tags.sub':
    'Uma tag junta ideias de laboratórios diferentes que tratam da mesma ' +
    'coisa. Quem escreve a ideia escolhe as dela.',
  'tags.aviso.resto':
    'A lista abaixo pode estar incompleta ou vazia por isso, não por falta de tags.',
  'tags.contagem.um': '{n} tag',
  'tags.contagem.varios': '{n} tags',
  'tags.contagem.mostrando': ' · mostrando as {n} mais usadas',
  'tags.origem':
    'Ninguém escolheu esta lista. Cada palavra entrou junto com uma ' +
    'ideia, escrita por quem a propôs.',
  'tags.escala':
    'Da mais usada para a menos usada. O tamanho mede quantas ideias ' +
    'usam a palavra, contando também rascunho e arquivada — que não ' +
    'abrem na página da tag.',
  'tags.escala.orfas': ' As de contorno, sem fundo, não são usadas por ideia nenhuma.',
  'tags.queda.texto': 'Assim que a API voltar, as tags aparecem aqui.',
  'tags.vazio.titulo': 'Nenhuma tag ainda',
  'tags.vazio.texto':
    'Tag nasce junto com a ideia. Quando alguém marcar a primeira, ela fica listada aqui.',
  'tags.acao.ideias': 'ver as ideias',

  'tags.slug.titulo': 'Idearium · #{nome}',
  'tags.slug.descricao': 'Ideias marcadas com {nome}.',
  'tags.slug.volta': '← todas as tags',
  'tags.slug.sub':
    'Ideias de qualquer laboratório marcadas com esta tag por quem as escreveu.',
  'tags.slug.h1.apagado': 'em qualquer laboratório.',
  'tags.slug.atravessa': 'atravessa',
  'tags.slug.atravessa.recorte': ' · nas {n} mais recentes',
  'tags.slug.umlab': 'um laboratório só, por enquanto.',
  'tags.slug.aviso.resto':
    'A lista abaixo pode estar vazia por isso, não por falta de ideias.',
  'tags.slug.contagem.um': '{n} ideia pública',
  'tags.slug.contagem.varios': '{n} ideias públicas',
  'tags.slug.contagem.mostrando': ' · mostrando as {n} mais recentes',
  'tags.slug.fora.um': ' · e mais 1 que não está pública: rascunho ou arquivada',
  'tags.slug.fora.varios': ' · e mais {n} que não estão públicas: rascunhos ou arquivadas',
  'tags.slug.procurar': 'procurar esta palavra no texto das ideias',
  'tags.slug.queda.texto': 'Assim que a API voltar, as ideias desta tag aparecem aqui.',
  'tags.slug.inexistente.titulo': 'Não existe a tag "{slug}"',
  'tags.slug.inexistente.texto':
    'Ou ela nunca foi usada, ou o endereço veio com um erro de digitação.',
  'tags.slug.inexistente.acao': 'ver as tags que existem',
  'tags.slug.vazia.titulo': 'Nenhuma ideia pública com {nome}',
  'tags.slug.vazia.texto':
    'A tag existe, mas as ideias que a usavam foram arquivadas ou ainda são rascunho.',
  'tags.slug.vazia.acao': 'ver outras tags',
};

const en: Record<keyof typeof ptBR, string> = {
  'tags.titulo': 'Idearium · Tags',
  'tags.descricao': 'The cuts that run across the labs, ordered by use.',
  'tags.h1.antes': 'Cuts that run across the labs, ',
  'tags.h1.apagado': 'chosen by whoever writes.',
  'tags.sub':
    'A tag brings together ideas from different labs that deal with the ' +
    'same thing. Whoever writes the idea chooses its tags.',
  'tags.aviso.resto':
    'The list below may be incomplete or empty because of that, not because there are no tags.',
  'tags.contagem.um': '{n} tag',
  'tags.contagem.varios': '{n} tags',
  'tags.contagem.mostrando': ' · showing the {n} most used',
  'tags.origem':
    'Nobody chose this list. Each word came in with an idea, written by ' +
    'whoever proposed it.',
  'tags.escala':
    'From most used to least used. The size measures how many ideas use ' +
    'the word, counting drafts and archived ideas too — which do not ' +
    'open on the tag page.',
  'tags.escala.orfas': ' Tags with an outline and no fill are not used by any idea.',
  'tags.queda.texto': 'As soon as the API is back, the tags show up here.',
  'tags.vazio.titulo': 'No tags yet',
  'tags.vazio.texto':
    'A tag is born with an idea. When someone adds the first one, it is listed here.',
  'tags.acao.ideias': 'see the ideas',

  'tags.slug.titulo': 'Idearium · #{nome}',
  'tags.slug.descricao': 'Ideas tagged {nome}.',
  'tags.slug.volta': '← all tags',
  'tags.slug.sub':
    'Ideas from any lab tagged with this tag by whoever wrote them.',
  'tags.slug.h1.apagado': 'in any lab.',
  'tags.slug.atravessa': 'runs across',
  'tags.slug.atravessa.recorte': ' · in the {n} most recent',
  'tags.slug.umlab': 'just one lab, for now.',
  'tags.slug.aviso.resto':
    'The list below may be empty because of that, not because there are no ideas.',
  'tags.slug.contagem.um': '{n} public idea',
  'tags.slug.contagem.varios': '{n} public ideas',
  'tags.slug.contagem.mostrando': ' · showing the {n} most recent',
  'tags.slug.fora.um': ' · and 1 more that is not public: a draft or archived',
  'tags.slug.fora.varios': ' · and {n} more that are not public: drafts or archived',
  'tags.slug.procurar': 'search for this word in the text of the ideas',
  'tags.slug.queda.texto': 'As soon as the API is back, the ideas with this tag show up here.',
  'tags.slug.inexistente.titulo': 'The tag "{slug}" does not exist',
  'tags.slug.inexistente.texto':
    'Either it was never used, or the address has a typo.',
  'tags.slug.inexistente.acao': 'see the tags that exist',
  'tags.slug.vazia.titulo': 'No public ideas with {nome}',
  'tags.slug.vazia.texto':
    'The tag exists, but the ideas that used it were archived or are still drafts.',
  'tags.slug.vazia.acao': 'see other tags',
};

export default { 'pt-BR': ptBR, en };
