# Sistema de Prontuário Médico - UBS Mauá

Sistema web desenvolvido para gerenciar prontuários médicos de pacientes da Unidade Básica de Saúde (UBS) em Mauá, São Paulo.

O sistema está hospedado na **Microsoft Azure** com arquitetura de containers e CDN global, garantindo alta disponibilidade, segurança e performance.

## 🚀 Tecnologias Utilizadas

### Backend
- **ASP.NET Core 8.0** - Framework web
- **Entity Framework Core** - ORM para banco de dados
- **SQLite** - Banco de dados (ideal para desenvolvimento)
- **Swagger/OpenAPI** - Documentação da API

### Frontend
- **HTML5, CSS3, JavaScript** - Interface web responsiva
- **Bootstrap 5.3** - Framework CSS para responsividade
- **Bootstrap Icons** - Ícones da interface
- **SSL:** Certificado gerenciado automaticamente
- **CDN:** Distribuição global para melhor performance

## 🚀 Infraestrutura utilizada

### ☁️ Azure
- **Azure Container Registry** - Armazenamento de imagens Docker
- **Azure Container Instances** - Hospedagem de containers serverless
- **Azure Front Door** - CDN global + SSL + Load Balancer
- **Docker** - Containerização das aplicações

### 💰 Custos de Infraestrutura

| **Serviço Azure** | **Configuração** | **Custo Mensal (USD)** |
|-------------------|------------------|------------------------|
| **Azure Container Registry** | Basic (10GB storage) | $5.00 |
| **Container Instances - API** | 1.0 vCPU, 1.5GB RAM | ~$31.00 |
| **Container Instances - Web** | 0.5 vCPU, 1.0GB RAM | ~$16.00 |
| **Azure Front Door** | Standard + SSL gerenciado | $35.00 |
| **Bandwidth** | Baixo tráfego (<5GB/mês) | ~$1.00 |
| **TOTAL MENSAL** | | **~$88.00** |

## 📋 Funcionalidades

### 🔐 Sistema de Autenticação
- ✅ **Login seguro** com credenciais validadas
- ✅ **Proteção de todas as páginas** - acesso apenas após login
- ✅ **Sessão persistente** com expiração automática (24h)
- ✅ **Logout** com limpeza de sessão
- ✅ **Redirecionamento automático** para login quando não autenticado
- 👤 **Credenciais**: consulte o administrador

### 👥 Gerenciamento de Pacientes
- ✅ Cadastro de novos pacientes
- ✅ Listagem de pacientes com busca e filtros
- ✅ Visualização detalhada do paciente
- ✅ Edição de dados do paciente
- ✅ **Exclusão inteligente** - impede deletar pacientes com prontuários
- ✅ Busca por nome ou endereço
- ✅ **Validação de integridade** de dados

### 📋 Gerenciamento de Prontuários
- ✅ Criação de prontuários médicos para pacientes
- ✅ Visualização detalhada de prontuários
- ✅ **Edição completa** de prontuários existentes
- ✅ Exclusão de prontuários
- ✅ Listagem de prontuários por paciente
- ✅ **Navegação integrada** entre pacientes e prontuários

### 📊 Informações Coletadas nos Prontuários
- **Dados Pessoais**: Nome, idade, data de nascimento, endereço (automaticamente do paciente)
- **Atividade Física**: Frequência, tempo de atividade, locais de prática, tipo de deslocamento
- **Informações do Projeto**: Como soube do projeto, opinião sobre horários de aplicação
- **Dados Médicos**: Histórico médico, evolução de saúde, pressão arterial, ausculta
- **Observações**: Campo livre para anotações adicionais

### 🎨 Interface e Navegação
- 📱 **Totalmente responsivo** - otimizado para celulares, tablets e desktops
- 🔍 **Busca em tempo real** com filtros inteligentes
- 🎨 **Menu padronizado** em todas as páginas:
  - 🏠 **Início**: Dashboard principal com estatísticas
  - 👥 **Pacientes**: Lista e gerenciamento de pacientes  
  - 📊 **Estatísticas**: Estatísticas detalhadas do sistema
  - 👤 **Sair, NOME_USUÁRIO**: Logout com identificação do usuário
- ✨ **Feedback visual** com toasts de sucesso/erro
- 🔄 **Estados de carregamento** para melhor experiência

## 🌐 Acesso Online

O sistema está **hospedado na Azure** e pode ser acessado diretamente:
- **URL:** https://eprontuario-e6ftdrftcdaqbycy.b02.azurefd.net
- **SSL:** Certificado válido e seguro
- **Performance:** CDN global para acesso rápido mundial
- **Disponibilidade:** Alta disponibilidade 24/7

## 💻 Desenvolvimento Local

### Pré-requisitos
- .NET 8.0 SDK
- Python 3 (para servidor web do frontend)

#### 1. Executar a API (Backend)

```bash
# Navegar para o diretório da API
cd ProntuarioMedico.Api

# Restaurar dependências e executar
dotnet run
```

A API estará disponível em: `http://localhost:5135`
- Swagger UI: `http://localhost:5135/swagger`

#### 2. Executar o Frontend

```bash
# Navegar para o diretório do frontend
cd ProntuarioMedico.Web

# Iniciar servidor web simples
python3 -m http.server 8080
```

O frontend estará disponível em: `http://localhost:8080`

### 3. Executar Testes de Interface

O projeto inclui testes automatizados de interface web usando Playwright:

```bash
# Navegar para o diretório do frontend
cd ProntuarioMedico.Web

# Instalar dependências e configurar testes (primeira vez)
./setup-tests.sh

# Com a API e o frontend rodando, executar os testes
npm test

# Executar testes com interface visual
npm run test:ui

# Ver relatório dos testes
npm run test:report
```

📋 **Cobertura dos Testes:**
- ✅ Autenticação (login, logout, proteção de rotas)
- ✅ Gerenciamento de pacientes (criar, listar, visualizar, editar, buscar)
- ✅ Prontuários médicos (criar, visualizar, editar)
- ✅ Dashboard e navegação

Veja mais detalhes em [`ProntuarioMedico.Web/tests/README.md`](ProntuarioMedico.Web/tests/README.md)


## 📱 Como Usar

### 1. Login e Autenticação
- Acesse a página de login com design moderno
- Insira as credenciais
- O sistema manterá você logado por 24 horas
- Para sair, clique em "Sair, [user]" no menu superior

### 2. Página Principal
- Visualize estatísticas gerais dos pacientes
- Acesse ações rápidas para cadastro e busca
- Veja os pacientes cadastrados recentemente

### 3. Cadastrar Novo Paciente
- Acesse "Pacientes" > "Novo Paciente" no menu
- Preencha os dados obrigatórios (marcados com *)
- Campos opcionais podem ser preenchidos conforme necessário
- Clique em "Cadastrar Paciente" para salvar

### 4. Listar e Gerenciar Pacientes
- Acesse "Pacientes" no menu
- Use a barra de busca para encontrar pacientes específicos
- Ordene por nome, data de cadastro ou idade
- Use os botões de ação para visualizar, editar ou excluir
- **Proteção contra exclusão**: Pacientes com prontuários não podem ser deletados

### 5. Visualizar Detalhes do Paciente
- Clique no ícone "👁️" na lista de pacientes
- Visualize todas as informações pessoais do paciente
- Veja a lista completa de prontuários médicos do paciente
- Use os botões de ação para cada prontuário:
  - 👁️ **Visualizar**: Ver detalhes completos do prontuário
  - ✏️ **Editar**: Modificar informações do prontuário
  - 🗑️ **Deletar**: Remover prontuário (com confirmação)
- Acesse "Editar" para modificar dados pessoais do paciente
- Crie novos prontuários diretamente da página do paciente

### 6. Editar Prontuários
- Clique no botão "Editar" (✏️) em qualquer prontuário
- Página de edição carrega automaticamente os dados existentes
- Modifique qualquer campo do prontuário:
  - Informações de atividade física
  - Dados médicos (pressão arterial, ausculta, histórico)
  - Observações e informações adicionais
- Visualize informações do paciente (somente leitura)
- Clique em "Salvar Alterações" para confirmar
- Retorna automaticamente para a página do paciente

### 7. Criar Prontuários
- Acesse via botão "Novo Prontuário" na página do paciente
- Ou navegue diretamente pelo menu para "Criar Prontuário"
- Selecione o paciente (pré-selecionado se vier da página do paciente)
- Preencha as informações médicas e de atividade física
- Salve para criar o novo prontuário

### 8. Visualizar Prontuários
- Clique no ícone "👁️" em qualquer prontuário
- Veja todas as informações detalhadas
- Informações organizadas por categorias
- Navegação clara de volta ao paciente

### 9. Editar Paciente
- Modifique os campos necessários dos dados pessoais
- Use "Restaurar Dados" para reverter alterações
- Clique em "Salvar Alterações" para confirmar

### 10. Navegação e Segurança
- Menu padronizado em todas as páginas para fácil navegação
- Proteção automática - redirecionamento para login se não autenticado
- Feedback visual constante com mensagens de sucesso/erro
- Botões "Voltar" inteligentes que retornam ao contexto anterior

## 🔧 Configuração

### Banco de Dados
O sistema usa SQLite por padrão, criando automaticamente o arquivo `prontuario.db` na pasta da API. Para produção, pode ser alterado para SQL Server ou PostgreSQL no arquivo `appsettings.json`.

### CORS
A API está configurada para aceitar requisições de qualquer origem durante o desenvolvimento. Para produção, configure URLs específicas em `Program.cs`.

### Autenticação
O sistema usa autenticação simples baseada em localStorage. Para produção, implemente:
- JWT tokens
- Hash de senhas
- Validação no backend
- Controle de sessão no servidor

## 📊 API Endpoints

### Pacientes
- `GET /api/pacientes` - Listar todos os pacientes
- `GET /api/pacientes/{id}` - Obter paciente por ID
- `POST /api/pacientes` - Criar novo paciente
- `PUT /api/pacientes/{id}` - Atualizar paciente
- `DELETE /api/pacientes/{id}` - Excluir paciente
- `GET /api/pacientes/search?termo={termo}` - Buscar pacientes

### Prontuários
- `GET /api/prontuarios` - Listar todos os prontuários
- `GET /api/prontuarios/{id}` - Obter prontuário por ID
- `GET /api/prontuarios/paciente/{pacienteId}` - Listar prontuários de um paciente
- `POST /api/prontuarios` - Criar novo prontuário
- `PUT /api/prontuarios/{id}` - Atualizar prontuário existente
- `DELETE /api/prontuarios/{id}` - Excluir prontuário

## 📝 Estrutura do Projeto

```
app-eprontuario/
├── ProntuarioMedico.Api/          # Backend .NET
│   ├── Controllers/               # Controladores da API
│   │   ├── PacientesController.cs # Endpoints de pacientes
│   │   └── ProntuariosController.cs # Endpoints de prontuários
│   ├── Data/                     # Contexto do banco
│   ├── DTOs/                     # Data Transfer Objects
│   ├── Models/                   # Modelos de dados
│   ├── Migrations/               # Migrações do banco de dados
│   └── Program.cs                # Configuração da aplicação
│
├── ProntuarioMedico.Web/         # Frontend
│   ├── js/                       # Scripts JavaScript
│   │   ├── auth.js               # Sistema de autenticação
│   │   ├── api.js                # Serviços de API
│   │   ├── criar-prontuario.js   # Lógica de criação de prontuários
│   │   ├── editar-prontuario.js  # Lógica de edição de prontuários
│   │   ├── detalhes-paciente.js  # Lógica de detalhes do paciente
│   │   ├── pacientes.js          # Gerenciamento de pacientes
│   │   └── ...                   # Outros scripts
│   ├── login.html                # Página de autenticação
│   ├── index.html                # Dashboard principal
│   ├── pacientes.html            # Lista de pacientes
│   ├── novo-paciente.html        # Cadastro de pacientes
│   ├── detalhes-paciente-simples.html # Visualização de paciente
│   ├── editar-paciente-simples.html   # Edição de paciente
│   ├── criar-prontuario.html     # Criação de prontuários
│   ├── editar-prontuario.html    # Edição de prontuários
│   ├── detalhes-prontuario.html  # Visualização de prontuários
│   ├── estatisticas-simples.html # Estatísticas do sistema
│   └── styles.css                # Estilos customizados
│
└── README.md                     # Este arquivo
```

## 🎯 Próximos Passos

### Funcionalidades Planejadas
- [ ] Relatórios e estatísticas avançadas
- [ ] Exportação de dados em PDF
- [ ] Agendamento de consultas
- [ ] Histórico de alterações em prontuários
- [ ] Backup automático
- [ ] Notificações
- [ ] App mobile nativo
- [ ] Filtros avançados na listagem de prontuários
- [ ] Dashboard com gráficos interativos

### Melhorias de Segurança
- [ ] Autenticação JWT no backend
- [ ] Controle de permissões por usuário
- [ ] Hash de senhas
- [ ] Logs de auditoria
- [ ] Two-factor authentication

### Melhorias Técnicas
- [x] **Testes automatizados de interface web** com Playwright
- [ ] CI/CD pipeline
- [ ] Monitoramento e métricas
- [ ] Cache inteligente
- [ ] Migração para banco de dados PostgreSQL

### ☁️ Infraestrutura Azure
- [x] **Containerização completa** com Docker
- [x] **Azure Container Registry** para imagens
- [x] **Azure Container Instances** serverless
- [x] **Azure Front Door** com SSL gerenciado
- [x] **CDN global** para performance mundial
- [ ] Auto-scaling baseado em demanda
- [ ] Monitoramento com Azure Monitor
- [ ] Backup automatizado para Azure Storage

## 👥 Contribuição

Este projeto foi desenvolvido especificamente para auxiliar estudantes de medicina em estágios na UBS de Mauá. Sugestões e melhorias são bem-vindas!

## 📄 Licença

Projeto desenvolvido para fins educacionais e de apoio à saúde pública.

---

**Desenvolvido com ❤️ para a UBS Mauá - SP**