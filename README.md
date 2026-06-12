# 🚀 Gemogi Blueprint Commerce API

A robust, production-grade digital voucher & top-up marketplace API built with NestJS. Designed with high-performance standards, asynchronous queues, and clean domain boundaries to handle digital voucher sales seamlessly.

---

## ✨ Key Features

- 💼 **Voucher Catalog Management** – CRUD endpoints for 26+ curated digital vouchers (Game, Streaming, Phone Credit).
- 🔐 **Secure Authentication** – JWT-based authentication featuring Access and Refresh token lifecycles with Role-Based Access Control (RBAC).
- 🛍️ **Secure Checkout & Transactions** – Operational order creation flow with validation constraints (ensures vouchers are active before payment).
- ⚙️ **Asynchronous Queues** – Process-heavy order state modifications and callback handling using Redis and BullMQ.
- 🔗 **Webhook Integrations** – Mock webhook callback receiver (`/api/webhook/order-callback`) to simulate payment gateway status updates.
- 📖 **Self-Documenting API** – Complete interactive OpenAPI documentation powered by Swagger.

---

## 🛠️ Tech Stack

- **Language:** Node.js (TypeScript)
- **Framework:** [NestJS 11](https://nestjs.com/)
- **Database:** MySQL with [TypeORM](https://typeorm.io/)
- **Queue System:** Redis with [BullMQ](https://bullmq.io/)
- **Documentation:** Swagger/OpenAPI
- **Validation:** Class Validator & Class Transformer

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MySQL Instance
- Redis Instance

### Installation

1. **Clone & Install**

   ```bash
   git clone https://github.com/SalmanDMA/gemogi-backend.git
   cd gemogi-backend
   npm install
   ```

2. **Environment Setup**
   _Create `.env` for local development or `.env.prod` for Railway production:_

   ```bash
   cp .env.example .env
   # Update your database, Redis, and JWT secrets in .env
   ```

3. **Database Synchronization & Seeding**
   _Run the database seed script to automatically sync tables and populate 26+ products and mock accounts:_

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

   _The API will be available at `http://localhost:3001`_  
   _Swagger API Documentation will be available at `http://localhost:3001/api/docs`_

---

## 👨‍💻 About Me

**Salman Dwi Maulana Akbar**  
_Fullstack Developer_

- 🌐 **Portfolio:** [bit.ly/my-portofolio-salmandma](https://bit.ly/my-portofolio-salmandma)
- 💼 **LinkedIn:** [linkedin.com/in/salmandma](https://www.linkedin.com/in/salmandma/)
- 🐙 **GitHub:** [github.com/SalmanDMA](https://github.com/SalmanDMA)
