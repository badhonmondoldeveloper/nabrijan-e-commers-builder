# NABRIJAN — Final Production Architecture Specification

## 1. System Architecture & Product Vision

NABRIJAN is a production-grade **Multi-User + Multi-Store + Single-Vendor E-Commerce SaaS Platform**.

```
NABRIJAN SaaS Platform
│
├── User A (Merchant)
│   ├── Store A1 (Single-Vendor E-Commerce Store)
│   └── Store A2 (Single-Vendor E-Commerce Store)
│
├── User B (Merchant)
│   └── Store B1 (Single-Vendor E-Commerce Store)
│
└── User C (Super Admin / Merchant)
    └── Store C1 (Single-Vendor E-Commerce Store)
```

NABRIJAN is **NOT** a multi-seller marketplace (e.g. Daraz / AliExpress). Each store operates as an independent business with isolated products, inventory, customers, orders, staff, themes, analytics, and custom domains.

---

## 2. Multi-Tenancy & Security Architecture

### Strict Tenant Scope Enforcement
Every store-owned entity (`Product`, `Category`, `Brand`, `Inventory`, `Customer`, `Cart`, `Order`, `Coupon`, `Review`, `Media`, `ThemeSettings`, `Shipping`, `Staff`, `Return`) strictly requires `storeId`.

```
Authenticated Request (JWT Session Cookie)
↓
Extract userId & Request Path/Context
↓
Determine Active Store & Store Membership
↓
Execute Server-Side Permission Check (RBAC)
↓
Construct Tenant Context (storeId)
↓
Enforce Tenant Filter on Repository/Prisma Query
```

> [!CAUTION]
> Client-submitted `req.body.storeId` or hidden form fields are NEVER trusted as authorization sources. Active store identity is determined strictly via authenticated session tokens and route parameters, validated against `StoreMembership`.

---

## 3. Usage Metering & Plan Limit Enforcement

Subscription plans govern merchant resource consumption. A centralized `UsageService` enforces limits server-side prior to mutation operations:

- `canCreateStore(userId)`: Verifies total stores owned against subscription plan `storeLimit`.
- `canCreateProduct(storeId)`: Verifies product count against plan `productLimit`.
- `canInviteStaff(storeId)`: Verifies active staff count against plan `staffLimit`.
- `canUploadMedia(storeId, bytes)`: Verifies storage consumption against plan `storageLimit`.
- `canUseAi(storeId)`: Verifies available AI credits against plan `aiCredits`.

---

## 4. Payment Engine Abstraction & Webhook Idempotency

### Billing Domain Separation
1. **Platform SaaS Billing**: User → Nabrijan → **ZiniPay** (Subscriptions, Templates, AI Credits, Apps).
2. **Store Customer Checkout**: Customer → Merchant Store → **Cash on Delivery (COD)** V1 (with extension points for bKash/Nagad/Cards).

### ZiniPay Payment Lifecycle State Machine
```
CREATED → PENDING → PROCESSING → SUCCESS / FAILED / CANCELLED / EXPIRED
```

### Webhook & Transaction Idempotency
All gateway webhooks and transaction verifications register a `PaymentWebhookEvent`:
- Primary Key / Unique Constraint on `provider + externalEventId`
- Payload hash check
- Duplicate event skip logic ensuring subscription activations, template entitlements, and invoice creations occur **exactly once**.

---

## 5. Dynamic Theme Engine, Draft/Publish & Visual Customizer

Themes render JSON section blueprints dynamically. To prevent storefront crashes from invalid merchant configurations:
1. **Section Schema Validation**: Zod schema validation per section instance.
2. **Graceful Fallbacks**: Missing images or corrupted content revert to default placeholders without throwing React render exceptions.
3. **Draft / Publish Workflow**: Store themes maintain `draftConfig` (edited in Visual Customizer) and `publishedConfig` (rendered on live storefronts).

---

## 6. Comprehensive Database Entity Architecture

The finalized PostgreSQL schema incorporates 40+ normalized models:
- **Auth & Memberships**: `User`, `Session`, `Store`, `StoreSettings`, `StoreMembership`, `Role`, `Permission`, `RolePermission`.
- **SaaS Billing**: `Plan`, `PlanFeature`, `Subscription`, `SubscriptionEvent`, `Invoice`, `Payment`, `PaymentAttempt`, `PaymentTransaction`, `PaymentWebhookEvent`.
- **Commerce & Products**: `Product`, `ProductVariant`, `Category`, `Brand`, `ProductAttribute`, `ProductAttributeValue`, `ProductTag`, `Inventory`, `InventoryTransaction`.
- **CRM & Orders**: `Customer`, `CustomerAddress`, `CustomerSegment`, `Cart`, `CartItem`, `Wishlist`, `WishlistItem`, `Order`, `OrderItem`, `OrderStatusHistory`, `Return`, `ReturnItem`, `Refund`.
- **Shipping & Discounts**: `ShippingZone`, `ShippingRate`, `ShippingMethod`, `Shipment`, `TrackingEvent`, `Coupon`, `Discount`, `DiscountRule`, `Campaign`, `FlashSale`, `AbandonedCart`.
- **Themes & Media**: `Theme`, `ThemeVersion`, `ThemePurchase`, `ThemeReview`, `ThemePage`, `ThemeSection`, `StoreThemeSettings`, `Media`, `MediaVariant`, `MediaFolder`.
- **Platform Operations**: `Domain`, `DomainVerification`, `Notification`, `AuditLog`, `SupportTicket`, `FeatureFlag`, `PlatformSetting`, `ApiKey`, `Webhook`, `AiUsage`, `AiCredit`, `AiTransaction`.
