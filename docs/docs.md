# Gerenciamento da Tenda

Aplicação web para gerenciamento de solicitações internas de materiais, permitindo que colaboradores registrem pedidos, enquanto administradores aprovam, controlam e finalizam as requisições. O sistema também oferece acompanhamento em tempo real do estoque, atualizando automaticamente as quantidades conforme as solicitações são finalizadas.

## Funcionalidades principais

### Usuário
 - Cadastro de solicitações
 - Histórico de suas solicitações
 - Filtros por status, material e descrição
 - Chatbot

 ### Administrador
 - Aprovação, recusa e finalização de solicitações
 - Histórico de todas as solicitações
 - Filtros por status, solicitante e material
 - Acompanhamento do estoque de materiais
 - Filtragem de materiais por ID, nome, categoria e status
 - Criação, edição e exclusão de itens do estoque
 - Gerenciamento da quantidade e níveis de estoque
 - Relatórios das solicitacões e estoque 

## Integrantes

- **Vitor de Oliveira Santos (Gerente de Projeto) -** Responsável pela coordenação geral do projeto, atuando no desenvolvimento do frontend, implementação do backend, modelagem e manutenção do banco de dados, além da integração entre os módulos da aplicação.
- **Murilo Machado Brandalezi —** Atuação no desenvolvimento do frontend, colaboração nos ajustes do backend e na estrutura do banco de dados. Responsável também pela criação de relatórios para a tela de administrador.
- **Daniel Fortunato Miranda -** Suporte no desenvolvimento do frontend e responsável pela concepção e implementação do chatbot integrado ao backend e à interface da aplicação.

**Observação:** As atividades principais foram distribuídas de forma colaborativa entre os integrantes, que trabalharam em conjunto na definição de requisitos, implementação das funcionalidades e testes. Cada membro também assumiu responsabilidades complementares de acordo com suas especialidades e disponibilidade.

## Tecnologias
- Frontend: Next.js, React, Bootstrap
- Backend: Node.js, Express
- Banco de dados: MySQL (scripts SQL em /backend/migrations)
- Autenticação: JWT
- Criptografia: bcryptjs
- Variáveis de ambiente: dotenv
- Dashboard: Chart.js

## Estrutura principal
- frontend/: aplicação Next.js (src/app, components, public)
- backend/: API Express (controllers, models, routes, config, migrations, middlewares)
- docs/: documentação (este arquivo)

## Pré-requisitos
- Node.js (v16+ recomendado)
- npm ou yarn
- MySQL (ou MariaDB)
- Git (opcional)

## Execução

1. Configurar banco de dados
   - Navegue até backend/migrations
   - Copie o script do arquivo 'dump_database.sql' e execute-o no seu MySQL Workbench

2. Backend
   - Abra o terminal:
     - cd .\backend\
     - npm install
   - Criar arquivo .env a partir de env.example:
     - copy env.example .env
     - Editar .env com as variáveis: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, PORT, OPENAI_API_KEY (crie a API key aqui: https://platform.openai.com/api-keys)
   - Iniciar:
     - npm start

3. Frontend
   - Abra outro terminal:
     - cd .\frontend\
     - npm install
     - npm run dev
   - Acesse: http://localhost:3000 (porta padrão Next.js)


## Guia de Login

### Usuário comum
- **Login 1:** 000000
- **Login 2:** 111111

### Administrador
- **Usuário 1:** 123456