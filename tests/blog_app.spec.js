import { expect, test, describe, beforeEach } from '@playwright/test';

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset');
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Test name',
        username: 'Test username',
        password: 'Test password',
      },
    });
    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'Test username', 'Test password');
      await expect(page.getByTestId('username')).toBeHidden();
      await expect(page.getByTestId('blogCreator')).toBeVisible();
    });
    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'Wrong', 'Wrong');
      await expect(page.getByTestId('status')).toBeVisible();
      await expect(page.getByText('wrong username or password')).toBeVisible();
      await expect(page.getByTestId('username')).toBeVisible();
      await expect(page.getByTestId('blogCreator')).toBeHidden();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'Test username', 'Test password');
    });

    /**
     * ChatGPT assisted:https://chatgpt.com/share/671043d1-414c-8012-b68e-0a20209a9934
     * Outputted GPT code was not perfect, I had to change many things and use the debug
     * playwright features to solve the issue. Still, the inital GPT response was a useful
     * starting point. I may have been able to answer faster due to debug time
     */
    test('blogs are arranged in ascending order by likes', async ({ page }) => {
      // Create first blog
      await createBlog(
        page,
        'First Blog',
        'Author One',
        'http://first-blog.com'
      );

      // View first blog details
      await page.getByRole('button', { name: 'view' }).click();

      // Ensure the first blog is visible with 0 likes
      await expect(page.getByText('0')).toBeVisible();

      // Create second blog
      await createBlog(
        page,
        'Second Blog',
        'Author Two',
        'http://second-blog.com'
      );

      // View second blog details
      await page.getByRole('button', { name: 'view' }).click();

      // Ensure the second blog is visible with 0 likes
      await expect(page.getByText('0').nth(1)).toBeVisible();

      // Check the initial order of blogs based on their likes (both should have 0)
      const blogTexts = await page.locator('.blog').allInnerTexts();

      // Ensure initial order is correct based on creation
      expect(blogTexts[0]).toContain('First Blog');
      expect(blogTexts[1]).toContain('Second Blog');

      // Like the second blog (currently below the first)
      await page.getByRole('button', { name: 'like' }).nth(1).click();
      await expect(page.getByText('1')).toBeVisible();

      // After React rerender, blogs should now be sorted by likes in ascending order
      const updatedBlogTexts = await page.locator('.blog').allInnerTexts();

      // Now the second blog should be at the top due to more likes
      expect(updatedBlogTexts[0]).toContain('Second Blog');
      expect(updatedBlogTexts[1]).toContain('First Blog');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page);
      await expect(
        page.getByRole('button', { name: 'new note' })
      ).toBeVisible();
    });
    test('a new blog can be liked', async ({ page }) => {
      await createBlog(page);
      await page.getByRole('button', { name: 'view' }).click();
      await expect(page.getByText('0')).toBeVisible();
      await page.getByRole('button', { name: 'like' }).click();
      await expect(page.getByText('1')).toBeVisible();
    });
    test('user who added the blog can delete the blog', async ({ page }) => {
      await createBlog(page);
      await page.getByRole('button', { name: 'view' }).click();
      page.on('dialog', (dialog) => dialog.accept());
      await page.getByRole('button', { name: 'remove' }).click();
      await expect(page.getByText('title author')).toBeHidden();
    });
    test('only the user who added the blog sees the blogs delete button', async ({
      page,
    }) => {
      await createBlog(page);
      await page.getByRole('button', { name: 'logout' }).click();
      await page.getByRole('button', { name: 'view' }).click();
      await expect(page.getByRole('button', { name: 'remove' })).toBeHidden();
    });
  });
});
async function createBlog(
  page,
  title = 'title',
  author = 'author',
  url = 'url'
) {
  await page.getByRole('button', { name: 'new note' }).click();
  await page.getByLabel('title:').fill(title);
  await page.getByLabel('author:').fill(author);
  await page.getByLabel('url:').fill(url);
  await page.getByRole('button', { name: 'create' }).click();
}

async function login(page, username, password) {
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByRole('button', { name: 'Submit' }).click();
}
