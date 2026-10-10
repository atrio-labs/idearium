/* Apoio dos e2e: textos vindos do dicionário (nada de texto copiado
   da tela) e os passos que criam dados.

   Os passos que criam dados gravam no banco da API que o web usa.
   Rode contra o banco local de dev. */
import { expect, test, type Browser, type Page } from '@playwright/test';
import { t as traduzir, type Chave, type Idioma } from '../../src/lib/i18n';

export const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321';
export const API_URL = process.env.API_URL ?? 'http://localhost:3000';

export const t = (chave: Chave, vars?: Record<string, string | number>, lang: Idioma = 'pt-BR') =>
  traduzir(lang, chave, vars);

/** Texto do dicionário vira regex que aceita qualquer valor no lugar de {x}. */
export function padraoDe(chave: Chave, lang: Idioma = 'pt-BR'): RegExp {
  const texto = traduzir(lang, chave).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(texto.replace(/\\\{\w+\\\}/g, '.+?'));
}

/** As rotas públicas, sem prefixo de idioma. */
export const ROTAS_PUBLICAS = [
  '/', '/rfcs', '/labs', '/sobre', '/governanca', '/codigo-de-conduta', '/transparencia', '/buscar',
];

export const comIdioma = (lang: Idioma, caminho: string) =>
  lang === 'en' ? (caminho === '/' ? '/en' : '/en' + caminho) : caminho;

async function responde(url: string): Promise<boolean> {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(3000) });
    return r.status < 500;
  } catch {
    return false;
  }
}

/** Pula o teste se o web ou a API não estão no ar. */
export async function exigirServidores() {
  test.skip(!(await responde(BASE_URL)), `web fora do ar em ${BASE_URL}`);
  test.skip(!(await responde(`${API_URL}/health`)), `API fora do ar em ${API_URL}`);
}

/** Prefixo único por execução. Username tem no máximo 30 caracteres. */
export function nomeUnico(): string {
  const sorteio = Math.random().toString(36).slice(2, 6);
  return `e2e${Date.now().toString(36)}${sorteio}`;
}

export interface Conta {
  username: string;
  email: string;
  senha: string;
}

/** Cria a conta pela tela. Pula o teste se a API recusar a criação. */
export async function criarConta(page: Page): Promise<Conta> {
  const username = nomeUnico();
  const conta = { username, email: `${username}@example.org`, senha: `senha-${username}` };

  await page.goto('/criar-conta');
  await page.getByLabel(t('conta.criar.username.rotulo'), { exact: true }).fill(conta.username);
  await page.getByLabel(t('conta.criar.email.rotulo'), { exact: true }).fill(conta.email);
  await page.getByLabel(t('conta.criar.senha.rotulo'), { exact: true }).fill(conta.senha);
  await page.getByRole('button', { name: t('conta.criar.botao.criar'), exact: true }).click();
  await page.waitForLoadState('load');

  if (new URL(page.url()).pathname.startsWith('/criar-conta')) {
    const aviso = await page.getByRole('alert').first().textContent().catch(() => null);
    test.skip(true, `a API recusou a criação da conta: ${aviso?.trim() ?? 'sem mensagem'}`);
  }
  return conta;
}

/** Logado = /perfil abre sem mandar pra /entrar. */
export async function esperarLogado(page: Page, conta: Conta) {
  await expect(
    page.getByRole('link', { name: t('comum.nav.perfil', { username: conta.username }), includeHidden: true }),
  ).not.toHaveCount(0);
  await page.goto('/perfil');
  await expect(page).toHaveURL(/\/perfil(\?|$)/);
}

export interface Ideia {
  slug: string;
  titulo: string;
  corpo: string;
}

/** Cria um rascunho por /rfcs/nova e devolve o slug (vem no redirect pra edição). */
export async function criarRascunho(page: Page): Promise<Ideia> {
  const marca = nomeUnico();
  const ideia = {
    slug: '',
    titulo: `Ideia ${marca}`,
    corpo: `Primeira versão do corpo da ideia ${marca}.\n\nUm parágrafo com texto suficiente para passar do mínimo.`,
  };

  await page.goto('/rfcs/nova');
  await page.getByLabel(t('rfcs.form.titulo'), { exact: true }).fill(ideia.titulo);
  await page.getByLabel(t('rfcs.form.resumo'), { exact: true }).fill(`Resumo da ideia ${marca}`);
  await page.getByLabel(t('rfcs.nova.lab.rotulo'), { exact: true }).selectOption({ index: 1 });
  await page.getByLabel(t('rfcs.form.corpo'), { exact: true }).fill(ideia.corpo);
  await page.getByRole('button', { name: t('rfcs.nova.salvar'), exact: true }).click();

  await expect(page).toHaveURL(/\/rfcs\/[^/]+\/editar/);
  ideia.slug = new URL(page.url()).pathname.split('/')[2];
  return ideia;
}

export async function publicar(page: Page, ideia: Ideia) {
  await page.goto(`/rfcs/${ideia.slug}/editar`);
  await page.getByRole('button', { name: t('rfcs.editar.publicar.acao'), exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/rfcs/${ideia.slug}(\\?|#|$)`));
}

/** Outra pessoa no mesmo teste: contexto sem cookie, mesmo tamanho de tela. */
export const outraPessoa = async (browser: Browser, page: Page) =>
  (await browser.newContext({ baseURL: BASE_URL, viewport: page.viewportSize() })).newPage();
