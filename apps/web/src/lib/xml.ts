/* ================================================================
   xml.ts — sitemap.xml e RSS 2.0, montados à mão
   ================================================================
   Funções puras (sem API, sem Astro), pra testar sem servidor. Texto
   de usuário (título, resumo) sempre passa por `esc`.
   ================================================================ */
import { IDIOMAS, rota, type Idioma } from './i18n';

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);

/** Remove caracteres de controle que o XML 1.0 não aceita. */
const limpar = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');

/** Um caminho (sem prefixo de idioma) vira uma <url> por idioma, cada
 *  uma com os xhtml:link das versões, x-default incluso. */
export function sitemap(origem: string, caminhos: { caminho: string; lastmod?: string | null }[]) {
  const abs = (l: Idioma, c: string) => origem + rota(l, c);
  const urls = caminhos.flatMap(({ caminho, lastmod }) => {
    const alternativas =
      IDIOMAS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${esc(abs(l, caminho))}"/>`).join('') +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${esc(abs(IDIOMAS[0], caminho))}"/>`;
    return IDIOMAS.map((l) =>
      `<url><loc>${esc(abs(l, caminho))}</loc>` +
      (lastmod ? `<lastmod>${esc(lastmod)}</lastmod>` : '') +
      alternativas + '</url>');
  });
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    urls.join('\n') + '\n</urlset>\n';
}

export interface ItemRss {
  titulo: string;
  link: string;
  data: string | null;
  descricao: string;
  categoria?: string;
}

export function rss(canal: { titulo: string; descricao: string; link: string; self: string; lang: Idioma }, itens: ItemRss[]) {
  const itensXml = itens.map((i) =>
    '<item>' +
    `<title>${esc(limpar(i.titulo))}</title>` +
    `<link>${esc(i.link)}</link>` +
    `<guid isPermaLink="true">${esc(i.link)}</guid>` +
    (i.data ? `<pubDate>${new Date(i.data).toUTCString()}</pubDate>` : '') +
    `<description>${esc(limpar(i.descricao))}</description>` +
    (i.categoria ? `<category>${esc(limpar(i.categoria))}</category>` : '') +
    '</item>').join('\n');
  const ultima = itens.find((i) => i.data)?.data;
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>\n' +
    `<title>${esc(canal.titulo)}</title>\n<link>${esc(canal.link)}</link>\n` +
    `<description>${esc(canal.descricao)}</description>\n<language>${canal.lang === 'en' ? 'en' : 'pt-br'}</language>\n` +
    (ultima ? `<lastBuildDate>${new Date(ultima).toUTCString()}</lastBuildDate>\n` : '') +
    `<atom:link href="${esc(canal.self)}" rel="self" type="application/rss+xml"/>\n` +
    itensXml + '\n</channel></rss>\n';
}
