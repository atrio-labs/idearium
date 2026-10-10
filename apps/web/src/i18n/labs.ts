/* labs — /labs, /labs/:slug e a contagem de ideias por lab, que o
   átrio também mostra.

   Os nomes em inglês ficam aqui, pelo slug, porque a API só guarda o
   nome em português ("Lab. Cidades") e o catálogo é fechado e semeado
   (apps/api/prisma/seed.ts). Lab novo sem chave aqui aparece com o
   nome da API, em português, em vez de quebrar. */

const ptBR = {
  'labs.titulo': 'Idearium · Laboratórios',
  'labs.h1.antes': 'Seis recortes, ',
  'labs.h1.apagado': 'nenhum silo.',
  'labs.sub':
    'Um laboratório organiza ideias por domínio de problema, não por ' +
    'tecnologia. Uma ideia pertence a um laboratório, mas qualquer pessoa ' +
    'transita entre todos.',
  'labs.aviso': 'Os laboratórios existem, só não consegui carregá-los agora.',
  'labs.vazio.falha.texto': 'Tente recarregar em instantes.',
  'labs.vazio.titulo': 'Nenhum laboratório configurado',

  'labs.qtd.um': '{n} ideia',
  'labs.qtd.varios': '{n} ideias',

  'labs.volta': '← todos os laboratórios',
  'labs.descricao.padrao':
    'Problemas deste domínio, propostos por quem convive com eles e ' +
    'abertos a quem sabe construir.',
  'labs.meta.descricao': 'Ideias do laboratório de {nome}.',
  'labs.lab.h1.apagado': 'Ideias de quem convive com o problema.',
  'labs.materia.alt': 'Imagem abstrata do laboratório de {nome}',
  'labs.contagem.um': '{n} ideia neste laboratório',
  'labs.contagem.varios': '{n} ideias neste laboratório',
  'labs.lab.vazio.titulo': 'Nenhuma ideia em {nome} ainda',
  'labs.lab.vazio.texto':
    'Este laboratório está esperando a primeira proposta. Não precisa ' +
    'saber construir para escrever uma.',
  'labs.inexistente.titulo': 'Este laboratório não existe',
  'labs.inexistente.texto': 'O endereço não corresponde a nenhum dos laboratórios.',
  'labs.inexistente.acao': 'ver os laboratórios',

  'labs.nome.educacao': 'Educação',
  'labs.nome.cidades': 'Cidades',
  'labs.nome.saude': 'Saúde',
  'labs.nome.cultura': 'Cultura',
  'labs.nome.tec-civica': 'Tec. Cívica',
  'labs.nome.econ-solidaria': 'Econ. Solidária',
};

const en: Record<keyof typeof ptBR, string> = {
  'labs.titulo': 'Idearium · Labs',
  'labs.h1.antes': 'Six domains, ',
  'labs.h1.apagado': 'no silos.',
  'labs.sub':
    'A lab groups ideas by problem domain, not by technology. An idea ' +
    'belongs to one lab, but anyone can move between all of them.',
  'labs.aviso': 'The labs exist, I just could not load them right now.',
  'labs.vazio.falha.texto': 'Try reloading in a moment.',
  'labs.vazio.titulo': 'No labs set up',

  'labs.qtd.um': '{n} idea',
  'labs.qtd.varios': '{n} ideas',

  'labs.volta': '← all labs',
  'labs.descricao.padrao':
    'Problems in this domain, proposed by people who live with them and ' +
    'open to anyone who knows how to build.',
  'labs.meta.descricao': 'Ideas from the {nome} lab.',
  'labs.lab.h1.apagado': 'Ideas from people who live with the problem.',
  'labs.materia.alt': 'Abstract image for the {nome} lab',
  'labs.contagem.um': '{n} idea in this lab',
  'labs.contagem.varios': '{n} ideas in this lab',
  'labs.lab.vazio.titulo': 'No ideas in {nome} yet',
  'labs.lab.vazio.texto':
    'This lab is waiting for its first proposal. You do not need to know ' +
    'how to build to write one.',
  'labs.inexistente.titulo': 'This lab does not exist',
  'labs.inexistente.texto': 'The address does not match any of the labs.',
  'labs.inexistente.acao': 'see the labs',

  'labs.nome.educacao': 'Education',
  'labs.nome.cidades': 'Cities',
  'labs.nome.saude': 'Health',
  'labs.nome.cultura': 'Culture',
  'labs.nome.tec-civica': 'Civic Tech',
  'labs.nome.econ-solidaria': 'Solidarity Economy',
};

export default { 'pt-BR': ptBR, en };
