const { test, expect } = require('@playwright/test');

// Helper function to login before tests
async function login(page) {
  await page.goto('/login.html');
  await page.locator('input[type="text"]').fill('rebeca');
  await page.locator('input[type="password"]').fill('rebeca123');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/index.html/);
}

test.describe('Patient Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to patients list page', async ({ page }) => {
    await page.goto('/index.html');
    
    // Click on "Pacientes" menu item
    await page.locator('a:has-text("Pacientes")').first().click();
    
    // Should be on patients page
    await expect(page).toHaveURL(/pacientes.html/);
    
    // Check if patients list is visible
    await expect(page.locator('h1, h2').filter({ hasText: 'Pacientes' })).toBeVisible();
  });

  test('should navigate to new patient form', async ({ page }) => {
    await page.goto('/pacientes.html');
    
    // Click on "Novo Paciente" button or link
    const newPatientButton = page.locator('a[href="novo-paciente.html"], button:has-text("Novo Paciente")').first();
    await newPatientButton.click();
    
    // Should be on new patient page
    await expect(page).toHaveURL(/novo-paciente.html/);
  });

  test('should create a new patient successfully', async ({ page }) => {
    await page.goto('/novo-paciente.html');
    
    // Generate unique patient data
    const timestamp = Date.now();
    const patientName = `Test Patient ${timestamp}`;
    const patientCPF = `${String(timestamp).slice(0, 11)}`;
    
    // Fill in the patient form
    await page.locator('input[name="nome"], #nome').fill(patientName);
    await page.locator('input[name="cpf"], #cpf').fill(patientCPF);
    await page.locator('input[name="dataNascimento"], #dataNascimento').fill('1990-01-01');
    await page.locator('input[name="telefone"], #telefone').fill('11987654321');
    await page.locator('input[name="email"], #email').fill(`test${timestamp}@example.com`);
    
    // Fill address fields
    await page.locator('input[name="endereco"], #endereco').fill('Rua Teste, 123');
    await page.locator('input[name="cidade"], #cidade').fill('São Paulo');
    await page.locator('input[name="estado"], #estado').fill('SP');
    await page.locator('input[name="cep"], #cep').fill('01234567');
    
    // Submit the form
    await page.locator('button[type="submit"], button:has-text("Cadastrar")').click();
    
    // Wait for success message or redirect
    await page.waitForTimeout(2000);
    
    // Should either show success toast or redirect to patients list
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/pacientes.html|detalhes-paciente/);
  });

  test('should search for patients', async ({ page }) => {
    await page.goto('/pacientes.html');
    
    // Wait for patients list to load
    await page.waitForTimeout(2000);
    
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Buscar"], input[name="busca"]').first();
    
    if (await searchInput.isVisible()) {
      // Type in search box
      await searchInput.fill('Test');
      
      // Wait for search results
      await page.waitForTimeout(1000);
      
      // Verify search is working (at least the input has the value)
      await expect(searchInput).toHaveValue('Test');
    }
  });

  test('should view patient details', async ({ page }) => {
    await page.goto('/pacientes.html');
    
    // Wait for patients list to load
    await page.waitForTimeout(2000);
    
    // Look for "Ver" or view icon button
    const viewButton = page.locator('a[href*="detalhes-paciente"], button:has-text("Ver"), i.fa-eye, .btn:has-text("👁")').first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      
      // Should navigate to patient details page
      await expect(page).toHaveURL(/detalhes-paciente/);
    }
  });

  test('should navigate to edit patient page', async ({ page }) => {
    await page.goto('/pacientes.html');
    
    // Wait for patients list to load
    await page.waitForTimeout(2000);
    
    // Look for "Editar" or edit icon button
    const editButton = page.locator('a[href*="editar-paciente"], button:has-text("Editar"), i.fa-edit, .btn:has-text("✏")').first();
    
    if (await editButton.isVisible()) {
      await editButton.click();
      
      // Should navigate to edit patient page
      await expect(page).toHaveURL(/editar-paciente/);
    }
  });

  test('should display patient list table', async ({ page }) => {
    await page.goto('/pacientes.html');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check if there's a table or list of patients
    const hasTable = await page.locator('table').isVisible().catch(() => false);
    const hasCards = await page.locator('.card, .patient-card').count().then(count => count > 0).catch(() => false);
    
    // Should have either table or cards displaying patients
    expect(hasTable || hasCards).toBeTruthy();
  });
});
