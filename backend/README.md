# Online Medicine Shop - Backend

Node.js + Express + Prisma backend for the existing frontend in `frontend/`.

## Stack
- **Backend**: Node.js, Express
- **Auth**: JWT, bcrypt.js
- **DB**: Prisma ORM with SQLite by default (or PostgreSQL)

## File structure
```
backend/
  prisma/
    schema.prisma
  src/
    config/
      prisma.js
    controllers/
      auth.controller.js
      products.controller.js
      users.controller.js
      cart.controller.js
      orders.controller.js
    middleware/
      auth.js
      errorHandler.js
    routes/
      index.js
      auth.routes.js
      products.routes.js
      users.routes.js
      cart.routes.js
      orders.routes.js
    server.js
  package.json
  .env.example
  README.md
```

## Environment
Copy `.env.example` to `.env` and adjust:
```
PORT=4000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:5500
DATABASE_URL="file:./dev.db" # or your PostgreSQL URL
JWT_SECRET=replace_with_random_secret
```

If you use PostgreSQL, set `DATABASE_URL` to a valid connection string.

## Install & Run
```bash
# from backend/
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```
API at: `http://localhost:4000`

## API Overview
Base path: `/api`

- **Auth** (`/api/auth`)
  - POST `/register` { email, username, password }
  - POST `/login` { email, password } → { token }

- **Users** (`/api/users`)
  - GET `/me` (JWT)
  - PUT `/me` (JWT) { username?, address?, phone? }

- **Products** (`/api/products`)
  - GET `/` (optional `?q=search`)
  - GET `/:id`

- **Cart** (`/api/cart`)
  - GET `/` (JWT)
  - POST `/` (JWT) { productId, quantity }
  - DELETE `/:itemId` (JWT)
  - PUT `/:itemId` (JWT) { quantity }

- **Orders** (`/api/orders`)
  - POST `/` (JWT) Create from cart (clears cart)
  - GET `/` (JWT)
  - GET `/:id` (JWT)

## Frontend Integration
- Enable CORS: already configured via `CORS_ORIGINS`.
- Example login with fetch:
```js
async function login(email, password) {
  const res = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
  } else {
    throw new Error(data.message || 'Login failed');
  }
}
```
- Attach JWT to protected requests:
```js
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchCart() {
  const res = await fetch('http://localhost:4000/api/cart', {
    headers: { ...authHeaders() }
  });
  return res.json();
}
```

## Seeding Products (optional)
Use Prisma Studio or a quick script to add products. Example using Studio:
```bash
npm run prisma:studio
```

## Notes
- Passwords are hashed with bcrypt.
- JWT expires in 7 days.
- Orders lock product name/price at purchase time.
- Cart is per-user (auto-created on registration / first use).
