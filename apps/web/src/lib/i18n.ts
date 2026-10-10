/* ================================================================
   i18n.ts — idioma da interface (pt-BR e en)
   ================================================================
   O idioma vem do endereço, não do navegador: /labs é pt-BR e
   /en/labs é inglês. O middleware tira o prefixo /en, reescreve pra
   rota sem prefixo e guarda o idioma em `Astro.locals.lang`. Não existe
   página duplicada em src/pages/en/ (só a âncora [...caminho].astro, que
   responde 404 a /en/en/...); a mesma página serve os dois.

   Ninguém é redirecionado por idioma. Quem prefere inglês e chegou sem
   o prefixo vê só um convite discreto (Nav.astro).

   ----------------------------------------------------------------
   COMO USAR
   ----------------------------------------------------------------
   1. Criar uma área: um arquivo em src/i18n/<area>.ts, no formato de
      src/i18n/labs.ts. Toda chave começa com o nome da área
      ("labs.vazio.titulo"); é isso que impede duas áreas de usarem a
      mesma chave. O objeto `en` é tipado como
      Record<keyof typeof ptBR, string>: chave faltando ou sobrando em
      inglês quebra o `astro check` e o build.
   2. Registrar a área: importar aqui embaixo e somar em `DICIONARIOS`.
   3. Numa página .astro:
        import { t, rota, idiomaDe } from '../lib/i18n';
        const lang = idiomaDe(Astro);
        <h1>{t(lang, 'labs.titulo')}</h1>
        <a href={rota(lang, '/rfcs')}>{t(lang, 'comum.nav.rfcs')}</a>
        {t(lang, 'labs.qtd.varios', { n: 3 })}   ← "{n}" no texto vira 3
      Todo href interno passa por `rota`, senão quem está em /en cai de
      volta no português ao clicar.
   4. Texto com marcação (um trecho em itálico, um negrito): quebre em
      pedaços, uma chave por pedaço, e monte a marcação no .astro:
        {t(lang, 'atrio.abertura.antes')}
        <span class="serif">{t(lang, 'atrio.abertura.serif')}</span>
        {t(lang, 'atrio.abertura.depois')}
      Pedaço vazio é permitido quando a ordem das palavras muda entre os
      idiomas. Não use set:html com o dicionário: a interpolação recebe
      texto de usuário (títulos, @nomes) e viraria porta de XSS.
   5. Plural: duas chaves (".um" e ".varios") e a página escolhe pelo n.
      Os dois idiomas têm a mesma regra de plural, então isso basta.
   ================================================================ */
import comum from '../i18n/comum';
import atrio from '../i18n/atrio';
import labs from '../i18n/labs';
import conta from '../i18n/conta';
import erro from '../i18n/erro';
import busca from '../i18n/busca';
import tags from '../i18n/tags';
import builders from '../i18n/builders';
import usuario from '../i18n/usuario';
import sessao from '../i18n/sessao';
import rfcs from '../i18n/rfcs';
import notificacoes from '../i18n/notificacoes';
import auth from '../i18n/auth';
import ciclo from '../i18n/ciclo';
import moderacao from '../i18n/moderacao';
import seguranca from '../i18n/seguranca';
import ideia from '../i18n/ideia';

export type Idioma = 'pt-BR' | 'en';
export const IDIOMAS: readonly Idioma[] = ['pt-BR', 'en'];
export const IDIOMA_PADRAO: Idioma = 'pt-BR';

/** Prefixo de endereço de cada idioma. O padrão não tem prefixo. */
const PREFIXO: Record<Idioma, string> = { 'pt-BR': '', en: '/en' };

const DICIONARIOS = {
  'pt-BR': { ...comum['pt-BR'], ...atrio['pt-BR'], ...labs['pt-BR'], ...conta['pt-BR'], ...erro['pt-BR'],
             ...busca['pt-BR'], ...tags['pt-BR'], ...builders['pt-BR'], ...usuario['pt-BR'], ...sessao['pt-BR'], ...rfcs['pt-BR'], ...notificacoes['pt-BR'], ...auth['pt-BR'], ...ciclo['pt-BR'], ...moderacao['pt-BR'], ...seguranca['pt-BR'], ...ideia['pt-BR'] },
  en:      { ...comum.en,       ...atrio.en,       ...labs.en, ...conta.en, ...erro.en,
             ...busca.en, ...tags.en, ...builders.en, ...usuario.en, ...sessao.en, ...rfcs.en, ...notificacoes.en, ...auth.en, ...ciclo.en, ...moderacao.en, ...seguranca.en, ...ideia.en },
};

export type Chave = keyof (typeof DICIONARIOS)['pt-BR'];

/** Texto da chave no idioma, com "{nome}" trocado por vars.nome.
 *  Variável ausente fica como está no texto: aparece na tela e é
 *  achada na revisão, em vez de sumir calada. */
export function t(lang: Idioma, chave: Chave, vars?: Record<string, string | number>): string {
  const texto: string = DICIONARIOS[lang][chave] ?? DICIONARIOS[IDIOMA_PADRAO][chave];
  if (!vars) return texto;
  return texto.replace(/\{(\w+)\}/g, (inteiro, nome: string) =>
    nome in vars ? String(vars[nome]) : inteiro);
}

/** Pra chave montada em tempo de execução (ex.: o nome de um lab pelo
 *  slug). Sem isso, a página teria que confiar que a chave existe. */
export const temChave = (chave: string): chave is Chave =>
  chave in DICIONARIOS[IDIOMA_PADRAO];

/** Caminho interno no idioma. `caminho` é sempre o endereço sem
 *  prefixo, começando com "/": rota('en', '/labs') → '/en/labs'. */
export function rota(lang: Idioma, caminho: string): string {
  const prefixo = PREFIXO[lang];
  if (!prefixo) return caminho;
  /* Idempotente: exigirSessao já devolve o caminho com prefixo, e quem
     o recebe costuma passar por rota() de novo. Sem isto, /en/en/entrar. */
  if (caminho === prefixo || caminho.startsWith(prefixo + '/') || caminho.startsWith(prefixo + '?')) return caminho;
  return caminho === '/' ? prefixo : prefixo + caminho;
}

/** Separa o idioma de um caminho vindo da requisição. Usado pelo
 *  middleware; fica aqui pra regra do prefixo morar num lugar só. */
export function separarIdioma(caminho: string): { lang: Idioma; caminho: string } {
  if (caminho === '/en' || caminho.startsWith('/en/')) {
    return { lang: 'en', caminho: caminho.slice(3) || '/' };
  }
  return { lang: IDIOMA_PADRAO, caminho };
}

/** Idioma da requisição atual, resolvido pelo middleware. */
export const idiomaDe = (astro: { locals: App.Locals }): Idioma =>
  astro.locals.lang ?? IDIOMA_PADRAO;

/** Cookie que guarda "não quero a sugestão de idioma". Legível por JS
 *  de propósito: guarda só uma escolha de interface, e o script da nav
 *  precisa ler pra não mostrar o convite em página servida de cache. */
export const COOKIE_SUGESTAO_DISPENSADA = 'idioma_sugestao';
