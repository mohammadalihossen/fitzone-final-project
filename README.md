# 💪 FitZone — Premium Fitness eCommerce Platform

> Bangladesh's #1 fitness equipment store built with the MERN stack (MongoDB, Express, Next.js, Node.js)

---

## 🎯 Features

### Customer
- 🏠 Dynamic home page with hero banner, categories, featured & trending products
- 🛍️ Product listing with advanced filters (category, brand, price, search, sort)
- 📦 Product detail page with image gallery, specs, reviews, stock status
- 🛒 Cart with quantity management, bulk handling, shipping calculation
- ✅ Checkout with address form, multiple payment methods (COD, bKash, Nagad, Card)
- 👤 Customer dashboard: orders, wishlist, profile settings
- 📋 Order detail with live status tracker and cancel option

### Admin
- 📊 Analytics dashboard: revenue, low stock alerts, top products, order breakdown
- 🗂️ Product management: create, edit, delete, bulk upload with image support
- 📬 Order management: view all orders, update status inline with expandable rows
- 👥 User management: view customers, activate/suspend accounts

### Security & Performance
- 🔐 JWT authentication with role-based access control
- 🔒 Password hashing with bcrypt
- ⚡ Rate limiting (100 req/15min)
- 🚀 Optimized MongoDB queries with indexes
- 📱 Fully responsive dark-theme UI

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js 14, Tailwind CSS, Zustand   |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB Atlas (Mongoose ODM)        |
| Auth      | JWT (JSON Web Tokens)               |
| State     | Zustand (cart + auth persistence)   |
| UI Icons  | React Icons                         |
| Toasts    | React Hot Toast                     |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

---

### 1️⃣ Clone & Setup

```bash
git clone <your-repo-url>
cd fitzone
```

---

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/fitzone
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

```bash
# Seed the database with sample products, admin & customer accounts
npm run seed

# Start the development server
npm run dev
```

Backend runs on → **http://localhost:5000**

---

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
# Start the development server
npm run dev
```

Frontend runs on → **http://localhost:3000**

---

## 🌱 Seed Data

After running `npm run seed` in the backend:

| Role     | Email                      | Password      |
|----------|----------------------------|---------------|
| Admin    | admin@fitzone.com          | admin123456   |
| Customer | customer@fitzone.com       | customer123   |

**12 sample products** across all categories will be created.

---

## 📁 Project Structure

```
fitzone/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── admin.controller.js
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.model.js
│   │   │   ├── Product.model.js
│   │   │   └── Order.model.js
│   │   ├── routes/             # Express routers
│   │   ├── middlewares/        # JWT auth, admin guard
│   │   ├── utils/              # Seed script
│   │   └── server.js           # App entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── page.js             # Home page
    │   ├── products/           # Product list + detail
    │   ├── cart/               # Shopping cart
    │   ├── checkout/           # Order placement
    │   ├── auth/               # Login + Register
    │   ├── dashboard/          # Customer dashboard
    │   └── admin/              # Admin panel
    ├── components/
    │   ├── layout/             # Navbar, Footer
    │   └── product/            # ProductCard, ProductForm
    ├── services/
    │   └── api.js              # Axios API client
    ├── store/
    │   ├── authStore.js        # Zustand auth state
    │   └── cartStore.js        # Zustand cart state
    └── package.json
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint                  | Access  |
|--------|---------------------------|---------|
| POST   | /api/auth/register        | Public  |
| POST   | /api/auth/login           | Public  |
| GET    | /api/auth/me              | Private |
| PUT    | /api/auth/profile         | Private |
| PUT    | /api/auth/change-password | Private |

### Products
| Method | Endpoint                  | Access  |
|--------|---------------------------|---------|
| GET    | /api/products             | Public  |
| GET    | /api/products/:id         | Public  |
| POST   | /api/products             | Admin   |
| PUT    | /api/products/:id         | Admin   |
| DELETE | /api/products/:id         | Admin   |
| POST   | /api/products/bulk        | Admin   |
| POST   | /api/products/:id/reviews | Private |

### Orders
| Method | Endpoint                  | Access  |
|--------|---------------------------|---------|
| POST   | /api/orders               | Private |
| GET    | /api/orders/user          | Private |
| GET    | /api/orders/:id           | Private |
| PUT    | /api/orders/:id/cancel    | Private |
| GET    | /api/orders               | Admin   |
| PUT    | /api/orders/:id/status    | Admin   |

### Admin
| Method | Endpoint                       | Access |
|--------|--------------------------------|--------|
| GET    | /api/admin/analytics           | Admin  |
| GET    | /api/admin/users               | Admin  |
| PUT    | /api/admin/users/:id/toggle    | Admin  |

---

## 🎨 Design System

- **Color**: Dark (`#0A0A0A`) + Neon Green (`#C8FF00`)
- **Typography**: Barlow Condensed (headings) + Inter (body)
- **Components**: Sharp corners (no border-radius), minimal borders
- **Theme**: High-contrast dark theme inspired by premium fitness brands

---

## 🚢 Production Deployment

### Backend (Railway / Render / VPS)
```bash
npm start
# Set NODE_ENV=production in your hosting environment
```

### Frontend (Vercel — recommended for Next.js)
```bash
npm run build
# Set NEXT_PUBLIC_API_URL to your backend URL
```

---

## 📝 MongoDB Collections

After seeding, your MongoDB Atlas database `fitzone` will have:
- `users` — Customer & admin accounts
- `products` — Fitness equipment catalog
- `orders` — Purchase records with status history

All collections have **indexes** configured for optimal query performance.

---

Built with 💪 by FitZone Dev Team
