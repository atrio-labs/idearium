import { describe, expect, it } from 'vitest';
import { rss, sitemap } from '../../src/lib/xml';
import { codificarPng, imagemOg } from '../../src/lib/og-imagem';

describe('sitemap', () => {
  it('gera uma url por idioma com hreflang e escapa texto', () => {
    const x = sitemap('https://ex.com', [{ caminho: '/rfcs/a&b', lastmod: '2026-01-01T00:00:00Z' }]);
    expect(x).toContain('<loc>https://ex.com/rfcs/a&amp;b</loc>');
    expect(x).toContain('<loc>https://ex.com/en/rfcs/a&amp;b</loc>');
    expect(x).toContain('hreflang="x-default" href="https://ex.com/rfcs/a&amp;b"');
    expect(x.match(/<url>/g)).toHaveLength(2);
  });
});

describe('rss', () => {
  it('monta RSS 2.0 com item escapado', () => {
    const x = rss(
      { titulo: 'T', descricao: 'D', link: 'https://ex.com/rfcs', self: 'https://ex.com/rss.xml', lang: 'pt-BR' },
      [{ titulo: 'RFC-0001 · <b>', link: 'https://ex.com/rfcs/a', data: '2026-08-01T00:00:00Z', descricao: 'r & s' }],
    );
    expect(x).toContain('<rss version="2.0"');
    expect(x).toContain('<title>RFC-0001 · &lt;b&gt;</title>');
    expect(x).toContain('<pubDate>Sat, 01 Aug 2026 00:00:00 GMT</pubDate>');
    expect(x).toContain('<language>pt-br</language>');
  });
});

describe('imagem og', () => {
  it('é um PNG 1200x630, determinístico', () => {
    const a = imagemOg('mancha', 'cultura', 6042);
    expect(a.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(a.readUInt32BE(16)).toBe(1200);
    expect(a.readUInt32BE(20)).toBe(630);
    expect(a.equals(imagemOg('mancha', 'cultura', 6042))).toBe(true);
    expect(a.equals(imagemOg('grafo', 'cultura', 6042))).toBe(false);
  });
  it('codifica png mínimo', () => {
    expect(codificarPng(new Uint8Array(3), 1, 1).length).toBeGreaterThan(50);
  });
});
