# NABRIJAN — Phase 2 Production Audit & Gap Analysis

## Executive Summary
NABRIJAN has been established as a functional multi-tenant E-Commerce SaaS platform. This Phase 2 audit evaluates the codebase against production-grade requirements across security, multi-tenancy, authentication, billing idempotency, inventory transactions, dynamic storefronts, and UI/UX responsiveness.

---

## 1. Current Implementation State

### Working Features:
- **Next.js 14 App Router Architecture**: Clean separation between Marketing `(marketing)`, Auth `(auth)`, Merchant Dashboard `/dashboard`, Super Admin `/admin`, Storefront `/store/[slug]`, and COD Checkout `/checkout/[slug]`.
- **Database Schema**: Prisma schema covering Users, Sessions, Stores, Settings, Subscriptions, Plans, Payments, Products, ProductVariants, Categories, Brands, InventoryTransactions, Customers, Carts, Orders, OrderItems, OrderStatusHistory, ShippingZones, Coupons, Reviews, Themes, ThemeSections, Media, Staff, AuditLogs, and Domains.
- **Tenant Scope & RBAC**: Baseline `verifyStoreAccess()` utility ensuring store operations filter by `storeId`.
- **Cash on Delivery (COD) Engine**: Single-page mobile-first customer checkout with Bangladesh location selectors (Division/District/Area) and merchant estimated profit computation (`Revenue - Cost Price`).
- **Visual Theme Editor**: Split-screen live preview supporting Desktop, Tablet, and Mobile viewport frames.
- **ZiniPay Platform Payment Provider**: Abstraction layer implementing `PaymentProvider` interface with server-side verification.
- **Super Admin Dashboard**: SaaS MRR tracking, user/store directories, and subscription plan listings.

---

## 2. Identified Gaps & Risk Analysis (Priority Matrix)

### 🔴 P0 Critical (Security & Data Integrity)
1. **Database Transaction Wrapping for Orders & Inventory**:
   - *Current State*: Order creation and stock deduction run in separate sequential queries.
   - *Risk*: Concurrent order placement can cause race conditions and stock overselling.
   - *Action*: Wrap order creation, stock decrements, inventory transactions, and customer profile updates inside `db.$transaction()`.
2. **Comprehensive Cross-Tenant API Protection**:
   - *Current State*: Some API endpoints accept IDs directly from request bodies.
   - *Risk*: Potential IDOR vulnerabilities if tenant check is omitted on sub-resources.
   - *Action*: Enforce `verifyStoreAccess()` on EVERY protected API route handler (Products, Categories, Orders, Inventory, Coupons, Staff, Media, Theme Settings).
3. **Middleware Authentication Guard**:
   - *Current State*: Session check happens inside layout server components.
   - *Risk*: Unauthenticated requests could hit API endpoints if route handler fails to check session.
   - *Action*: Implement Next.js `middleware.ts` for centralized cookie token validation across `/dashboard/*`, `/admin/*`, and protected `/api/*` endpoints.

---

### 🟠 P1 High (Core SaaS & Commerce Features)
1. **ZiniPay Webhook Signature & Idempotency Table (`PaymentWebhookEvent`)**:
   - *Current State*: Webhook verification exists in helper class but lacks DB idempotency logging.
   - *Risk*: Duplicate gateway webhooks could trigger duplicate subscription renewals or invoice creations.
   - *Action*: Implement `PaymentWebhookEvent` table with unique constraint on `provider + externalEventId` and payload hash checking.
2. **Dynamic Theme Draft vs. Published Config**:
   - *Current State*: Theme builder edits live sections directly.
   - *Risk*: Merchant edits disrupt live customer storefront before publishing.
   - *Action*: Separate `draftConfig` and `publishedConfig` in `StoreThemeSettings`. Add "Publish Theme" action.
3. **Usage Metering Enforcement across All Mutations**:
   - *Current State*: `UsageService` exists but needs full integration into product creation, store wizard, and staff invitation routes.
   - *Action*: Call `UsageService` methods in `POST /api/stores/create`, `POST /api/stores/[storeId]/products`, and staff invitation routes.

---

### 🟡 P2 Medium (UI/UX Polish & Mobile Responsiveness)
1. **Toast Notifications & Loading Skeleton States**:
   - *Action*: Integrate Toast notification provider (`@radix-ui/react-toast`) for clear feedback on save, update, delete, and checkout actions.
2. **Mobile Table Card Responsiveness**:
   - *Action*: Ensure all admin/dashboard data tables convert to touch-friendly responsive cards on viewports `<640px`.
3. **Interactive Confirmation Modals**:
   - *Action*: Add confirmation dialogs before deleting products, updating order statuses, or cancelling subscriptions.

---

### 🟢 P3 Future (Scalability & Extensions)
1. **Object Storage & CDN Integration**:
   - Storage adapter interface allowing seamless transition from local disk storage to S3/Cloudflare R2 object storage.
2. **Multi-Currency & Regional Taxation**:
   - Advanced tax rate calculation engine per Bangladesh district/zone.

---

## 3. Action Plan for Phase 2 Implementation

1. **Next.js Middleware Setup**: Create `src/middleware.ts` for secure token inspection and route protection.
2. **Atomic DB Transactions**: Refactor `POST /api/checkout/create-order` to use `db.$transaction()`.
3. **Webhook Idempotency Logging**: Create `PaymentWebhookEvent` DB table and update `/api/billing/verify-payment` and webhook handlers.
4. **Theme Draft/Publish System**: Add draft vs published JSON attributes to `StoreThemeSettings`.
5. **Usage Service Integration**: Connect limit checks to API endpoints.
6. **Automated Security & Unit Test Suite**: Build `src/tests/all-security.test.ts` covering Auth, Multi-Tenancy, RBAC, Inventory Race Conditions, and Payment Idempotency.
7. **UI Polish & Toast Notifications**: Add toast alerts and responsive mobile layout refinements.
