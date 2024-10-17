// import { test, expect, describe } from '@playwright/test';
// import { beforeEach } from 'node:test';

// describe('Note app', (params) => {
//   beforeEach(async ({ page }) => {
//     await page.goto('/');
//   });
//   test('frontpage can be opened', async ({ page }) => {
//     const locator = page.getByText('Notes');
//     await expect(locator).toBeVisible();
//     await expect(
//       page.getByText(
//         'Note app, Department of Computer Science, University of Helsinki 2024'
//       )
//     ).toBeVisible();
//   });

//   test('login form can be opened', async ({ page }) => {
//     await page.getByRole('button', { name: 'log in' }).click();
//     await page.getByLabel('username').fill('test user');
//     await page.getByRole('textbox').last().fill('test password');

//     await expect(page.getByText('test user logged in')).toBeVisible();
//   });

//   describe('when logged in', () => {
//     beforeEach(async ({ page }) => {
//       await page.getByRole('button', { name: 'log in' }).click();
//       await page.getByTestId('username').fill('mluukkai');
//       await page.getByTestId('password').fill('salainen');
//       await page.getByRole('button', { name: 'login' }).click();
//     });
//     test('a new note can be added', async ({ page }) => {
//       await page.getByRole('button', { name: 'new note' }).click();
//       await page.getByRole('textbox').fill('a note created by playwright');
//       await page.getByRole('button', { name: 'save' }).click();
//       await expect(
//         page.getByText('a note created by playwright')
//       ).toBeVisible();
//     });
//   });
// });
