/* Fluxos com conta. ESTES TESTES GRAVAM NO BANCO da API que o web usa
   (contas e ideias com prefixo e2e<tempo>). Rode só contra o banco
   local de dev. Pulam sozinhos se o web ou a API estão fora, ou se a
   API recusar a criação de conta. */
import { expect, test } from '@playwright/test';
import {
  criarConta, criarRascunho, esperarLogado, exigirServidores, outraPessoa, padraoDe, publicar, t,
} from './apoio';

test.beforeEach(async () => {
  await exigirServidores();
});

test('conta: criar, recarregar e continuar logado, sair', async ({ page }) => {
  const conta = await criarConta(page);
  await esperarLogado(page, conta);

  await page.reload();
  await esperarLogado(page, conta);

  await page.goto('/sair');
  await page.getByRole('button', { name: t('conta.sair.botao.sair'), exact: true }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto('/perfil');
  await expect(page).toHaveURL(/\/entrar(\?|$)/);
});

test('autoria: rascunho, editar o corpo, ver o diff, publicar', async ({ page, browser }) => {
  await criarConta(page);
  const ideia = await criarRascunho(page);

  /* rascunho não abre pra quem não é autor */
  const visitante = await outraPessoa(browser, page);
  const antes = await visitante.goto(`/rfcs/${ideia.slug}`);
  expect(antes?.status()).not.toBe(200);

  const novaLinha = `Linha acrescentada na segunda versão ${Date.now()}.`;
  await page.goto(`/rfcs/${ideia.slug}/editar`);
  await page.getByLabel(t('rfcs.form.corpo'), { exact: true }).fill(`${ideia.corpo}\n\n${novaLinha}`);
  await page.getByRole('button', { name: t('rfcs.editar.salvar'), exact: true }).click();
  await expect(page.getByText(padraoDe('rfcs.editar.ok.versao'))).toBeVisible();

  await page.goto(`/rfcs/${ideia.slug}/versoes`);
  const diff = page.getByRole('group', { name: padraoDe('rfcs.versoes.diff.rotulo') });
  await expect(diff).toBeVisible();
  await expect(diff.locator('ins').filter({ hasText: novaLinha })).toHaveCount(1);

  await publicar(page, ideia);
  const depois = await visitante.goto(`/rfcs/${ideia.slug}`);
  expect(depois?.status()).toBe(200);
  await expect(visitante.getByRole('heading', { level: 1 })).toContainText(ideia.titulo);
  await visitante.context().close();
});

test('participação: inscrever-se, comentar, editar e remover o comentário', async ({ page, browser }) => {
  /* a ideia é de outra conta: quem participa não é o autor */
  await criarConta(page);
  const ideia = await criarRascunho(page);
  await publicar(page, ideia);

  const pessoa = await outraPessoa(browser, page);
  await criarConta(pessoa);
  await pessoa.goto(`/rfcs/${ideia.slug}`);

  await pessoa.getByRole('button', { name: t('rfcs.det.construir'), exact: true }).click();
  await expect(pessoa.getByRole('button', { name: t('rfcs.det.sair'), exact: true })).toBeVisible();

  const comentario = `Comentário de teste ${Date.now()}`;
  await pessoa.getByLabel(t('rfcs.det.novo.rotulo'), { exact: true }).fill(comentario);
  await pessoa.getByRole('button', { name: t('rfcs.det.novo.acao'), exact: true }).click();
  await expect(pessoa.getByText(comentario, { exact: true })).toBeVisible();

  const editado = `${comentario} (editado)`;
  await pessoa.getByRole('link', { name: t('rfcs.det.editar'), exact: true }).click();
  await pessoa.getByLabel(t('rfcs.det.editar.rotulo'), { exact: true }).fill(editado);
  await pessoa.getByRole('button', { name: t('rfcs.det.salvar'), exact: true }).click();
  await expect(pessoa.getByText(editado, { exact: true })).toBeVisible();
  await expect(pessoa.getByText(t('rfcs.det.editado'), { exact: true })).toBeVisible();

  /* remover pede confirmação por confirm() */
  pessoa.once('dialog', (d) => d.accept());
  await pessoa.getByRole('button', { name: t('rfcs.det.remover'), exact: true }).click();
  await expect(pessoa.getByText(editado, { exact: true })).toHaveCount(0);

  await pessoa.context().close();
});
