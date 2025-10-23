# Testes de Interface Web

Este diretório contém testes automatizados de interface web usando Playwright.

## 📋 Sobre os Testes

Os testes automatizados cobrem as principais funcionalidades do sistema:

- **Autenticação** (`auth.spec.js`): Login, logout, proteção de rotas
- **Gerenciamento de Pacientes** (`patients.spec.js`): Criar, listar, visualizar, editar e buscar pacientes
- **Prontuários Médicos** (`medical-records.spec.js`): Criar, visualizar, editar prontuários
- **Dashboard** (`dashboard.spec.js`): Página inicial, navegação e estatísticas

## 🚀 Como Executar os Testes

### Pré-requisitos

- Node.js 18+ instalado
- Docker e Docker Compose instalados
- Dependências instaladas: `npm install`

### Executar Todos os Testes

```bash
cd ProntuarioMedico.Web
npm test
```

### Executar Testes em Modo Interativo (UI)

```bash
npm run test:ui
```

### Executar Testes com Navegador Visível

```bash
npm run test:headed
```

### Executar Testes em Modo Debug

```bash
npm run test:debug
```

### Ver Relatório dos Testes

```bash
npm run test:report
```

## 🔧 Configuração

Os testes estão configurados em `playwright.config.js`:

- **Base URL**: http://localhost:8080 (frontend)
- **API URL**: http://localhost:5135 (backend)
- **Browser**: Chromium
- **Servidor Web**: Inicia automaticamente via Docker Compose

## 📊 Estrutura dos Testes

Cada arquivo de teste segue a estrutura:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Nome do Módulo', () => {
  test.beforeEach(async ({ page }) => {
    // Configuração antes de cada teste
  });

  test('deve fazer algo específico', async ({ page }) => {
    // Passos do teste
    // Asserções
  });
});
```

## 🎯 Cobertura dos Testes

### Autenticação
- ✅ Exibição da página de login
- ✅ Login com credenciais válidas
- ✅ Erro com credenciais inválidas
- ✅ Logout
- ✅ Redirecionamento para login em páginas protegidas
- ✅ Manutenção de sessão após reload

### Pacientes
- ✅ Navegação para lista de pacientes
- ✅ Navegação para formulário de novo paciente
- ✅ Criação de novo paciente
- ✅ Busca de pacientes
- ✅ Visualização de detalhes do paciente
- ✅ Navegação para edição de paciente
- ✅ Exibição da lista de pacientes

### Prontuários
- ✅ Navegação para criação de prontuário
- ✅ Exibição do formulário de prontuário
- ✅ Criação de novo prontuário
- ✅ Visualização de detalhes do prontuário
- ✅ Navegação para edição de prontuário
- ✅ Exibição de prontuários na página do paciente
- ✅ Edição de prontuário existente

### Dashboard
- ✅ Exibição da página inicial
- ✅ Menu de navegação
- ✅ Estatísticas/cards
- ✅ Navegação entre páginas
- ✅ Exibição do nome do usuário
- ✅ Tempo de carregamento

## 🐛 Debugging

Se os testes falharem:

1. Verifique se a aplicação está rodando: `docker compose up`
2. Acesse manualmente: http://localhost:8080
3. Verifique os logs do Docker: `docker compose logs`
4. Execute os testes em modo debug: `npm run test:debug`
5. Use o modo headed para ver o navegador: `npm run test:headed`

## 📝 Adicionando Novos Testes

1. Crie um novo arquivo `.spec.js` no diretório `tests/`
2. Importe Playwright: `const { test, expect } = require('@playwright/test');`
3. Use `test.describe()` para agrupar testes relacionados
4. Use `test()` para cada caso de teste
5. Use `expect()` para fazer asserções

Exemplo:

```javascript
test('deve fazer algo novo', async ({ page }) => {
  await page.goto('/nova-pagina.html');
  await expect(page.locator('h1')).toHaveText('Título Esperado');
});
```

## 🔍 Recursos Úteis

- [Documentação Playwright](https://playwright.dev)
- [API Reference](https://playwright.dev/docs/api/class-test)
- [Seletores](https://playwright.dev/docs/selectors)
- [Asserções](https://playwright.dev/docs/test-assertions)
