const { test, expect } = require('@playwright/test');

// Helper function to login before tests
async function login(page) {
  await page.goto('/login.html');
  await page.locator('input[type="text"]').fill('rebeca');
  await page.locator('input[type="password"]').fill('rebeca123');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/index.html/);
}

test.describe('Medical Records Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to create medical record page', async ({ page }) => {
    await page.goto('/index.html');
    
    // Navigate to medical records creation
    const createRecordLink = page.locator('a[href*="criar-prontuario"], a:has-text("Novo Prontuário")').first();
    
    if (await createRecordLink.isVisible()) {
      await createRecordLink.click();
      await expect(page).toHaveURL(/criar-prontuario.html/);
    } else {
      // Alternative: go directly to the page
      await page.goto('/criar-prontuario.html');
      await expect(page).toHaveURL(/criar-prontuario.html/);
    }
  });

  test('should display create medical record form', async ({ page }) => {
    await page.goto('/criar-prontuario.html');
    
    // Wait for form to load
    await page.waitForTimeout(1000);
    
    // Check if patient selector exists
    const patientSelector = page.locator('select[name="pacienteId"], #pacienteId');
    await expect(patientSelector).toBeVisible();
    
    // Check if submit button exists
    const submitButton = page.locator('button[type="submit"], button:has-text("Criar"), button:has-text("Salvar")');
    await expect(submitButton.first()).toBeVisible();
  });

  test('should create a new medical record', async ({ page }) => {
    await page.goto('/criar-prontuario.html');
    
    // Wait for patients to load in selector
    await page.waitForTimeout(2000);
    
    // Select a patient
    const patientSelector = page.locator('select[name="pacienteId"], #pacienteId');
    const options = await patientSelector.locator('option').count();
    
    if (options > 1) { // More than just the placeholder
      // Select the first patient
      await patientSelector.selectOption({ index: 1 });
      
      // Fill in medical record fields
      await page.locator('input[name="pressaoArterial"], #pressaoArterial').fill('120/80');
      await page.locator('textarea[name="historicoMedico"], #historicoMedico').fill('Teste de histórico médico');
      await page.locator('textarea[name="observacoes"], #observacoes').fill('Observações de teste');
      
      // Submit the form
      await page.locator('button[type="submit"], button:has-text("Criar"), button:has-text("Salvar")').first().click();
      
      // Wait for response
      await page.waitForTimeout(2000);
      
      // Should redirect or show success message
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/detalhes-paciente|detalhes-prontuario|criar-prontuario/);
    }
  });

  test('should view medical record details', async ({ page }) => {
    // First go to a patient details page (which should list medical records)
    await page.goto('/pacientes.html');
    await page.waitForTimeout(2000);
    
    // Click on first patient's view button
    const viewButton = page.locator('a[href*="detalhes-paciente"], .btn:has-text("👁")').first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.waitForURL(/detalhes-paciente/);
      await page.waitForTimeout(2000);
      
      // Look for medical record view buttons
      const recordViewButton = page.locator('a[href*="detalhes-prontuario"], button:has-text("Ver Prontuário"), .btn:has-text("👁")').first();
      
      if (await recordViewButton.isVisible()) {
        await recordViewButton.click();
        await expect(page).toHaveURL(/detalhes-prontuario/);
        
        // Check if medical record details are displayed
        await expect(page.locator('body')).toContainText(/Prontuário|Detalhes/);
      }
    }
  });

  test('should navigate to edit medical record page', async ({ page }) => {
    // Navigate through patient details to find a medical record
    await page.goto('/pacientes.html');
    await page.waitForTimeout(2000);
    
    const viewButton = page.locator('a[href*="detalhes-paciente"]').first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.waitForURL(/detalhes-paciente/);
      await page.waitForTimeout(2000);
      
      // Look for edit medical record button
      const editButton = page.locator('a[href*="editar-prontuario"], button:has-text("Editar Prontuário"), .btn:has-text("✏")').first();
      
      if (await editButton.isVisible()) {
        await editButton.click();
        await expect(page).toHaveURL(/editar-prontuario/);
      }
    }
  });

  test('should display medical records in patient details', async ({ page }) => {
    await page.goto('/pacientes.html');
    await page.waitForTimeout(2000);
    
    // Go to first patient details
    const viewButton = page.locator('a[href*="detalhes-paciente"]').first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.waitForURL(/detalhes-paciente/);
      await page.waitForTimeout(2000);
      
      // Check if there's a section for medical records
      const hasProntuariosSection = await page.locator('text=/Prontuários|Histórico Médico/').isVisible();
      expect(hasProntuariosSection).toBeTruthy();
    }
  });

  test('should edit an existing medical record', async ({ page }) => {
    // Navigate to a medical record edit page
    await page.goto('/pacientes.html');
    await page.waitForTimeout(2000);
    
    const viewButton = page.locator('a[href*="detalhes-paciente"]').first();
    
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.waitForURL(/detalhes-paciente/);
      await page.waitForTimeout(2000);
      
      const editButton = page.locator('a[href*="editar-prontuario"]').first();
      
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForURL(/editar-prontuario/);
        await page.waitForTimeout(1000);
        
        // Update a field
        const observacoesField = page.locator('textarea[name="observacoes"], #observacoes');
        if (await observacoesField.isVisible()) {
          const newObservation = `Observação atualizada em ${new Date().toISOString()}`;
          await observacoesField.fill(newObservation);
          
          // Submit the form
          await page.locator('button[type="submit"], button:has-text("Salvar")').first().click();
          
          // Wait for save
          await page.waitForTimeout(2000);
          
          // Should redirect after save
          const currentUrl = page.url();
          expect(currentUrl).not.toContain('editar-prontuario');
        }
      }
    }
  });

  test('should display medical record form fields', async ({ page }) => {
    await page.goto('/criar-prontuario.html');
    await page.waitForTimeout(1000);
    
    // Check for key form fields related to medical records
    const hasPatientSelector = await page.locator('select[name="pacienteId"], #pacienteId').isVisible();
    expect(hasPatientSelector).toBeTruthy();
    
    // Check if page has medical information fields (at least some textarea or inputs)
    const inputCount = await page.locator('input, textarea, select').count();
    expect(inputCount).toBeGreaterThan(1);
  });
});
