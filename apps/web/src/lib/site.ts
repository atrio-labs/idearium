/* ================================================================
   site.ts — origem pública do site
   ================================================================
   Só servidor. Usada no redirect do OAuth, no canonical e og:url do
   Layout, no sitemap e no RSS: tudo que precisa de URL absoluta.
   ================================================================ */

/** Origem pública do site. Atrás de proxy `url.origin` sai com o host
 *  interno; a variável de execução SITE_URL (sem prefixo PUBLIC_, lida
 *  a cada chamada) tem precedência. Valor que não é URL é ignorado. */
export function origemPublica(url: URL): string {
  const configurada = process.env.SITE_URL?.trim();
  if (configurada) {
    try {
      return new URL(configurada).origin;
    } catch {
      /* cai no fallback */
    }
  }
  return url.origin;
}
