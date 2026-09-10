# Database Schema & Entity Relationships

## Database Models (Prisma PostgreSQL)

The system relies on 35+ core normalized Prisma models:

### 1. Multi-Tenancy Core
- `User`: Merchant, Super Admin, and Customer identities.
- `Store`: Tenant entity holding store settings, domain mappings, and staff.
- `StoreSettings`: Regional preferences (BDT, language, address, COD activation).

### 2. SaaS Billing & Subscriptions
- `Plan`: Configurable platform tiers (price, limits for stores, products, staff).
- `Subscription`: Merchant active tier, period dates, trial statuses.
- `PaymentTransaction`: Audit trail of platform payments with ZiniPay gateway transaction ID and response payloads.

### 3. E-Commerce Core
- `Product`: Main item entity with pricing, cost price, inventory stock, and low stock threshold.
- `ProductVariant`: SKU, attributes (Color/Size), stock, custom image.
- `Category`: Unlimited nesting hierarchy parent-child tree model.
- `InventoryTransaction`: Audit history tracking inventory mutations (Purchase, Sale, Adjustment, Damage).

### 4. Orders & COD Checkout
- `Order`: Customer shipping info, order status, COD payment status, and calculated `estimatedProfit`.
- `OrderItem`: Snapshot of product title, SKU, unit price, and unit cost price.
- `OrderStatusHistory`: Log of status updates with comments and actor IDs.
