# Security Architecture & Rules

## Implemented Security Layers

1. **Password Hashing**: `bcryptjs` with salt rounds = 12.
2. **Session Security**: HTTP-only, SameSite=Lax JWT token cookies (`jose` HS256 algorithm).
3. **Defensive API Validation**: Zod schema validation on every POST/PATCH request payload (`registerSchema`, `loginSchema`, `createStoreSchema`, `productSchema`, `checkoutSchema`).
4. **Audit Logging**: Sensitive mutations (User Registration, Login, Store Creation, Order Status Updates, Subscription Payment Verifications) write structured records to `AuditLog`.
5. **Multi-Tenant Authorization**: Mandatory tenant check via `verifyStoreAccess()` before database query execution.
