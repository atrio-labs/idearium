/* ================================================================
   leitura-busca.ts — como a busca lê a consulta
   ================================================================
   Mora fora da página porque o mesmo texto é montado nos dois lados:
   no servidor, para quem chega com `?q=` no link ou está sem
   JavaScript; no navegador, a cada tecla. Duas cópias divergiriam com
   o tempo, e uma leitura que diverge da busca mente.

   Só afirma o que dá para afirmar sem reimplementar o Postgres. A
   quebra em palavras e a diferença de acento são exatas: a API usa
   `plainto_tsquery`, que separa nas não-palavras e exige todas juntas,
   e o índice não passa por `unaccent`. O radical fica no texto de
   apoio, em linguagem qualitativa — repetir o Snowball aqui criaria um
   segundo comportamento parecido, que é pior que não ter nenhum.

   A palavra comum é a exceção: ela não precisa do Snowball, é uma
   lista fixa, e a tela não pode exibir como exigência algo que o
   índice joga fora antes de montar o tsquery.
   ================================================================ */

import type { Chave } from './i18n';

/* O texto da leitura vem do dicionário `busca` (src/i18n/busca.ts), no
   idioma da INTERFACE. Isso é independente do `Idioma` abaixo, que é o
   dicionário da BUSCA: quem lê em inglês pode consultar o índice em
   português. O módulo roda no servidor e no navegador, e o navegador
   não carrega os dicionários inteiros: a página resolve só as chaves
   abaixo e as entrega num data-attribute, e `tradutorDe` as lê. */
export const CHAVES_LEITURA = [
  'busca.leitura.junta', 'busca.leitura.nada', 'busca.leitura.fantasma',
  'busca.leitura.exige.nenhuma', 'busca.leitura.exige.descartou',
  'busca.leitura.exige.uma', 'busca.leitura.exige.duas', 'busca.leitura.exige.varias',
  'busca.leitura.acento.acentuada', 'busca.leitura.acento.acentuavel',
  'busca.leitura.acento.exemplo', 'busca.leitura.radical',
] as const satisfies readonly Chave[];

export type ChaveLeitura = (typeof CHAVES_LEITURA)[number];
export type Tradutor = (chave: ChaveLeitura) => string;

export const tradutorDe = (textos: Record<string, string>): Tradutor =>
  (chave) => textos[chave] ?? chave;

/** Parte "texto {palavra} texto" em trechos; o que está entre chaves
 *  vira a palavra destacada, vinda de `palavras`. Marcador sem palavra
 *  fica como está, pra aparecer na revisão. */
function emTrechos(texto: string, palavras: Record<string, string>): Trecho[] {
  return texto
    .split(/(\{\w+\})/)
    .filter(Boolean)
    .map((parte) => {
      const nome = /^\{(\w+)\}$/.exec(parte)?.[1];
      return nome && nome in palavras ? { t: palavras[nome], forte: true } : { t: parte };
    });
}

/** Os dois dicionários que a API escolhe pelo `locale` da consulta
 *  (`portuguese` ou `english`, search.service.ts). Tudo que muda entre
 *  eles passa por aqui, para a coluna nunca descrever um índice
 *  enquanto a busca roda no outro. */
export type Idioma = 'pt-BR' | 'en';

/** Um pedaço de frase. `forte` é a palavra da pessoa, que a tela
 *  destaca — o resto é ligação. Devolver a frase partida evita montar
 *  o mesmo texto duas vezes, uma no servidor e outra no navegador. */
export interface Trecho {
  t: string;
  forte?: boolean;
}

export const semAcento = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** As palavras que a consulta vira. `plainto_tsquery` quebra em tudo
 *  que não é letra ou número. */
export const palavrasDaConsulta = (termo: string) =>
  termo.split(/[^\p{L}\p{N}]+/u).filter(Boolean);

/* As palavras que o dicionário descarta antes de montar o tsquery. A
   lista do Snowball tem centenas de entradas; aqui ficam as que
   aparecem numa consulta curta, que é o caso desta tela. Errar para
   menos deixa um chip a mais; errar para mais apagaria uma palavra que
   a busca de fato exige, então a lista é conservadora.

   A comparação é por forma exata, sem tirar acento de propósito:
   `não` é descartada e `nao` não é, e essa diferença é o mesmo fato
   que a nota de acento conta logo abaixo. */
const COMUNS: Record<Idioma, ReadonlySet<string>> = {
  'pt-BR': new Set([
    'a', 'à', 'às', 'ao', 'aos', 'as', 'até', 'com', 'como', 'da', 'das',
    'de', 'do', 'dos', 'e', 'em', 'entre', 'era', 'essa', 'esse', 'está',
    'este', 'eu', 'foi', 'há', 'isso', 'já', 'mais', 'mas', 'me', 'muito',
    'na', 'nas', 'no', 'nos', 'não', 'num', 'numa', 'o', 'os', 'ou',
    'para', 'pela', 'pelas', 'pelo', 'pelos', 'por', 'quando', 'que',
    'quem', 'se', 'sem', 'ser', 'seu', 'seus', 'só', 'sua', 'suas',
    'também', 'tem', 'ter', 'um', 'uma', 'é',
  ]),
  en: new Set([
    'a', 'about', 'after', 'all', 'an', 'and', 'any', 'are', 'as', 'at',
    'be', 'been', 'before', 'between', 'both', 'but', 'by', 'can', 'do',
    'does', 'each', 'for', 'from', 'had', 'has', 'have', 'how', 'if',
    'in', 'into', 'is', 'it', 'its', 'more', 'most', 'no', 'not', 'of',
    'on', 'only', 'or', 'other', 'out', 'over', 'own', 'same', 'so',
    'some', 'such', 'than', 'that', 'the', 'their', 'them', 'then',
    'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
    'under', 'until', 'up', 'very', 'was', 'were', 'what', 'when',
    'where', 'which', 'while', 'who', 'why', 'will', 'with',
  ]),
};

/** A consulta partida como o índice a recebe: o que vira exigência e
 *  o que o dicionário joga fora. */
export interface Consulta {
  exigidas: string[];
  descartadas: string[];
}

export function lerConsulta(termo: string, idioma: Idioma): Consulta {
  const comuns = COMUNS[idioma];
  const exigidas: string[] = [];
  const descartadas: string[] = [];

  for (const palavra of palavrasDaConsulta(termo)) {
    const p = palavra.toLowerCase();
    if (comuns.has(p)) descartadas.push(p);
    else exigidas.push(p);
  }

  return { exigidas, descartadas };
}

/** A frase que conta o que a consulta exige. Só as palavras que
 *  sobraram contam: dizer "todas juntas" sobre uma lista que inclui
 *  palavra descartada seria descrever outra busca. */
export function fraseDaExigencia({ exigidas, descartadas }: Consulta, tx: Tradutor): string {
  if (exigidas.length === 0) {
    return tx(descartadas.length === 0
      ? 'busca.leitura.exige.nenhuma'
      : 'busca.leitura.exige.descartou');
  }
  if (exigidas.length === 1) return tx('busca.leitura.exige.uma');
  if (exigidas.length === 2) return tx('busca.leitura.exige.duas');
  return tx('busca.leitura.exige.varias');
}

/* Um par por dicionário: o radical e o acento. A coluna afirma estar
   descrevendo ESTA consulta, então o exemplo tem de ser do dicionário
   que a busca vai usar — em inglês, `alagamentos` não ilustra nada. */
const EXEMPLOS: Record<Idioma, { radical: [string, string]; comuns: [string, string]; acento: [string, string] }> = {
  'pt-BR': {
    radical: ['alagamento', 'alagamentos'],
    comuns: ['de', 'para'],
    acento: ['remedio', 'remédio'],
  },
  en: {
    radical: ['flooding', 'floods'],
    comuns: ['the', 'for'],
    acento: ['cafe', 'café'],
  },
};

/** A frase sobre acento, sempre com a palavra que foi digitada. Aviso
 *  genérico obriga a pessoa a adivinhar de qual palavra ele fala.
 *  Só olha as exigidas: falar de uma palavra que o dicionário
 *  descartou seria dar conselho sobre algo que não muda o resultado. */
export function notaDeAcento(termo: string, idioma: Idioma, tx: Tradutor): Trecho[] {
  const { exigidas } = lerConsulta(termo, idioma);

  const acentuada = exigidas.find((p) => semAcento(p) !== p);
  if (acentuada) {
    return emTrechos(tx('busca.leitura.acento.acentuada'), {
      palavra: acentuada,
      sem: semAcento(acentuada),
    });
  }

  /* Aponta a primeira palavra que costuma levar acento, em vez de
     repetir o exemplo do manual. Só em português: em inglês o palpite
     erraria quase sempre, e um palpite errado gasta a confiança da
     coluna inteira. */
  const acentuavel =
    idioma === 'pt-BR'
      ? exigidas.find((p) => p.length >= 3 && /[aeiouc]/.test(p))
      : undefined;
  if (acentuavel) {
    return emTrechos(tx('busca.leitura.acento.acentuavel'), { palavra: acentuavel });
  }

  const [sem, com] = EXEMPLOS[idioma].acento;
  return emTrechos(tx('busca.leitura.acento.exemplo'), { sem, com });
}

/** O que o dicionário faz com o que sobrou: compara radicais e ignora
 *  palavra comum. Os dois exemplos vêm do dicionário em uso. */
export function notaDoRadical(idioma: Idioma, tx: Tradutor): Trecho[] {
  const { radical, comuns } = EXEMPLOS[idioma];
  return emTrechos(tx('busca.leitura.radical'), {
    a: radical[0], b: radical[1], c: comuns[0], d: comuns[1],
  });
}
