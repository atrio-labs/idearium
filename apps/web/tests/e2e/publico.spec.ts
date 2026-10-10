/* Páginas públicas, sem sessão: respondem, têm o idioma certo, cabem
   no celular, passam no axe, não vão buscar fonte fora e saem com cache
   público. Só leem; não gravam nada. */
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { ROTAS_PUBLICAS, comIdioma, exigirServidores, t } from './apoio';

test.beforeEach(async () => {
  await exigirServidores();
});

for (const lang of ['pt-BR', 'en'] as const) {
  for (const rota of ROTAS_PUBLICAS) {
    const caminho = comIdioma(lang, rota);

    test(`${caminho} responde 200 com lang=${lang}`, async ({ page }) => {
      const r = await page.goto(caminho);
      expect(r?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
    });

    test(`${caminho} sem rolagem horizontal no celular`, async ({ page }, info) => {
      test.skip(info.project.name !== 'mobile', 'só no projeto mobile');
      await page.goto(caminho);
      const { largura, janela } = await page.evaluate(() => ({
        largura: document.documentElement.scrollWidth,
        janela: window.innerWidth,
      }));
      expect(largura).toBeLessThanOrEqual(janela);
    });

    test(`${caminho} sem violação serious/critical no axe`, async ({ page }) => {
      await page.goto(caminho);
      const resultado = await new AxeBuilder({ page }).analyze();
      const graves = resultado.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      expect(graves).toEqual([]);
    });
  }
}

test('sem cookie, / sai com cache público', async ({ request }) => {
  const r = await request.get('/', { headers: { cookie: '' } });
  expect(r.status()).toBe(200);
  const cache = r.headers()['cache-control'] ?? '';
  expect(cache).toMatch(/\bpublic\b/);
  expect(cache).toMatch(/\bs-maxage=60\b/);
});

test('nenhuma requisição ao Google Fonts', async ({ page }) => {
  const fora: string[] = [];
  page.on('request', (req) => {
    const host = new URL(req.url()).hostname;
    if (host === 'fonts.googleapis.com' || host === 'fonts.gstatic.com') fora.push(req.url());
  });
  for (const rota of ['/', '/rfcs', '/sobre', '/en']) {
    await page.goto(rota, { waitUntil: 'networkidle' });
  }
  expect(fora).toEqual([]);
});

test.describe('/en', () => {
  test('nav e título em inglês', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveTitle(t('atrio.titulo', undefined, 'en'));
    const nav = page.getByRole('navigation', { name: t('comum.nav.principal', undefined, 'en') });
    for (const chave of ['comum.nav.labs', 'comum.nav.rfcs', 'comum.nav.sobre', 'comum.nav.buscar'] as const) {
      /* no celular a lista pode estar dentro do menu recolhido */
      await expect(
        nav.getByRole('link', { name: t(chave, undefined, 'en'), exact: true, includeHidden: true }).first(),
      ).toBeAttached();
    }
  });

  test('/en/perfil sem sessão leva a /en/entrar', async ({ page }) => {
    await page.goto('/en/perfil');
    await expect(page).toHaveURL(/\/en\/entrar(\?|$)/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
