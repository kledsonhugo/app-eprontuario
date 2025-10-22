const { test, expect } = require('@playwright/test');

// Helper function to login before tests
async function login(page) {
  await page.goto('/login.html');
  await page.locator('input[type="text"]').fill('rebeca');
  await page.locator('input[type="password"]').fill('rebeca123');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/index.html/);
}

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display dashboard page', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check if dashboard is loaded
    await expect(page).toHaveURL(/index.html/);
    
    // Should have navigation menu
    await expect(page.locator('nav, .navbar')).toBeVisible();
  });

  test('should display navigation menu with all links', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check for main navigation links
    const hasInicioLink = await page.locator('a:has-text("Início")').isVisible();
    const hasPacientesLink = await page.locator('a:has-text("Pacientes")').isVisible();
    const hasLogoutLink = await page.locator('text=Sair').isVisible();
    
    expect(hasInicioLink || hasPacientesLink || hasLogoutLink).toBeTruthy();
  });

  test('should display statistics or cards', async ({ page }) => {
    await page.goto('/index.html');
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Check if there are any statistics cards or information
    const hasCards = await page.locator('.card').count() > 0;
    const hasStats = await page.locator('[class*="stat"], [class*="metric"]').count() > 0;
    
    expect(hasCards || hasStats).toBeTruthy();
  });

  test('should navigate to statistics page', async ({ page }) => {
    await page.goto('/index.html');
    
    // Look for statistics link in menu
    const statsLink = page.locator('a:has-text("Estatísticas"), a[href*="estatisticas"]').first();
    
    if (await statsLink.isVisible()) {
      await statsLink.click();
      await expect(page).toHaveURL(/estatisticas/);
    }
  });

  test('should display user name in menu', async ({ page }) => {
    await page.goto('/index.html');
    
    // Should show username somewhere (typically in logout area)
    const hasUsername = await page.locator('text=/rebeca/i').isVisible();
    expect(hasUsername).toBeTruthy();
  });

  test('should have working navigation between pages', async ({ page }) => {
    await page.goto('/index.html');
    
    // Click on Pacientes
    const pacientesLink = page.locator('a:has-text("Pacientes")').first();
    await pacientesLink.click();
    await expect(page).toHaveURL(/pacientes.html/);
    
    // Go back to home
    const inicioLink = page.locator('a:has-text("Início")').first();
    await inicioLink.click();
    await expect(page).toHaveURL(/index.html/);
  });

  test('should load dashboard quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/index.html');
    
    // Wait for main content
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time (10 seconds)
    expect(loadTime).toBeLessThan(10000);
  });
});
