# 🚀 Nest Clean API / Primeira etapa

Projeto API em **NestJS** com autenticação JWT (RS256), PostgreSQL via Docker, Prisma ORM e testes E2E com banco isolado.

---

## 🐳 Docker + PostgreSQL

- Banco configurado com **Docker**
- Container PostgreSQL via `docker-compose`
- Ambiente isolado
- Padronização do ambiente de desenvolvimento

---

## 🗄 Prisma ORM

- Prisma configurado para conectar ao PostgreSQL
- `schema.prisma` com os models
- Migrations geradas
- Criação do `PrismaService`
- Registrado no `AppModule` para injeção de dependência

Permite que os controllers acessem o banco via Prisma.

---

## 🌎 Variáveis de Ambiente

- Configurado `@nestjs/config`
- Validação das variáveis
- `ConfigModule` como global
- Variáveis acessíveis em qualquer parte da aplicação
- Exemplo: uso no `main.ts`

---

## 🔐 Autenticação (JWT RS256)

- Rota de autenticação gera token **JWT RS256**
- Assinatura com chave privada
- Validação com chave pública
- Estratégia JWT configurada
- Guard protege rotas autenticadas

Usuário autenticado recebe um token e precisa enviá-lo para acessar rotas protegidas.

---

## 📌 Rotas

### 1️⃣ Criar usuário

`POST /account`

- Criação de conta
- Hash de senha com bcrypt
- Validação com Zod

---

### 2️⃣ Autenticar usuário

`POST /sessions`

- Validação de credenciais
- Geração do JWT

---

### 3️⃣ Criar pergunta

`POST /questions`

- Rota protegida
- Pergunta vinculada ao usuário autenticado

---

### 4️⃣ Listar perguntas recentes

`GET /questions`

- Rota protegida
- Ordenação por data (desc)
- Paginação via query param

---

## 🧪 Testes E2E

- Testes End-to-End configurados
- Banco isolado para ambiente de teste
- Não afeta o banco principal

---

## ✅ Estrutura Atual

- Docker + PostgreSQL
- Prisma integrado ao Nest
- 4 controllers organizados
- JWT RS256 com rotas protegidas
- Variáveis de ambiente validadas
- Testes E2E com banco isolado
