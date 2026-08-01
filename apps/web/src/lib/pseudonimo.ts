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
   Aqui a gente só descreve, em português, o que a pessoa está
   vendo na tela.
   ================================================================ */

/** ocupa a vitrine enquanto o campo está vazio; sem acento de propósito,
    porque o formato do username também não aceita */
export const EXEMPLO_PSEUDONIMO = 'voce';

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

/* O pastel do círculo da lista de mãos sai do próprio @username, não de
   sorteio. Mora aqui junto do resto da leitura porque agora são três
   lugares que precisam chegar na mesma cor — o cartão de /builders, a
   prévia de /perfil e a vitrine de /criar-conta, que recalcula a cada
   tecla. Escrita duas vezes, a conta divergiria na primeira mudança. */
const PASTEIS = ['educacao', 'cidades', 'saude', 'cultura', 'tec-civica', 'econ-solidaria'];

/** o slug do pastel, pra virar `var(--color-<slug>)` como superfície */
export function pastelDe(username: string): string {
  const soma = [...username].reduce((s, c) => s + c.charCodeAt(0), 0);
  return PASTEIS[soma % PASTEIS.length]!;
}

export function lerPseudonimo(cru: string): LeituraPseudonimo {
  /* a API baixa a caixa e apara o espaço antes de validar; repetir isso
     aqui é o que faz a vitrine mostrar "maiúscula vira minúscula"
     acontecendo, em vez de avisar por escrito */
  const nome = cru.trim().toLowerCase();

  if (!nome) {
    return {
      estado: 'vazio',
      nome: EXEMPLO_PSEUDONIMO,
      iniciais: iniciaisDe(EXEMPLO_PSEUDONIMO),
      recado: 'o de cima é exemplo. o seu entra assim que você digitar.',
    };
  }

  const motivo = porQueNaoPassa(nome);
  return {
    estado: motivo ? 'invalido' : 'ok',
    nome,
    iniciais: iniciaisDe(nome),
    recado: motivo ? `esse nome não é aceito: ${motivo}.` : '',
  };
}

/* Um motivo por vez, na ordem em que a pessoa esbarra neles digitando.
   Devolver a lista inteira faria a linha crescer e encolher a cada
   tecla, que é justamente o que cansa de ler. */
function porQueNaoPassa(nome: string): string | null {
  if (nome.length < 3) return 'são no mínimo 3 caracteres';
  if (nome.length > 30) return 'são no máximo 30 caracteres';
  if (!PERMITIDO.test(nome)) {
    return 'só letras de a a z sem acento, dígitos, ponto, hífen e sublinhado';
  }
  if (!BORDA.test(nome[0]!) || !BORDA.test(nome[nome.length - 1]!)) {
    return 'começa e termina com letra ou dígito';
  }
  return null;
}
