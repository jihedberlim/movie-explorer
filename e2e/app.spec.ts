import { expect, test } from '@playwright/test';
import { mockTmdb } from './tmdb-mock';

test.beforeEach(async ({ page }) => {
  await mockTmdb(page);
});

test('show the 404 page for an unknown address', async ({ page }) => {
  await page.goto('/this-page-does-not-exist');

  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();

  await page.getByRole('link', { name: 'Go to the home page' }).click();
  await expect(page).toHaveURL('/');
});

test('switch to dark mode and remember it', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).not.toHaveClass(/dark/);

  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(html).toHaveClass(/dark/);

  await page.reload();
  await expect(html).toHaveClass(/dark/);
});

test('switch the language to Portuguese', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Change language' }).click();
  const portugueseRequest = page.waitForRequest((request) =>
    request.url().includes('language=pt-BR'),
  );
  await page.getByRole('button', { name: 'Português' }).click();

  await expect(page.getByRole('link', { name: 'Buscar' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await portugueseRequest;
});
