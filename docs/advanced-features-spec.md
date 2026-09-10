# NABRIJAN — Amazon/AliExpress-Grade Storefront & Advanced Vendor Admin Specification

## 1. Amazon / AliExpress-Grade Storefront Upgrades

### A. High-Converting Promotional & Flash Sale System
- **Flash Sale Countdown Bar**: Real-time countdown timer section (`FLASH_SALE`) displaying discounted items with stock percentage progress bars ("75% Sold Out").
- **Header Announcement & Instant Search**: Live product search modal matching titles, categories, and SKU codes.

### B. Rich Product Detail Page (PDP)
- **Multi-Image Thumbnail Carousel**: Image gallery with click-to-zoom and main image preview.
- **Interactive Variant Attributes**: Size (S, M, L, XL), Color (Pills), and Material selectors with dynamic stock level indicators.
- **Verified Customer Reviews & Rating Breakdown**: 5-star rating distribution chart, verified buyer badges, and customer review submission form (`POST /api/store/[slug]/reviews`).
- **Sticky Mobile Purchase Action Bar**: Floating bottom bar on mobile screens with instant "Add to Cart" and "Buy Now (COD)".
- **Related Product Recommendations**: "Customers who bought this also viewed" recommendation grid.

### C. Customer Wishlist Engine
- Persistent wishlist toggle (`Heart` button) saving items to customer profile / local session.

---

## 2. Advanced Vendor / Merchant Store Admin Upgrades

### A. Order Invoice Generator & PDF Printable Drawer
- Printable A4 invoice format containing Store Logo, Merchant Contact, Invoice Number, Customer Delivery Address, Itemized Table, Shipping Fee, and Total COD Collection.

### B. Product Reviews Moderation Panel
- **Route**: `/dashboard/stores/[storeId]/reviews`
- **Actions**: Approve, Reject, or Delete customer product reviews with rating breakdown.

### C. Staff Memberships & Granular Permissions Editor
- **Route**: `/dashboard/stores/[storeId]/staff`
- **Actions**: Invite staff members by email, assign store roles (`ADMIN`, `MANAGER`, `PRODUCT_MANAGER`, `ORDER_MANAGER`, `SUPPORT_AGENT`), and toggle granular permissions.

### D. Custom Domain Mapping & DNS Verifier
- **Route**: `/dashboard/stores/[storeId]/domains`
- **Actions**: Map custom domain (`storebrand.com`), view DNS CNAME / A-record configuration instructions, and check verification status.

### E. Media Library Manager
- **Route**: `/dashboard/stores/[storeId]/media`
- **Actions**: File manager grid, MIME type inspection, file size tracking, multi-file uploader, and instant URL copy.

### F. Store Notifications Bell Center
- Real-time in-app notification dropdown alerting merchants of new COD orders, low stock items ($\le 5$), and plan renewal reminders.
