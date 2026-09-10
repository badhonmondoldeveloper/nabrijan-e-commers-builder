# Nabrijan E-Commerce SaaS Platform

Production-grade, multi-tenant E-commerce SaaS platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **MySQL/PostgreSQL**, and **Prisma ORM**.

---

## 🌟 Platform Vision & Core Architecture

Nabrijan E-Commerce SaaS is **NOT** a Daraz/AliExpress multi-seller marketplace. It is a **SaaS platform** where merchants subscribe to plans and launch independent single-vendor e-commerce stores.

```
ONE PLATFORM
↓
MULTIPLE MERCHANTS
↓
EACH MERCHANT CAN CREATE ONE OR MORE STORES (DEPENDING ON SUBSCRIPTION)
↓
EACH STORE IS AN ISOLATED SINGLE-VENDOR E-COMMERCE BUSINESS
```

Each store owns its isolated:
- Products & Variants
- Categories & Brands
- Customers & Orders
- Real-time Inventory & Audit Logs
- Offers & Discount Coupons
- Dynamic Theme Settings & Visual Editor
- COD Checkout Engine & Bangladesh Shipping Configuration

---

## 💳 Payment Gateway Architecture

### 1. Platform SaaS Billing Gateway (ZiniPay Active)
Unified payment provider abstraction (`PaymentProvider` interface: `createPayment`, `verifyPayment`, `handleWebhook`, `refundPayment`) supporting **ZiniPay** for platform subscriptions, template purchases, and future add-ons. Includes mandatory server-side verification and audit trails.

### 2. Store Customer Checkout Gateway (Cash on Delivery Only)
Store customer checkout defaults strictly to **Cash on Delivery (COD)** for V1, with an extensible payment method architecture ready for future gateways.

---

## 🛠 Local Setup & Running Commands

### Prerequisites
- Node.js 18+
- MySQL or PostgreSQL database running locally or accessible via URL

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `DATABASE_URL` in `.env` is configured correctly:
```env
DATABASE_URL="mysql://username:password@localhost:3306/nabrijan_db"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Migration & Prisma Generation
```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Development Data
```bash
npm run prisma:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Development Seed Accounts

| Role | Email | Password | Access Path |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@platform.com` | `admin123456` | `/admin` |
| **Demo Merchant** | `merchant@example.com` | `merchant123456` | `/dashboard` |
| **Demo Storefront** | Public Store | N/A | `/store/nabrijan-fashion` |

---

## 🏗 Key Route Architecture

| Route | Purpose |
| :--- | :--- |
| `/` | Platform Marketing Landing Page |
| `/login` | Merchant & Super Admin Login |
| `/register` | Merchant Registration |
| `/dashboard/onboarding` | Step-by-Step Store Creation Wizard |
| `/dashboard` | Merchant SaaS Root & Store Switcher |
| `/dashboard/stores/[storeId]` | Store Admin Dashboard Overview & KPIs |
| `/dashboard/stores/[storeId]/products` | Products Catalog Management |
| `/dashboard/stores/[storeId]/orders` | Cash on Delivery Orders Tracker & Status Updater |
| `/dashboard/stores/[storeId]/builder` | Visual Theme Builder with Viewport Frames |
| `/dashboard/billing` | SaaS Subscription Upgrades via ZiniPay |
| `/admin` | Platform Super Admin Operations Dashboard |
| `/store/[slug]` | Dynamic Merchant Storefront |
| `/checkout/[slug]` | Mobile-First Customer Cash on Delivery Checkout |

---

## 📄 Documentation Index
Detailed technical documentation is available under `docs/`:
- [`docs/architecture.md`](docs/architecture.md)
- [`docs/database.md`](docs/database.md)
- [`docs/payments.md`](docs/payments.md)
- [`docs/tenancy.md`](docs/tenancy.md)
- [`docs/themes.md`](docs/themes.md)
- [`docs/security.md`](docs/security.md)

---

## 🚀 cPanel Deployment

This project is a Node.js + Prisma app and is designed to run on a cPanel Node app with a MySQL database.

### Production variables
```env
DATABASE_URL="mysql://username:password@localhost:3306/nabrijan_db"
JWT_SECRET="your-long-random-secret"
AUTH_SECRET="your-long-random-secret"
NEXT_PUBLIC_APP_URL="https://nabrijan.site"
APP_URL="https://nabrijan.site"
ZINIPAY_API_KEY="..."
ZINIPAY_SECRET_KEY="..."
ZINIPAY_BASE_URL="https://api.zinipay.com/v1"
ZINIPAY_WEBHOOK_SECRET="..."
ZINIPAY_MERCHANT_ID="..."
ENABLE_ZINIPAY=true
ENABLE_MANUAL_PAYMENT=false
ENABLE_BKASH=false
ENABLE_NAGAD=false
ENABLE_AI=false
ENABLE_APP_MARKETPLACE=false
ENABLE_CUSTOM_DOMAIN=true
```

### Start command
```bash
npm start
```

This project includes a small server wrapper at `server.js` so it works correctly in cPanel’s Node app environment.
