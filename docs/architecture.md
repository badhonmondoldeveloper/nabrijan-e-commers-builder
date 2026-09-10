# System Architecture Documentation

## Overview
Nabrijan E-Commerce SaaS is structured around modular, full-stack separation of concerns within Next.js App Router.

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App Router                      │
├──────────────┬──────────────┬───────────────┬───────────────┤
│  Marketing   │  Dashboard   │  Super Admin  │  Storefront   │
│ (SaaS Front) │  (Merchant)  │ (Platform Ops)│ (Customer UI) │
└──────┬───────┴──────┬───────┴───────┬───────┴───────┬───────┘
       │              │               │               │
┌──────▼──────────────▼───────────────▼───────────────▼───────┐
│                      Service & RBAC Layer                   │
├─────────────────────────────────────────────────────────────┤
│   Tenant Context / Auth Cookies / Zod Validation / Security │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Repository / Prisma ORM                  │
├─────────────────────────────────────────────────────────────┤
│                 PostgreSQL Multi-Tenant DB                  │
└─────────────────────────────────────────────────────────────┘
```

## Key Extension Points
- **Payment Gateway Interface**: `PaymentProvider` interface in `src/lib/payments/zinipay.ts` allows swapping or extending gateways without refactoring billing logic.
- **Dynamic Theme Section Blueprint**: New theme components can be registered under `ThemeSection` types (`HERO`, `FEATURED_PRODUCTS`, `BENEFITS`, `REVIEWS`, `NEWSLETTER`).
- **Granular RBAC**: Staff role permissions are verified at the server API layer via `verifyStoreAccess()`.
