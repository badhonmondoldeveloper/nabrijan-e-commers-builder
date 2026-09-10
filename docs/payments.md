# Payment Abstraction & ZiniPay Integration

## Platform Billing vs Store Customer Payments Separation

### 1. Platform SaaS Billing
- **Gateway**: ZiniPay
- **Use Cases**: Merchant Subscription Plans, Theme Template Purchases
- **Credentials**: Configured in `.env` (`ZINIPAY_API_KEY`, `ZINIPAY_SECRET_KEY`, `ZINIPAY_MERCHANT_ID`)
- **Verification**: Mandatory server-side API check via `/api/billing/verify-payment`. Client browser "success" state is NEVER trusted directly.

### 2. Store Customer Checkout
- **Method**: Cash on Delivery (COD) ONLY for V1
- **Flow**: Customer places order -> Order created with `paymentMethod: 'COD'`, `paymentStatus: 'PENDING'` -> Merchant collects cash on parcel delivery -> Merchant updates order status to `DELIVERED` (auto-marks `paymentStatus: 'PAID'`).
