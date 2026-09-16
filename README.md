# Sistema de Agendamento de Clínica

Este repositório contém a solução para o desafio técnico de desenvolvimento de um sistema de agendamento de consultas. O projeto foi construído utilizando uma arquitetura moderna dividida entre Frontend (SPA) e Backend (API REST), com integração contínua (CI), testes automatizados e banco de dados containerizado.

## Tecnologias Utilizadas

**Frontend:**
- React + Vite
- TypeScript
- Tailwind CSS (v4)
- Axios
- Vitest & Testing Library (Testes unitários e de integração)

**Backend:**
- Node.js
- Express
- Prisma ORM
- PostgreSQL (Docker)
- Jest (Testes)

**Infraestrutura & DevOps:**
- Docker & Docker Compose
- GitHub Actions (Pipeline de CI Fullstack)

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- Docker e Docker Compose
- NVM (Node Version Manager) para gerenciar a versão do Node.js
- Git

---

## Passo a Passo para Executar Localmente

### 1. Clone o repositório
```bash
git clone https://github.com/pkbceira03/desafio-agendamento-clinica.git
cd desafio-agendamento-clinica
```

### 2. Suba o Banco de Dados (Docker)
A aplicação utiliza o PostgreSQL. Para subir o banco de dados via container, execute na raiz do projeto:
```bash
docker compose up -d
```

### 3. Rodando o Backend
Abra um terminal, acesse a pasta do backend e configure o ambiente:

```bash
cd Backend

# 1. Garanta que está usando a versão correta do Node (via nvm)
nvm use

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Copie o arquivo .env.example para .env e ajuste se necessário
cp .env.example .env

# 4. Execute as migrations do Prisma para criar as tabelas no banco
npx prisma migrate dev

# 5. Inicie o servidor
npm run dev
```
> A API estará rodando em http://localhost:3000 (ou na porta configurada no seu .env).

### 4. Rodando o Frontend
Abra um novo terminal, acesse a pasta do frontend e inicie a interface:

```bash
cd frontend

# 1. Garanta que está usando a versão correta do Node (via nvm)
nvm use

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Copie o arquivo .env.example para .env
cp .env.example .env

# 4. Inicie a aplicação
npm run dev
```
> O Frontend estará rodando em http://localhost:5173.

---

## Como rodar os Testes

O projeto conta com suítes de testes automatizados para garantir a estabilidade das regras de negócio e componentes.

**Testes do Backend:**
```bash
cd Backend
npm run test
```

**Testes do Frontend:**
```bash
cd frontend
npm run test
```

## Integração Contínua (CI)
Este repositório possui uma pipeline configurada no GitHub Actions (.github/workflows/ci.yml). A cada Pull Request para a branch main, são executados automaticamente (em paralelo) a instalação de dependências, os testes do frontend, testes do backend (com container efêmero do Postgres) e o build da aplicação, garantindo que o código integrado esteja sempre funcional.
