import { describe, expect, it } from 'vitest';
import { rota, separarIdioma, t, temChave } from '../../src/lib/i18n';

/* Toda área de src/i18n, sem depender da lista em lib/i18n.ts: área
   nova que esqueceu de ser registrada também é checada. */
const areas = import.meta.glob<{ default: Record<'pt-BR' | 'en', Record<string, string>> }>(
  '../../src/i18n/*.ts',
  { eager: true },
);

describe('dicionários', () => {
  it('existe ao menos uma área', () => {
    expect(Object.keys(areas).length).toBeGreaterThan(0);
  });

  for (const [arquivo, mod] of Object.entries(areas)) {
    const nome = arquivo.split('/').pop()!.replace(/\.ts$/, '');
    describe(nome, () => {
      const pt = mod.default['pt-BR'];
      const en = mod.default.en;

      it('pt-BR e en têm o mesmo conjunto de chaves', () => {
        expect(Object.keys(en).sort()).toEqual(Object.keys(pt).sort());
      });

      it('toda chave começa com o nome da área', () => {
        expect(Object.keys(pt).filter((k) => !k.startsWith(nome + '.'))).toEqual([]);
      });

      it('nenhum valor vazio', () => {
        /* Pedaço vazio é permitido num idioma quando a ordem das palavras
           muda (lib/i18n.ts, item 4), mas não nos dois ao mesmo tempo. */
        const vazias = Object.keys(pt).filter(
          (k) => typeof pt[k] !== 'string' || typeof en[k] !== 'string' ||
            (pt[k].trim() === '' && en[k].trim() === ''),
        );
        expect(vazias).toEqual([]);
      });

      it('as variáveis {x} são as mesmas nos dois idiomas', () => {
        const vars = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join();
        expect(Object.keys(pt).filter((k) => vars(pt[k]) !== vars(en[k] ?? ''))).toEqual([]);
      });
    });
  }
});

describe('t()', () => {
  it('interpola variáveis', () => {
    expect(t('pt-BR', 'labs.qtd.varios', { n: 3 })).toBe('3 ideias');
    expect(t('en', 'sessao.api.status', { status: 500 })).toBe('The API responded 500.');
  });

  it('variável ausente fica visível no texto', () => {
    expect(t('pt-BR', 'labs.qtd.varios', {})).toBe('{n} ideias');
  });

  it('sem vars devolve o texto cru', () => {
    expect(t('en', 'comum.nav.rfcs')).toBe('ideas');
  });

  it('temChave', () => {
    expect(temChave('comum.nav.rfcs')).toBe(true);
    expect(temChave('nao.existe')).toBe(false);
  });
});

describe('rota()', () => {
  it('pt-BR não tem prefixo', () => {
    expect(rota('pt-BR', '/labs')).toBe('/labs');
    expect(rota('pt-BR', '/')).toBe('/');
  });

  it('en prefixa /en', () => {
    expect(rota('en', '/labs')).toBe('/en/labs');
    expect(rota('en', '/rfcs?pagina=2')).toBe('/en/rfcs?pagina=2');
  });

  it("'/' vira '/en'", () => {
    expect(rota('en', '/')).toBe('/en');
  });

  it('é idempotente', () => {
    expect(rota('en', '/en/x')).toBe('/en/x');
    expect(rota('en', '/en')).toBe('/en');
    expect(rota('en', '/en?x=1')).toBe('/en?x=1');
    expect(rota('en', rota('en', '/entrar'))).toBe('/en/entrar');
  });

  it('não confunde /entrar com o prefixo /en', () => {
    expect(rota('en', '/entrar')).toBe('/en/entrar');
  });
});

describe('separarIdioma()', () => {
  it.each([
    ['/en', 'en', '/'],
    ['/en/', 'en', '/'],
    ['/en/labs', 'en', '/labs'],
    ['/labs', 'pt-BR', '/labs'],
    ['/', 'pt-BR', '/'],
    ['/entrar', 'pt-BR', '/entrar'],
    ['/english', 'pt-BR', '/english'],
  ])('%s -> %s %s', (caminho, lang, resto) => {
    expect(separarIdioma(caminho)).toEqual({ lang, caminho: resto });
  });
});
