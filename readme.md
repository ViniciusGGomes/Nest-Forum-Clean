# 🚀 NestJS Clean Architecture Forum API

Uma API RESTful robusta para um sistema de Fórum (Perguntas e Respostas), desenvolvida com **Node.js** e **NestJS**. Este projeto foi construído aplicando rigorosamente os conceitos de **Clean Architecture** e **Domain-Driven Design (DDD)**, visando o desacoplamento total entre as regras de negócio e as tecnologias de infraestrutura.


### Diagrama da Arquitetura 
<img width="1910" height="946" alt="Image" src="https://github.com/user-attachments/assets/c9f7d7c2-457a-4e9d-82b4-3eca01c45f7c" />

## 🧠 Arquitetura e Estratégia de Desenvolvimento

O desenvolvimento foi dividido em duas fases principais para garantir que o núcleo da aplicação (Domínio) não dependesse de frameworks ou bibliotecas externas.

### 🔴🟡 Fase 1: O Domain (application e enterpise )
https://github.com/ViniciusGGomes/DDD-CleanArchitecture-Forum

Esta fase engloba os círculos internos da arquitetura (vermelha e amarela no diagrama), contendo as regras de negócio puras.

* **Enterprise (Entidades):** Modelagem rica do domínio do fórum, incluindo agregados e entidades de valor (`Question`, `Answer`, `Comment`, `Notification`).
* **Application (Casos de Uso):** Regras de orquestração da aplicação, onde os fluxos de negócio acontecem de fato.
* **Contratos (Interfaces):** Aplicação do Princípio da Inversão de Dependência (SOLID) definindo "portas" (interfaces) para Repositórios, Uploader de arquivos, Cache e Criptografia.
* **Domain Events:** Implementação de um sistema de mensageria interna e reativa (Pub/Sub) para lidar com efeitos colaterais. *Exemplo: Disparar a criação de uma notificação automaticamente quando uma resposta for marcada como a melhor.*

### 🔵🟢 Fase 2: A infra (Frameworks / Drivers e Interface adapters)
Nesta fase, as tecnologias externas (círculos azul e verde) foram plugadas na aplicação, respeitando os contratos definidos na Fase 1.

* **Framework (NestJS):** Utilizado primariamente como um contêiner de Injeção de Dependências (DI) e roteador HTTP, mantendo as camadas desacopladas através de módulos.
* **Camada HTTP (Controllers & Presenters):** Responsável por receber as requisições e formatar os dados de saída das entidades ricas para objetos literais (JSON) que o frontend compreende.
* **Banco de Dados & Mappers:** Integração com **PostgreSQL** utilizando o **Prisma ORM**. A persistência é feita através do padrão *Repository*, e os *Mappers* fazem a tradução bidirecional entre as entidades do Prisma e as entidades do Domínio.
* **Cache:** Implementação de uma camada de cache de alta performance utilizando **Redis** para otimizar consultas frequentes (ex: detalhes de uma pergunta).
* **Storage:** Upload de anexos integrado ao **Cloudflare R2** (API compatível com Amazon S3).
* **Segurança e Autenticação:** Implementação de JWT (JSON Web Tokens) e hash de senhas utilizando `bcrypt` e `passport`.

## 🧪 Testes e Qualidade

O projeto possui uma suíte de testes robusta para garantir a confiabilidade das rotas HTTP, persistência de dados e eventos de domínio, com forte foco no isolamento do ambiente:

* **Variáveis de Ambiente para Testes (`.env.test`):** Utilização do `dotenv` com `override: true` no setup E2E. Isso garante que a suíte de testes sobrescreva as variáveis globais, rodando em um ambiente totalmente isolado (ex: utilizando o banco `REDIS_DB=1` para não afetar o cache de desenvolvimento).
* **Bancos de Dados Dinâmicos:** Configuração customizada no Vitest (`setup-e2e.ts`) para gerar um `schema` de banco de dados Postgres exclusivo com UUID a cada execução, deletando-o ao final. O banco do Redis também recebe um `flushdb()` antes de rodar a suíte.
* **Storage Efêmero (Cloudflare R2):** Configuração de um bucket exclusivo para testes (`forum-nest-clean-test`). Diretamente na Cloudflare, foi configurada uma *Lifecycle Rule* que deleta todos os objetos armazenados após 24 horas, evitando acúmulo de arquivos "lixo" e custos desnecessários gerados pelos uploads automatizados.
* **Testes E2E (Ponta a Ponta):** Validação completa dos fluxos, usando Vitest e Supertest.
* **Design Pattern Factory:** Criação de *Factories* para facilitar a geração de entidades complexas e popular massa de dados durante os testes utilizando `@faker-js/faker`.
* **Desativação de Eventos em Testes:** Controle de execução através da flag `DomainEvents.shouldRun = false` no setup E2E para evitar side-effects indesejados (como envio de notificações reais) durante testes específicos de persistência.

## 🛠️ Tecnologias Utilizadas

* **Linguagem:** TypeScript
* **Framework Backend:** NestJS
* **Banco de Dados Relacional:** PostgreSQL
* **ORM:** Prisma
* **Cache:** Redis / `ioredis`
* **Storage (S3-compatible):** Cloudflare R2 / `@aws-sdk/client-s3`
* **Testes:** Vitest / Supertest
* **Autenticação:** JWT / Passport / bcryptjs
* **Validação:** Zod
* **Infraestrutura Local:** Docker & Docker Compose

## 🚀 Como Executar o Projeto

1. Clone o repositório.
2. Instale as dependências: `pnpm install`
3. Copie o arquivo `.env.example` para `.env` e preencha as credenciais.
4. Suba a infraestrutura local (Postgres e Redis): `docker-compose up -d`
5. Execute as migrations do banco de dados: `pnpm prisma migrate dev`
6. Inicie o servidor em ambiente de desenvolvimento: `pnpm run start:dev`

