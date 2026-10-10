/* ================================================================
   pseudonimo.ts — o @username lido como objeto público
   ================================================================
   Mora aqui, e não dentro da página, porque a mesma leitura é usada
   em dois escopos que não se enxergam: o frontmatter de
   /criar-conta, que renderiza a vitrine já pronta pra quem está sem
   JS, e o <script> da mesma página, que refaz a conta a cada tecla.
   Escrita duas vezes, a regra divergiria na primeira mudança — e
   uma vitrine que discorda do resultado mente.

   Isto NÃO é validação. Quem aceita ou recusa um nome é a API: só
   ela sabe se já está tomado, e as mensagens dela vêm traduzidas.
   Aqui a gente só descreve, no idioma da página, o que a pessoa está
   vendo na tela. Os textos moram em src/i18n/conta.ts; o exemplo que
   ocupa a vitrine com o campo vazio ('voce', 'you') não tem acento de
   propósito, porque o formato do username também não aceita.
   ================================================================ */
import { t, type Idioma } from './i18n';

export type EstadoPseudonimo = 'vazio' | 'ok' | 'invalido';

export interface LeituraPseudonimo {
  estado: EstadoPseudonimo;
  /** o que vai depois do @ */
  nome: string;
  /** as duas letras do círculo, mesmo corte que o resto do site usa */
  iniciais: string;
  /** o que a vitrine tem a dizer; vazio quando o nome passa */
  recado: string;
}

const PERMITIDO = /^[a-z0-9._-]+$/;
const BORDA = /^[a-z0-9]$/;

/* Mesmo corte de /rfcs/[slug] e do átrio: as iniciais do círculo são
   os dois primeiros caracteres, em caixa alta. */
export function iniciaisDe(nome: string): string {
  return nome.slice(0, 2).toUpperCase();
}

export function lerPseudonimo(cru: string, lang: Idioma = 'pt-BR'): LeituraPseudonimo {
  /* a API baixa a caixa e apara o espaço antes de validar; repetir isso
     aqui é o que faz a vitrine mostrar "maiúscula vira minúscula"
     acontecendo, em vez de avisar por escrito */
  const nome = cru.trim().toLowerCase();

  if (!nome) {
    const exemplo = t(lang, 'conta.pseudonimo.exemplo');
    return {
      estado: 'vazio',
      nome: exemplo,
      iniciais: iniciaisDe(exemplo),
      recado: t(lang, 'conta.pseudonimo.recado.vazio'),
    };
  }

  const motivo = porQueNaoPassa(nome, lang);
  return {
    estado: motivo ? 'invalido' : 'ok',
    nome,
    iniciais: iniciaisDe(nome),
    recado: motivo ? t(lang, 'conta.pseudonimo.recado.recusado', { motivo }) : '',
  };
}

/* Um motivo por vez, na ordem em que a pessoa esbarra neles digitando.
   Devolver a lista inteira faria a linha crescer e encolher a cada
   tecla, que é justamente o que cansa de ler. */
function porQueNaoPassa(nome: string, lang: Idioma): string | null {
  if (nome.length < 3) return t(lang, 'conta.pseudonimo.motivo.curto');
  if (nome.length > 30) return t(lang, 'conta.pseudonimo.motivo.longo');
  if (!PERMITIDO.test(nome)) {
    return t(lang, 'conta.pseudonimo.motivo.caracteres');
  }
  if (!BORDA.test(nome[0]!) || !BORDA.test(nome[nome.length - 1]!)) {
    return t(lang, 'conta.pseudonimo.motivo.borda');
  }
  return null;
}
