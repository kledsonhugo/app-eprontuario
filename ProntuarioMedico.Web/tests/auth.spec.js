const { test, expect } = require('@playwright/test');

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/login.html');
    await page.evaluate(() => localStorage.clear());
  });

  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login.html');
    
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Login - Sistema de Prontuários/);
    
    // Check if login form elements are present
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/login.html');
    
    // Fill in the login form
    await page.locator('input[type="text"]').fill('rebeca');
    await page.locator('input[type="password"]').fill('rebeca123');
    
    // Click the login button
    await page.locator('button[type="submit"]').click();
    
    // Should redirect to index.html
    await expect(page).toHaveURL(/index.html/);
    
    // Check if user is authenticated by checking for logout button
    await expect(page.locator('text=Sair')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login.html');
    
    // Fill in the login form with wrong credentials
    await page.locator('input[type="text"]').fill('wrong');
    await page.locator('input[type="password"]').fill('wrong123');
    
    // Click the login button
    await page.locator('button[type="submit"]').click();
    
    // Should show an error toast or alert
    await page.waitForTimeout(1000);
    
    // Should still be on login page
    await expect(page).toHaveURL(/login.html/);
  });

  test('should successfully logout', async ({ page }) => {
    // First login
    await page.goto('/login.html');
    await page.locator('input[type="text"]').fill('rebeca');
    await page.locator('input[type="password"]').fill('rebeca123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/index.html/);
    
    // Click logout button
    const logoutButton = page.locator('text=Sair').first();
    await logoutButton.click();
    
    // Should redirect to login page
    await expect(page).toHaveURL(/login.html/);
  });

  test('should redirect to login when accessing protected page without authentication', async ({ page }) => {
    await page.goto('/index.html');
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/login.html/);
  });

  test('should maintain session after page reload', async ({ page }) => {
    // Login
    await page.goto('/login.html');
    await page.locator('input[type="text"]').fill('rebeca');
    await page.locator('input[type="password"]').fill('rebeca123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/index.html/);
    
    // Reload the page
    await page.reload();
    
    // Should still be authenticated
    await expect(page.locator('text=Sair')).toBeVisible();
    await expect(page).toHaveURL(/index.html/);
  });
});
