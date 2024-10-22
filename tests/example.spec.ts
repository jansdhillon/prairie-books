import { getURL } from '@/utils/helpers';
import { test, expect } from '@playwright/test';

const url = getURL();


console.log(url);

test('has title', async ({ page }) => {
  await page.goto(url);

  await expect(page).toHaveTitle(/Kathrin's Books/);
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
