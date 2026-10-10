import { describe, expect, it } from 'vitest';
import { compararVersoes } from '../../src/lib/diff';

const linhas = (n: number, prefixo = 'linha') =>
  Array.from({ length: n }, (_, i) => `${prefixo} ${i + 1}`);

const texto = (l: string[]) => l.join('\n') + '\n';

describe('compararVersoes', () => {
  it('textos idênticos', () => {
    const r = compararVersoes('a\nb\n', 'a\nb\n');
    expect(r.identico).toBe(true);
    expect(r.removidas).toBe(0);
    expect(r.acrescidas).toBe(0);
    /* sem mudança não há contexto a guardar: o texto todo é igual ou
       recolhido (a página de versões mostra o aviso de idêntico) */
    expect(r.blocos.every((b) => b.tipo === 'igual' || b.tipo === 'recolhido')).toBe(true);
  });

  it('linha trocada vira removido + acrescido com a palavra marcada', () => {
    const r = compararVersoes('a\no gato dorme\nc\n', 'a\no cão dorme\nc\n');
    expect(r.identico).toBe(false);
    expect(r.removidas).toBe(1);
    expect(r.acrescidas).toBe(1);
    const rem = r.blocos.find((b) => b.tipo === 'removido')!;
    const acr = r.blocos.find((b) => b.tipo === 'acrescido')!;
    expect(rem.linhas[0].texto).toBe('o gato dorme');
    expect(acr.linhas[0].texto).toBe('o cão dorme');
    expect(rem.linhas[0].pedacos!.filter((p) => p.mudou).map((p) => p.texto)).toEqual(['gato']);
    expect(acr.linhas[0].pedacos!.filter((p) => p.mudou).map((p) => p.texto)).toEqual(['cão']);
  });

  it('acréscimo', () => {
    const r = compararVersoes('a\nb\n', 'a\nb\nc\n');
    expect(r.acrescidas).toBe(1);
    expect(r.removidas).toBe(0);
    expect(r.blocos.at(-1)).toEqual({ tipo: 'acrescido', linhas: [{ texto: 'c' }] });
  });

  it('remoção', () => {
    const r = compararVersoes('a\nb\nc\n', 'a\nc\n');
    expect(r.removidas).toBe(1);
    expect(r.acrescidas).toBe(0);
    expect(r.blocos.find((b) => b.tipo === 'removido')!.linhas).toEqual([{ texto: 'b' }]);
  });

  it('CRLF e LF são o mesmo texto', () => {
    expect(compararVersoes('a\r\nb\r\n', 'a\nb\n').identico).toBe(true);
  });

  it('recolhe trecho igual longo no começo e mantém 2 linhas de contexto', () => {
    const r = compararVersoes(texto([...linhas(20), 'fim']), texto([...linhas(20), 'FIM']));
    /* no começo do texto o contexto existe de um lado só */
    expect(r.blocos.map((b) => b.tipo)).toEqual(['recolhido', 'igual', 'removido', 'acrescido']);
    expect(r.blocos[0].linhas).toHaveLength(18);
    expect(r.blocos[1].linhas.map((l) => l.texto)).toEqual(['linha 19', 'linha 20']);
  });

  it('trecho igual no meio guarda contexto dos dois lados', () => {
    const meio = linhas(10, 'meio');
    const r = compararVersoes(texto(['A', ...meio, 'B']), texto(['X', ...meio, 'Y']));
    expect(r.blocos.map((b) => b.tipo)).toEqual(
      ['removido', 'acrescido', 'igual', 'recolhido', 'igual', 'removido', 'acrescido'],
    );
    expect(r.blocos[3].linhas).toHaveLength(6);
  });

  it('trecho igual curto não é recolhido', () => {
    const r = compararVersoes('A\nx\ny\nB\n', 'X\nx\ny\nY\n');
    expect(r.blocos.some((b) => b.tipo === 'recolhido')).toBe(false);
  });
});
