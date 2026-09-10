# 📋 NABRIJAN V4 REPOSITORY AUDIT REPORT

**Audit Date**: September 9, 2026  
**Auditor**: Lead Architect & Product Engineer  
**Scope**: Full codebase evaluation of NABRIJAN Multi-Tenant E-Commerce SaaS Platform (V1, V2, V3 implementation state analysis).

---

## 1. Executive Summary & Implemented Baseline

| Module | Version Baseline | Status | Implementation Details |
|---|---|---|---|
| **Multi-Tenant Engine** | V1 / V2 | **IMPLEMENTED** | Prisma-backed multi-tenant isolation via `storeId` foreign key and RBAC (`verifyStoreAccess`). |
| **Authentication & RBAC** | V1 | **IMPLEMENTED** | JWT session handling with `jose` + `bcryptjs`, session cookies, and Super Admin vs Merchant Store role verification (`OWNER`, `ADMIN`, `STAFF`). |
| **Subscription & Billing** | V2 | **IMPLEMENTED** | ZiniPay payment transaction flow, webhook signature validation, idempotency registry (`PaymentIdempotencyService`), and subscription plan limits (`UsageService`). |
| **Storefront & Visual Builder**| V2 | **IMPLEMENTED** | Dynamic storefront `/store/[slug]`, custom component builder `/dashboard/stores/[storeId]/builder`, visual theme presets, flash sales, customer product reviews. |
| **Courier Integrations** | V3 | **PARTIAL / ADAPTER** | Normalized consignment tracking (`CREATED`, `PICKED_UP`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`, `RETURNED`, `CANCELLED`, `FAILED`), Pathao & Steadfast adapters, idempotent webhook receivers. |
| **Customer Notifications** | V3 | **PARTIAL / ADAPTER** | `SmsService` with variable interpolation (`{{customerName}}`, `{{orderNumber}}`, `{{trackingCode}}`), DB template overrides, and `NotificationLog` history. |
| **AI Product Copywriter** | V3 | **MOCK / TEMPLATE** | Structured JSON copy output endpoint (`/api/stores/[storeId]/ai/generate-copy`) utilizing high-converting localized copy templates. |
| **Multi-Currency Engine** | V3 | **IMPLEMENTED** | BDT (৳ base), USD ($), EUR (€), GBP (£) formatting & conversion service (`CurrencyService`) with storefront switcher. |
| **Multi-Language Engine** | V3 | **IMPLEMENTED** | Bangla (`bn`) and English (`en`) dictionary translation engine (`I18nService`) with storefront switcher. |
| **Super Admin Hub** | V2 / V3 | **IMPLEMENTED** | Unified layout (`/admin`), overview stats, store directory, user directory, subscription manager, and V3 Integrations monitor (`/admin/integrations`). |

---

## 2. Comprehensive Audit Matrix

### A. V1 Core E-Commerce Architecture
- **Status**: **FULLY IMPLEMENTED**
- **Capabilities**:
  - Products, Variants, Attributes, Product Images, Categories, Brands.
  - Inventory Transactions (stock reservations, increment/decrement).
  - Orders, Order Items, Order Status History, COD Checkout (`/checkout/[slug]`).
  - Discount Coupons with usage limits.
  - Storefront product search, reviews, and ratings.

### B. V2 Multi-Tenant SaaS & Subscription Engine
- **Status**: **FULLY IMPLEMENTED**
- **Capabilities**:
  - Store memberships & RBAC roles.
  - Platform Plan limits (Store limit, Product limit, Staff limit, Storage limit).
  - ZiniPay Platform Billing with webhook idempotency.
  - Merchant Visual Theme Builder & Theme Preset Marketplace (`/templates`).
  - Super Admin management dashboard.

### C. V3 Automation & Global Commerce
- **Status**: **IMPLEMENTED / ADAPTER-BASED**
- **Capabilities**:
  - Courier dispatch modal & API for Pathao and Steadfast.
  - Idempotent webhook handlers for Pathao & Steadfast status sync.
  - Notification template manager & dispatch logger.
  - Currency conversion service and i18n translation service.
  - Merchant Integration Center (`/dashboard/stores/[storeId]/integrations`).

---

## 3. Detailed Audit Findings & Risk Analysis

### 1. Database & Schema Risks
- **Current State**: SQLite local database (`dev.db`) in Prisma schema.
- **Risk**: SQLite does not natively support enum types or concurrent write locks under heavy SaaS load.
- **V4 Requirement**: Ensure schema is fully compatible with PostgreSQL when deploying, utilizing explicit String-backed status columns and transactional isolation.

### 2. Subscription & Trial State Machine Risks
- **Current State**: `Subscription` status fields support basic strings (`TRIALING`, `ACTIVE`, `EXPIRED`).
- **Risk**: Trial dates are not backed by a dedicated server-side `Trial` lifecycle model with `TRIAL_WARNING`, `TRIAL_EXTENDED`, `TRIAL_EXPIRED`, or `CONVERTED` states.
- **V4 Requirement**: Build a dedicated, database-driven 7-Day Advanced Trial Engine with automated onboarding progress tracking (`Store Launch Checklist`) and server-side UTC timestamp evaluation.

### 3. Feature Gating & Entitlements
- **Current State**: Plan limits (`productLimit`, `storeLimit`) are checked imperatively inside specific routes via `UsageService`.
- **Risk**: Advanced features (AI Copywriter, Advanced Analytics, B2B Wholesale, Loyalty, Custom Domain) are not centrally gated using a declarative `PlanFeature` / `FeatureEntitlement` matrix.
- **V4 Requirement**: Build centralized entitlement checking service (`EntitlementService`) and upgrade modal UX (`FEATURE LOCKED`).

### 4. Customer Experience & Account System
- **Current State**: Customer checkout operates as guest COD checkout with phone number identification.
- **Risk**: Storefront customers lack a dedicated `/account` portal for tracking orders, managing wishlists, 1-click reordering, or submitting return requests.
- **V4 Requirement**: Implement Customer Account Portal (`/account`), Wishlist model, 1-Click Reorder flow, Returns & Refund engine, Loyalty points system, and Referral system.

### 5. Integration Provider Abstractions (AI, SMS, Courier)
- **Current State**: Provider logic is decoupled, but AI product copywriting operates on template generators, and SMS uses console/DB logging adapters.
- **Audit Flag**: **MOCK/ADAPTER STATE CONFIRMED**.
- **V4 Requirement**: Maintain strict provider abstraction interfaces (`SmsProvider`, `WhatsAppProvider`, `EmailProvider`, `AIProvider`) so real API credentials (e.g., Gemini API, HostSeba SMS, BulksmsBD) plug in seamlessly without code refactoring.

---

## 4. Architectural Roadmap for V4 Upgrade

To achieve the V4 primary product vision (turning NABRIJAN into a Product-Led SaaS Growth Platform), the architecture will be extended incrementally across the following core pillars:

1. **Database Expansion**: Add Prisma models for `Trial`, `SubscriptionEvent`, `SubscriptionItem`, `PlanFeature`, `UsageRecord`, `CustomerAccount`, `Wishlist`, `ReturnRequest`, `LoyaltyAccount`, `Referral`, `ProductBundle`, `UpsellRule`, `AutomationWorkflow`, and `SupportTicket`.
2. **7-Day Trial Engine & Onboarding Checklist**: Server-side UTC countdown, store launch checklist progress calculator (0–100%), trial extension audit logging, and trial warning notification scheduler.
3. **Subscription 2.0 & Billing Dunning**: State machine (`TRIAL`, `ACTIVE`, `PAST_DUE`, `GRACE_PERIOD`, `EXPIRED`), grace period enforcement (default 3 days), plan upgrade/downgrade validation, invoice history, and coupon redemption.
4. **Customer Experience Suite**: Storefront `/account` dashboard, Wishlist, 1-Click Reorder with current price verification, Returns & Refunds, Loyalty points, and Customer Referral rewards.
5. **Growth & Monetization Tools**: Product Bundles, Upsell & Cross-Sell rules, Flash Sale 2.0, AI Credit metering, Automation Workflow engine, Super Admin 360 Control Center, and Merchant Health Score.
