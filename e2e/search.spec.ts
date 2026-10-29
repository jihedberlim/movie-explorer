import { expect, test } from '@playwright/test';
import { mockTmdb } from './tmdb-mock';

test.beforeEach(async ({ page }) => {
  await mockTmdb(page);
});

test('search for "Interstellar" and open its details', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Search', exact: true }).click();

  await page.getByRole('searchbox', { name: 'Search movies and TV shows' }).fill('Interstellar');
  await page.getByRole('link', { name: /Interstellar/ }).click();

  await expect(page).toHaveURL('/movie/157336');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Interstellar');
  await expect(page.getByText('2h 49min')).toBeVisible();
});

test('say when the search finds nothing', async ({ page }) => {
  await page.goto('/search');

  await page.getByRole('searchbox', { name: 'Search movies and TV shows' }).fill('xyzxyz');

  await expect(page.getByText('No results for "xyzxyz".')).toBeVisible();
  await expect(page).toHaveURL('/search?q=xyzxyz');
});
