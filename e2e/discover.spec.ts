import { expect, test } from '@playwright/test';
import { mockTmdb } from './tmdb-mock';

test.beforeEach(async ({ page }) => {
  await mockTmdb(page);
});

test('put the chosen genre in the URL and send it to TMDB', async ({ page }) => {
  await page.goto('/discover');

  const discoverRequest = page.waitForRequest((request) =>
    request.url().includes('with_genres=878'),
  );
  await page.getByLabel('Genre').selectOption({ label: 'Science Fiction' });

  await expect(page).toHaveURL('/discover?genre=878');
  await discoverRequest;
});

test('restore the filters from a shared link', async ({ page }) => {
  await page.goto('/discover?type=tv&sort=top_rated');

  await expect(page.getByLabel('Type')).toHaveValue('tv');
  await expect(page.getByLabel('Sort by')).toHaveValue('top_rated');
});
