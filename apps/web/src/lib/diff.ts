/* ================================================================
   diff.ts — diferença entre duas versões do corpo de uma RFC
   ================================================================
   Função pura, sem I/O: recebe dois textos e devolve blocos prontos
   pra renderizar. A API não calcula diff (só entrega as versões), e
   VISAO §6 diz que nada se deleta — então comparar é sempre possível.

   Usa jsdiff: diffLines pra achar o que mudou e diffWordsWithSpace
   dentro das linhas alteradas, pra mostrar a palavra trocada e não
   o parágrafo inteiro riscado.

   Trecho igual e longo vira um bloco 'recolhido': ficam CONTEXTO
   linhas junto de cada mudança e o miolo é escondido, com a contagem.
   ================================================================ */
import { diffLines, diffWordsWithSpace } from 'diff';

/** Linhas de contexto mantidas de cada lado de uma mudança. */
const CONTEXTO = 2;

/** Pedaço de uma linha alterada. `mudou` marca a palavra que difere. */
export interface Pedaco {
  texto: string;
  mudou: boolean;
}

export interface LinhaDiff {
  texto: string;
  /** Só existe em linha removida/acrescida emparelhada com a sua
   *  contraparte; sem isso a linha inteira conta como mudada. */
  pedacos?: Pedaco[];
}

export type TipoBloco = 'igual' | 'removido' | 'acrescido' | 'recolhido';

export interface BlocoDiff {
  tipo: TipoBloco;
  linhas: LinhaDiff[];
}

export interface ResumoDiff {
  blocos: BlocoDiff[];
  removidas: number;
  acrescidas: number;
  /** true quando os dois textos são iguais. */
  identico: boolean;
}

function linhasDe(valor: string): string[] {
  const l = valor.split('\n');
  if (l[l.length - 1] === '') l.pop();   // o \n final não é uma linha
  return l;
}

const crua = (linhas: string[]): LinhaDiff[] => linhas.map((texto) => ({ texto }));

/** Emparelha linha a linha um bloco removido com o acrescido que vem
 *  logo depois, quando têm o mesmo tamanho. Tamanhos diferentes não
 *  dão pra casar sem adivinhar; ficam como linhas inteiras. */
function emparelhar(de: string[], para: string[]): [LinhaDiff[], LinhaDiff[]] {
  if (de.length !== para.length) return [crua(de), crua(para)];
  const a: LinhaDiff[] = [];
  const b: LinhaDiff[] = [];
  de.forEach((antes, i) => {
    const depois = para[i];
    const partes = diffWordsWithSpace(antes, depois);
    a.push({
      texto: antes,
      pedacos: partes.filter((p) => !p.added).map((p) => ({ texto: p.value, mudou: !!p.removed })),
    });
    b.push({
      texto: depois,
      pedacos: partes.filter((p) => !p.removed).map((p) => ({ texto: p.value, mudou: !!p.added })),
    });
  });
  return [a, b];
}

export function compararVersoes(antes: string, depois: string): ResumoDiff {
  const partes = diffLines(antes.replace(/\r\n/g, '\n'), depois.replace(/\r\n/g, '\n'));
  const brutos: BlocoDiff[] = [];
  let removidas = 0;
  let acrescidas = 0;

  for (let i = 0; i < partes.length; i++) {
    const p = partes[i];
    const prox = partes[i + 1];

    if (p.removed && prox?.added) {
      const de = linhasDe(p.value);
      const para = linhasDe(prox.value);
      const [a, b] = emparelhar(de, para);
      brutos.push({ tipo: 'removido', linhas: a }, { tipo: 'acrescido', linhas: b });
      removidas += de.length;
      acrescidas += para.length;
      i++;
    } else if (p.removed) {
      const l = linhasDe(p.value);
      brutos.push({ tipo: 'removido', linhas: crua(l) });
      removidas += l.length;
    } else if (p.added) {
      const l = linhasDe(p.value);
      brutos.push({ tipo: 'acrescido', linhas: crua(l) });
      acrescidas += l.length;
    } else {
      brutos.push({ tipo: 'igual', linhas: crua(linhasDe(p.value)) });
    }
  }

  /* Colapsa só os trechos iguais que sobram depois do contexto. Nas
     pontas do texto o contexto existe de um lado só. */
  const blocos: BlocoDiff[] = [];
  brutos.forEach((b, i) => {
    if (b.tipo !== 'igual') {
      blocos.push(b);
      return;
    }
    const cabeca = i === 0 ? 0 : CONTEXTO;
    const cauda = i === brutos.length - 1 ? 0 : CONTEXTO;
    if (b.linhas.length <= cabeca + cauda + 1) {
      blocos.push(b);
      return;
    }
    if (cabeca) blocos.push({ tipo: 'igual', linhas: b.linhas.slice(0, cabeca) });
    blocos.push({ tipo: 'recolhido', linhas: b.linhas.slice(cabeca, b.linhas.length - cauda) });
    if (cauda) blocos.push({ tipo: 'igual', linhas: b.linhas.slice(b.linhas.length - cauda) });
  });

  return { blocos, removidas, acrescidas, identico: removidas === 0 && acrescidas === 0 };
}
