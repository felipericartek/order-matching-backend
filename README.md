# 🪙 Order Matching System - Backend

API de Matching de Ordens BTC/USD — Node.js + Express + TypeORM + Redis 🚀

---

## 📚 Sobre o Backend

- API responsável por login, criação de ordens, matching automático e estatísticas de negociação.
- Comunicação em tempo real via **Socket.IO**.
- Fila de processamento assíncrona com **Redis + BullMQ**.
- Banco de dados relacional com **MySQL**.

---

## 🛠️ Tecnologias

- Node.js + Express
- TypeScript
- MySQL + TypeORM
- Redis + BullMQ
- JWT (Autenticação)
- Socket.IO (Realtime)
- Dockerfile para deploy

---

## ⚙️ Como Rodar Localmente

### 1. Instale as dependências:

```bash
npm install

Rode o servidor em modo desenvolvimento:

npm run dev

Ou via Docker Compose (recomendado):

docker-compose up --build

🔥 Principais Endpoints
POST /api/auth/login → Login (gera token)

POST /api/orders → Criar nova ordem

GET /api/orders/active → Buscar ordens ativas

GET /api/orders/history → Buscar histórico de ordens

DELETE /api/orders/:id → Cancelar ordem

GET /api/statistics → Estatísticas globais

GET /api/orderbook → Livro de ofertas

GET /api/matches → Histórico de negociações

🚀 Deploy Backend (Render/Railway)
Configure as variáveis de ambiente:

JWT_SECRET

DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE

REDIS_HOST, REDIS_PORT

Banco de dados MySQL e Redis podem ser instanciados na mesma plataforma.

O backend é configurado para funcionar com Dockerfile próprio.

