import { describe, expect, it } from 'vitest';
import {
  PALETAS, compor, escolherPaleta, familiaDoLab, renderizar, MAX_MANCHAS,
} from '../../src/lib/materia-composicao';
import { imagemOg } from '../../src/lib/og-imagem';

const LABS = ['educacao', 'cidades', 'saude', 'cultura', 'tec-civica', 'econ-solidaria'];
const TIPOS = ['mancha', 'pontos', 'grafo', 'serie'];

describe('compor', () => {
  it('é determinística: mesma entrada, mesma composição', () => {
    expect(compor('grafo', 'saude', 4242)).toEqual(compor('grafo', 'saude', 4242));
    expect(renderizar(compor('mancha', 'cidades', 7), 40, 24, 1, 7))
      .toEqual(renderizar(compor('mancha', 'cidades', 7), 40, 24, 1, 7));
  });

  it('a paleta da composição é a escolhida pela semente', () => {
    for (let s = 0; s < 50; s++) {
      const c = compor('mancha', 'cultura', s);
      const p = escolherPaleta('cultura', s);
      expect(c.paleta).toBe(p.nome);
      expect(c.fundo).toEqual(p.fundo);
      for (const m of c.manchas) expect([...p.cores, p.escuro]).toContainEqual(m.cor);
    }
  });

  it('nunca passa do número de manchas que o shader aceita', () => {
    for (const tipo of TIPOS) for (let s = 0; s < 200; s++) {
      expect(compor(tipo, LABS[s % 6], s).manchas.length).toBeLessThanOrEqual(MAX_MANCHAS);
    }
  });

  it('varia paleta, modo e caráter entre sementes', () => {
    const paletas = new Set<string>(), carater = new Set<string>();
    let lava = 0;
    const N = 600;
    for (let s = 0; s < N; s++) {
      const c = compor(TIPOS[s % 4], LABS[s % 6], s * 37 + 11);
      paletas.add(c.paleta); carater.add(c.carater);
      if (c.modo === 'lava') lava++;
    }
    expect(paletas.size).toBe(PALETAS.length);
    expect(carater).toEqual(new Set(['mesh', 'suave', 'canelado', 'faixas']));
    // cerca de 1/3 em modo lava
    expect(lava / N).toBeGreaterThan(0.25);
    expect(lava / N).toBeLessThan(0.42);
  });

  it('o lab puxa a paleta para a família dele, sem exclusividade', () => {
    for (const lab of LABS) {
      const familia = familiaDoLab(lab).map((p) => p.nome);
      let dentro = 0;
      for (let s = 0; s < 400; s++) if (familia.includes(escolherPaleta(lab, s).nome)) dentro++;
      expect(dentro / 400).toBeGreaterThan(0.65);
      expect(dentro / 400).toBeLessThan(1);
    }
  });

  it('lab desconhecido também ganha uma família de três', () => {
    expect(familiaDoLab('lab-novo')).toHaveLength(3);
  });

  it('a marca (herói do átrio) é sempre lava e da família dela', () => {
    const c = compor('mancha', 'idearium', 2026);
    expect(c.modo).toBe('lava');
    expect(familiaDoLab('idearium').map((p) => p.nome)).toContain(c.paleta);
  });
});

describe('imagemOg', () => {
  it('gera um PNG', () => {
    const png = imagemOg('mancha', 'idearium', 2026);
    expect([...png.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  });
});
