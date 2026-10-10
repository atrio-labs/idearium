import { describe, expect, it } from 'vitest';
import { renderizarMarkdown } from '../../src/lib/markdown';

/* Nenhum destes pode chegar ao DOM como tag ou atributo ativo. */
const semTagAtiva = (html: string) => {
  expect(html).not.toMatch(/<script/i);
  expect(html).not.toMatch(/<img/i);
  expect(html).not.toMatch(/<svg/i);
  expect(html).not.toMatch(/<[a-z][^>]*\son\w+\s*=/i);
};

describe('renderizarMarkdown: XSS', () => {
  it('escapa <script>', () => {
    const html = renderizarMarkdown('<script>alert(1)</script>');
    semTagAtiva(html);
    expect(html).toContain('&lt;script&gt;');
  });

  it('escapa <img onerror>', () => {
    const html = renderizarMarkdown('<img src=x onerror=alert(1)>');
    semTagAtiva(html);
    expect(html).toContain('&lt;img');
  });

  it('escapa <a onclick>', () => {
    const html = renderizarMarkdown('<a href="#" onclick="alert(1)">x</a>');
    expect(html).not.toMatch(/<a[^>]*onclick/i);
    expect(html).toContain('&lt;a');
  });

  it('escapa "><svg onload>', () => {
    const html = renderizarMarkdown('"><svg onload=alert(1)>');
    semTagAtiva(html);
    expect(html).toContain('&lt;svg');
  });

  it.each([
    ['javascript:', '[x](javascript:alert(1))'],
    ['JAVASCRIPT: em maiúsculas', '[x](JAVASCRIPT:alert(1))'],
    ['data:text/html', '[x](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)'],
    ['data:image', '[x](data:image/png;base64,iVBORw0KGgo=)'],
  ])('recusa link %s', (_nome, texto) => {
    const html = renderizarMarkdown(texto);
    expect(html).not.toMatch(/<a\s/i);
    expect(html).not.toMatch(/href=/i);
  });

  it('não gera <img> para ![img](https://...)', () => {
    const html = renderizarMarkdown('![img](https://exemplo.org/a.png)');
    expect(html).not.toMatch(/<img/i);
    /* vira "!" seguido de link comum, que só sai da página com clique */
    expect(html).toContain('<a href="https://exemplo.org/a.png"');
  });

  it('não põe target em link', () => {
    expect(renderizarMarkdown('[x](https://exemplo.org)')).not.toMatch(/target=/);
  });
});

describe('renderizarMarkdown: links', () => {
  it.each(['http://exemplo.org/a', 'https://exemplo.org/a'])('autolink %s com rel seguro', (url) => {
    const html = renderizarMarkdown(`veja ${url} aqui`);
    expect(html).toContain(`<a href="${url}" rel="nofollow ugc noopener noreferrer">`);
  });

  it('link markdown com rel seguro', () => {
    expect(renderizarMarkdown('[x](https://exemplo.org)')).toContain(
      'rel="nofollow ugc noopener noreferrer"',
    );
  });

  it('aceita mailto: e caminho relativo', () => {
    expect(renderizarMarkdown('[m](mailto:a@b.org)')).toContain('href="mailto:a@b.org"');
    expect(renderizarMarkdown('[r](/rfcs/x)')).toContain('href="/rfcs/x"');
  });
});

describe('renderizarMarkdown: estrutura', () => {
  it('# e ## viram h2; ### e abaixo viram h3', () => {
    const html = renderizarMarkdown('# um\n\n## dois\n\n### tres\n\n#### quatro');
    expect(html).toContain('<h2>um</h2>');
    expect(html).toContain('<h2>dois</h2>');
    expect(html).toContain('<h3>tres</h3>');
    expect(html).toContain('<h3>quatro</h3>');
    expect(html).not.toMatch(/<h1|<h4/);
  });

  it('tabela escapa HTML nas células', () => {
    const html = renderizarMarkdown('| a | b |\n|---|---|\n| <b>x</b> | <script>y</script> |');
    expect(html).toContain('<table>');
    expect(html).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(html).not.toMatch(/<script/i);
  });

  it('entrada vazia ou nula não lança', () => {
    expect(renderizarMarkdown('')).toBe('');
    expect(renderizarMarkdown(null as unknown as string)).toBe('');
  });
});
