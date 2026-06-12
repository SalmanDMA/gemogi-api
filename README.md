# 🚀 Gemogi Blueprint Commerce API

A robust, production-grade digital voucher & top-up marketplace API built with NestJS. Designed with high-performance standards, asynchronous queues, and clean domain boundaries to handle digital voucher sales seamlessly.

---

## ✨ Key Features

- 💼 **Voucher Catalog Management** – CRUD endpoints for 26+ curated digital vouchers (Game, Streaming, Phone Credit).
- 🔐 **Secure Authentication** – JWT-based authentication featuring Access and Refresh token lifecycles with Role-Based Access Control (RBAC).
- 🛍️ **Secure Checkout & Transactions** – Operational order creation flow with validation constraints (ensures vouchers are active before payment).
- ⚙️ **Asynchronous Queues** – Process-heavy order state modifications and callback handling using Redis and BullMQ.
- 🔗 **Webhook Integrations** – Mock webhook callback receiver (`/api/webhook/order-callback`) to simulate payment gateway status updates.
- 🏥 **Comprehensive Health Check** – `/health` endpoint exposing database status, Redis status, and full server specifications (CPU, RAM, uptime, platform).
- 📖 **Self-Documenting API** – Complete interactive OpenAPI/Swagger documentation with JWT auth support, typed responses, and parameter descriptions.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Language** | TypeScript (Node.js 20+) |
| **Framework** | [NestJS 11](https://nestjs.com/) |
| **Database** | MySQL with [TypeORM](https://typeorm.io/) |
| **Queue / Cache** | Redis with [BullMQ](https://bullmq.io/) |
| **Authentication** | JWT (Access + Refresh Token) with RBAC |
| **Documentation** | [Swagger / OpenAPI 3.0](https://swagger.io/) (`@nestjs/swagger`) |
| **Validation** | Class Validator & Class Transformer |
| **Deployment** | [Railway](https://railway.app/) (Nixpacks) |

---

## 🌐 Live Endpoints

| Resource | URL |
|---|---|
| **API Base** | `https://gemogi-api-production.up.railway.app/api` |
| **Swagger Docs** | `https://gemogi-api-production.up.railway.app/api/docs` |
| **Health Check** | `https://gemogi-api-production.up.railway.app/health` |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MySQL instance (local or remote)
- Redis instance (local or remote)

### Installation

1. **Clone & Install**

   ```bash
   git clone https://github.com/SalmanDMA/gemogi-api.git
   cd gemogi-api
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

   **.env for local development:**
   ```env
   NODE_ENV=local
   PORT=3001

   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=
   DB_DATABASE=gemogi_db

   REDIS_HOST=localhost
   REDIS_PORT=6379
   # REDIS_PASSWORD=your_redis_password   # Only if your Redis requires auth

   JWT_ACCESS_SECRET=gemogi_access_secret_local_key_32chars
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=gemogi_refresh_secret_local_key_32chars
   JWT_REFRESH_EXPIRES_IN=7d

   CALLBACK_URL=http://localhost:3001/api/webhook/order-callback
   CORS_ORIGINS=http://localhost:3000
   ```

   > **For Railway deployment**, set `DATABASE_URL` and `REDIS_URL` as environment variables in the Railway dashboard instead.

3. **Database Seeding**

   Run the seed script to automatically sync database tables and populate 26+ products and dummy accounts:

   ```bash
   npm run seed
   ```

4. **Run the Application**

   ```bash
   # Development (watch mode)
   npm run start:dev

   # Production Build & Start
   npm run build
   npm run start:prod
   ```

   The API will be available at:
   - API: `http://localhost:3001/api`
   - Swagger Docs: `http://localhost:3001/api/docs`
   - Health: `http://localhost:3001/health`

5. **Generate Static Swagger JSON** _(optional)_

   ```bash
   npm run swagger:generate
   # Outputs swagger.json to the project root
   ```

---

## 👤 Seed / Dummy Users

After running `npm run seed`, the following accounts are available for testing:

| Role | Name | Email | Password |
|---|---|---|---|
| **Admin** | Admin Gemogi | `admin@gemogi.com` | `Password123` |
| **User** | User Gemogi | `user@gemogi.com` | `Password123` |

> **Admin** can create and update products.  
> **User** can browse products and place orders.

Use these credentials with the `POST /api/auth/login` endpoint to obtain JWT access and refresh tokens.

---

## 📦 API Overview

| Module | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| **Auth** | POST | `/api/auth/register` | Public | Register a new user |
| | POST | `/api/auth/login` | Public | Login and get tokens |
| | POST | `/api/auth/refresh` | Bearer | Refresh access token |
| | POST | `/api/auth/logout` | Bearer | Invalidate refresh token |
| | GET | `/api/auth/me` | Bearer | Get current user profile |
| | PUT | `/api/auth/profile` | Bearer | Update profile |
| **Products** | GET | `/api/products` | Public | List products (paginated, filterable) |
| | GET | `/api/products/:id` | Public | Get product detail |
| | POST | `/api/products` | Admin | Create new product |
| | PATCH | `/api/products/:id` | Admin | Update product |
| | POST | `/api/products/contact` | Public | Submit contact message |
| **Orders** | POST | `/api/orders` | Bearer | Create new order |
| | GET | `/api/orders` | Bearer | List user's orders |
| | GET | `/api/orders/:id` | Bearer | Get order detail |
| **Webhook** | POST | `/api/webhook/order-callback` | Public | Receive payment callback |
| | GET | `/api/webhook/logs` | Bearer | View webhook logs |
| **Health** | GET | `/health` | Public | System health & server specs |

For full request/response schemas, see the **[Swagger Docs](https://gemogi-api-production.up.railway.app/api/docs)**.

---

## 🏥 Health Check Response

The `/health` endpoint returns database status, Redis status, and complete server specifications:

```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" }
  },
  "system": {
    "nodeVersion": "v20.20.2",
    "platform": "linux",
    "arch": "x64",
    "cpuModel": "Intel Xeon",
    "cpuCores": 2,
    "memory": {
      "totalGb": "3.84 GB",
      "freeGb": "1.20 GB",
      "processRssMb": "95.40 MB"
    },
    "uptime": {
      "system": "0d 2h 15m 30s",
      "process": "0d 0h 5m 10s"
    },
    "environment": "production"
  }
}
```

---

## 👨‍💻 About Me

**Salman Dwi Maulana Akbar**  
_Fullstack Developer_

- 🌐 **Portfolio:** [bit.ly/my-portofolio-salmandma](https://bit.ly/my-portofolio-salmandma)
- 💼 **LinkedIn:** [linkedin.com/in/salmandma](https://www.linkedin.com/in/salmandma/)
- 🐙 **GitHub:** [github.com/SalmanDMA](https://github.com/SalmanDMA)
