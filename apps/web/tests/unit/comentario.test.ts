import { describe, expect, it } from 'vitest';
import { renderizarComentario } from '../../src/lib/markdown';

const semTagAtiva = (html: string) => {
  expect(html).not.toMatch(/<script/i);
  expect(html).not.toMatch(/<img/i);
  expect(html).not.toMatch(/<svg/i);
  expect(html).not.toMatch(/<[a-z][^>]*\son\w+\s*=/i);
};

describe('renderizarComentario: markdown', () => {
  it('renderiza negrito, itálico, lista e citação', () => {
    const html = renderizarComentario('**a** *b*\n\n- um\n- dois\n\n> citado');
    expect(html).toContain('<strong>a</strong>');
    expect(html).toContain('<em>b</em>');
    expect(html).toContain('<li>um</li>');
    expect(html).toContain('<blockquote>');
  });

  it('não gera título nem tabela', () => {
    const html = renderizarComentario('# grande\n\nSetext\n===\n\n| a | b |\n|---|---|\n| 1 | 2 |');
    expect(html).not.toMatch(/<h[1-6]/);
    expect(html).not.toMatch(/<table/);
    expect(html).toContain('# grande');
  });
});

describe('renderizarComentario: XSS', () => {
  it('escapa script, img e onclick', () => {
    for (const t of [
      '<script>alert(1)</script>',
      '<img src=x onerror=alert(1)>',
      '<a href="#" onclick="alert(1)">x</a>',
      '<svg onload=alert(1)>',
    ]) {
      const html = renderizarComentario(t);
      semTagAtiva(html);
      expect(html).not.toMatch(/<a[^>]*onclick/i);
    }
  });

  it('recusa javascript: e data: em link', () => {
    const html = renderizarComentario('[x](javascript:alert(1)) [y](data:text/html,x)');
    expect(html).not.toMatch(/href="javascript:/i);
    expect(html).not.toMatch(/href="data:/i);
  });

  it('não deixa imagem carregar e põe rel no link', () => {
    const html = renderizarComentario('![x](http://e.com/a.png) [l](https://e.com)');
    expect(html).not.toContain('<img');
    expect(html).toContain('rel="nofollow ugc noopener noreferrer"');
  });

  it('nome de menção não abre atributo', () => {
    const html = renderizarComentario('@a"onmouseover="x <b>@ana</b>');
    semTagAtiva(html);
    expect(html).not.toMatch(/"onmouseover/);
  });
});

describe('renderizarComentario: menções', () => {
  it('@username vira link pro perfil', () => {
    const html = renderizarComentario('oi @luisa.m_2-x, tudo bem?');
    expect(html).toContain('href="/users/luisa.m_2-x"');
    expect(html).toContain('>@luisa.m_2-x</a>, tudo');
  });

  it('respeita o idioma', () => {
    expect(renderizarComentario('@luisa', 'en')).toContain('href="/en/users/luisa"');
  });

  it('ponto final da frase fica fora do nome', () => {
    const html = renderizarComentario('valeu @luisa.');
    expect(html).toContain('>@luisa</a>.');
  });

  it('menção no início da linha e entre parênteses', () => {
    expect(renderizarComentario('@luisa foi')).toContain('/users/luisa');
    expect(renderizarComentario('(@luisa)')).toContain('/users/luisa');
  });

  it('não transforma email', () => {
    const html = renderizarComentario('escreva para ana@exemplo.com ou x@yyy');
    expect(html).not.toContain('/users/');
  });

  it('não transforma código em linha nem bloco', () => {
    expect(renderizarComentario('use `@luisa` aqui')).not.toContain('/users/');
    expect(renderizarComentario('```\n@luisa\n```')).not.toContain('/users/');
  });

  it('não pega link já existente nem nome fora do padrão', () => {
    expect(renderizarComentario('[@luisa](https://e.com)')).not.toContain('/users/');
    expect(renderizarComentario('@ab @Luisa @' + 'a'.repeat(31))).not.toContain('/users/');
  });

  it('não pega @ colado em palavra', () => {
    expect(renderizarComentario('abc@luisa')).not.toContain('/users/');
  });
});
