# Multi-Tenancy Architecture

## Tenant Isolation Guarantees

1. **Database Schema Isolation**: Every store-owned record (Product, Category, Order, Inventory, Customer, Coupon, Review, Media, ThemeSettings) includes `storeId`.
2. **Server-Side Context Validation**: `verifyStoreAccess(storeId)` helper strictly verifies:
   - Super Admin overriding role
   - Store Owner identity matching `store.ownerId`
   - Active Staff membership and granular permission matching
3. **No Untrusted Client Input**: Active store context is determined strictly from authenticated session JWT token or path parameter, never trusting client-passed headers.
