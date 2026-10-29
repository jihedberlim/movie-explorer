import { expect, test } from '@playwright/test';
import { mockTmdb } from './tmdb-mock';

test.beforeEach(async ({ page }) => {
  await mockTmdb(page);
});

test('keep a title in the watchlist after reloading the page', async ({ page }) => {
  await page.goto('/movie/157336');

  await page.getByRole('button', { name: '+ Add to watchlist' }).click();
  await expect(page.getByRole('button', { name: '✓ In your watchlist' })).toBeVisible();

  await page.reload();
  await page.getByRole('link', { name: /Watchlist/ }).click();

  await expect(page).toHaveURL('/watchlist');
  await expect(page.getByRole('heading', { name: 'Interstellar' })).toBeVisible();
});

test('mark a saved title as watched', async ({ page }) => {
  await page.goto('/movie/157336');
  await page.getByRole('button', { name: '+ Add to watchlist' }).click();
  await page.goto('/watchlist');

  await page.getByRole('button', { name: '✓ Watched' }).click();

  await expect(page.getByRole('button', { name: 'Watched (1)' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'To watch (0)' })).toBeVisible();
});
