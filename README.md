# # Sistema de Prontuário Médico - UBS Mauá

Sistema web desenvolvido para gerenciar prontuários médicos de pacientes da Unidade Básica de Saúde (UBS) em Mauá, São Paulo.

## 🏥 Sobre o Projeto

Este sistema foi desenvolvido para auxiliar no controle e gerenciamento de prontuários médicos, facilitando o acompanhamento de saúde e histórico médico dos pacientes atendidos na UBS.

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

## 📋 Funcionalidades

### Gerenciamento de Pacientes
- ✅ Cadastro de novos pacientes
- ✅ Listagem de pacientes com busca e filtros
- ✅ Visualização detalhada do paciente
- ✅ Edição de dados do paciente
- ✅ Exclusão de pacientes
- ✅ Busca por nome ou endereço

### Gerenciamento de Prontuários
- ✅ Criação de prontuários médicos para pacientes
- ✅ Visualização detalhada de prontuários
- ✅ **NOVO**: Edição de prontuários existentes
- ✅ Exclusão de prontuários
- ✅ Listagem de prontuários por paciente
- ✅ Navegação integrada entre pacientes e prontuários

### Informações Coletadas nos Prontuários
- **Dados Pessoais**: Nome, idade, data de nascimento, endereço (automaticamente do paciente)
- **Atividade Física**: Frequência, tempo de atividade, locais de prática, tipo de deslocamento
- **Informações do Projeto**: Como soube do projeto, opinião sobre horários de aplicação
- **Dados Médicos**: Histórico médico, evolução de saúde, pressão arterial, ausculta
- **Observações**: Campo livre para anotações adicionais

### Interface Responsiva
- 📱 Otimizado para dispositivos móveis (celulares e tablets)
- 💻 Funciona perfeitamente em desktops e notebooks
- � Busca em tempo real
- 🎨 **NOVO**: Menu de navegação padronizado em todas as páginas
- � Acesso às estatísticas do sistema

## 🛠️ Como Executar

### Pré-requisitos
- .NET 8.0 SDK
- Python 3 (para servidor web do frontend)

### 1. Executar a API (Backend)

```bash
# Navegar para o diretório da API
cd ProntuarioMedico.Api

# Restaurar dependências e executar
dotnet run
```

A API estará disponível em: `http://localhost:5135`
- Swagger UI: `http://localhost:5135/swagger`

### 2. Executar o Frontend

```bash
# Navegar para o diretório do frontend
cd ProntuarioMedico.Web

# Iniciar servidor web simples
python3 -m http.server 8080
```

O frontend estará disponível em: `http://localhost:8080`

## 📱 Como Usar

### 1. Página Principal (Dashboard)
- Visualize estatísticas gerais dos pacientes
- Acesse ações rápidas para cadastro e busca
- Veja os pacientes cadastrados recentemente

### 2. Cadastrar Novo Paciente
- Acesse "Novo Paciente" no menu ou dashboard
- Preencha os dados obrigatórios (marcados com *)
- Campos opcionais podem ser preenchidos conforme necessário
- Clique em "Cadastrar Paciente" para salvar

### 3. Listar Pacientes
- Acesse "Pacientes" no menu
- Use a barra de busca para encontrar pacientes específicos
- Ordene por nome, data de cadastro ou idade
- Use os botões de ação para visualizar, editar ou excluir

### 4. Visualizar Detalhes do Paciente
- Clique no ícone "👁️" na lista de pacientes ou acesse diretamente
- Visualize todas as informações pessoais do paciente
- Veja a lista completa de prontuários médicos do paciente
- Use os botões de ação para cada prontuário:
  - 👁️ **Visualizar**: Ver detalhes completos do prontuário
  - ✏️ **Editar**: Modificar informações do prontuário
  - 🗑️ **Deletar**: Remover prontuário (com confirmação)
- Acesse "Editar" para modificar dados pessoais do paciente
- Crie novos prontuários diretamente da página do paciente

### 5. **NOVO**: Editar Prontuários
- Clique no botão "Editar" (✏️) em qualquer prontuário
- Página de edição carrega automaticamente os dados existentes
- Modifique qualquer campo do prontuário:
  - Informações de atividade física
  - Dados médicos (pressão arterial, ausculta, histórico)
  - Observações e informações adicionais
- Visualize informações do paciente (somente leitura)
- Clique em "Salvar Alterações" para confirmar
- Retorna automaticamente para a página do paciente

### 6. Criar Prontuários
- Acesse via botão "Novo Prontuário" na página do paciente
- Ou navegue diretamente pelo menu para "Criar Prontuário"
- Selecione o paciente (pré-selecionado se vier da página do paciente)
- Preencha as informações médicas e de atividade física
- Salve para criar o novo prontuário

### 7. Visualizar Prontuários
- Clique no ícone "👁️" em qualquer prontuário
- Veja todas as informações detalhadas
- Informações organizadas por categorias
- Navegação clara de volta ao paciente

### 8. Editar Paciente
- Modifique os campos necessários dos dados pessoais
- Use "Restaurar Dados" para reverter alterações
- Clique em "Salvar Alterações" para confirmar

### 9. **NOVO**: Navegação Integrada
- Menu padronizado em todas as páginas com:
  - 🏠 **Início**: Dashboard principal
  - 👥 **Pacientes**: Lista e gerenciamento de pacientes  
  - 📊 **Estatísticas**: Estatísticas do sistema
- Navegação fluida entre pacientes e prontuários
- Botões "Voltar" inteligentes que retornam ao contexto anterior

## 🔧 Configuração

### Banco de Dados
O sistema usa SQLite por padrão, criando automaticamente o arquivo `prontuario.db` na pasta da API. Para produção, pode ser alterado para SQL Server ou PostgreSQL no arquivo `appsettings.json`.

### CORS
A API está configurada para aceitar requisições de qualquer origem durante o desenvolvimento. Para produção, configure URLs específicas em `Program.cs`.

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
- `PUT /api/prontuarios/{id}` - **NOVO**: Atualizar prontuário existente
- `DELETE /api/prontuarios/{id}` - Excluir prontuário

## 🔒 Segurança

### Para Produção
- Configurar HTTPS
- Implementar autenticação e autorização
- Validar e sanitizar todas as entradas
- Configurar CORS adequadamente
- Usar banco de dados seguro (não SQLite)
- Implementar backup regular dos dados

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
│   │   ├── criar-prontuario.js   # Lógica de criação de prontuários
│   │   ├── editar-prontuario.js  # **NOVO**: Lógica de edição de prontuários
│   │   ├── detalhes-paciente.js  # Lógica de detalhes do paciente
│   │   └── ...                   # Outros scripts
│   ├── index.html                # Dashboard principal
│   ├── pacientes.html            # Lista de pacientes
│   ├── novo-paciente.html        # Cadastro de pacientes
│   ├── detalhes-paciente-simples.html # Visualização de paciente
│   ├── editar-paciente-simples.html   # Edição de paciente
│   ├── criar-prontuario.html     # Criação de prontuários
│   ├── editar-prontuario.html    # **NOVO**: Edição de prontuários
│   ├── detalhes-prontuario.html  # Visualização de prontuários
│   ├── estatisticas-simples.html # Estatísticas do sistema
│   └── styles.css                # Estilos customizados
│
└── README.md                     # Este arquivo
```

## 🎯 Próximos Passos

- [ ] Implementar autenticação de usuários
- [ ] Adicionar relatórios e estatísticas avançadas
- [ ] Exportação de dados em PDF
- [ ] Agendamento de consultas
- [ ] Histórico de alterações em prontuários
- [ ] Backup automático
- [ ] Notificações
- [ ] App mobile nativo
- [ ] Filtros avançados na listagem de prontuários
- [ ] Dashboard com gráficos interativos

## 🆕 Atualizações Recentes (v2.0)

### ✨ Novas Funcionalidades
- **Edição de Prontuários**: Agora é possível editar prontuários existentes
- **Navegação Integrada**: Menu padronizado em todas as páginas
- **Interface Aprimorada**: Melhor fluxo de navegação entre pacientes e prontuários

### 🔧 Melhorias Técnicas
- Novo endpoint PUT para atualização de prontuários
- Script JavaScript dedicado para edição (`editar-prontuario.js`)
- Validação aprimorada de formulários
- Tratamento robusto de erros
- Feedback visual com toasts de sucesso/erro

### 🎨 Melhorias de UX/UI
- Menu de navegação consistente em todas as páginas
- Botões "Voltar" inteligentes que retornam ao contexto anterior
- Informações do paciente visíveis durante edição de prontuários
- Loading states e feedback visual aprimorados

## 👥 Contribuição

Este projeto foi desenvolvido especificamente para auxiliar estudantes de medicina em estágios na UBS de Mauá. Sugestões e melhorias são bem-vindas!

## 📄 Licença

Projeto desenvolvido para fins educacionais e de apoio à saúde pública.

---

**Desenvolvido com ❤️ para a UBS Mauá - SP**