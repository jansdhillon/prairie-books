import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('Search books...').click();
  await page.getByPlaceholder('Search books...').fill('hello');
  await page.getByPlaceholder('Search books...').press('Enter');
  await page.getByRole('main').getByPlaceholder('Search books...').click();
  await page.getByRole('main').getByPlaceholder('Search books...').click();
  await page.getByText('Showing results for "hello"').dblclick();
  await page.getByText('First Printing. The book is').click();
});
