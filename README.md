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
- ✅ Visualização detalhada do prontuário
- ✅ Edição de dados do paciente
- ✅ Exclusão de pacientes
- ✅ Busca por nome ou endereço

### Informações Coletadas
- **Dados Pessoais**: Nome, idade, data de nascimento, endereço
- **Atividade Física**: Frequência, tempo de atividade, locais de prática
- **Informações do Projeto**: Como soube do projeto, deslocamento, opinião sobre horários
- **Dados Médicos**: Histórico médico, evolução de saúde, pressão arterial, ausculta
- **Observações**: Campo livre para anotações adicionais

### Interface Responsiva
- 📱 Otimizado para dispositivos móveis (celulares e tablets)
- 💻 Funciona perfeitamente em desktops e notebooks
- 🖨️ Função de impressão de prontuários
- 🔍 Busca em tempo real

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

### 4. Visualizar Detalhes
- Clique no ícone "👁️" na lista de pacientes
- Visualize todas as informações do prontuário
- Use o botão "Imprimir" para gerar versão física
- Acesse "Editar" para modificar os dados

### 5. Editar Paciente
- Modifique os campos necessários
- Use "Restaurar Dados" para reverter alterações
- Clique em "Salvar Alterações" para confirmar

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
│   ├── Data/                     # Contexto do banco
│   ├── DTOs/                     # Data Transfer Objects
│   ├── Models/                   # Modelos de dados
│   └── Program.cs                # Configuração da aplicação
│
├── ProntuarioMedico.Web/         # Frontend
│   ├── js/                       # Scripts JavaScript
│   ├── index.html                # Dashboard principal
│   ├── pacientes.html            # Lista de pacientes
│   ├── novo-paciente.html        # Cadastro
│   ├── detalhes-paciente.html    # Visualização
│   ├── editar-paciente.html      # Edição
│   └── styles.css                # Estilos customizados
│
└── README.md                     # Este arquivo
```

## 🎯 Próximos Passos

- [ ] Implementar autenticação de usuários
- [ ] Adicionar relatórios e estatísticas
- [ ] Exportação de dados em PDF
- [ ] Agendamento de consultas
- [ ] Histórico de alterações
- [ ] Backup automático
- [ ] Notificações
- [ ] App mobile nativo

## 👥 Contribuição

Este projeto foi desenvolvido especificamente para auxiliar estudantes de medicina em estágios na UBS de Mauá. Sugestões e melhorias são bem-vindas!

## 📄 Licença

Projeto desenvolvido para fins educacionais e de apoio à saúde pública.

---

**Desenvolvido com ❤️ para a UBS Mauá - SP**