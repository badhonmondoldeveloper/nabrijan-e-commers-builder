# Production deployment guide for Nabrijan

This project is ready for production deployment on a Node-capable host. The app does not run correctly from a plain empty cPanel root because it is a Next.js app with a database-backed backend.

## Required production setup

1. Deploy the app on Vercel or another Node-compatible host.
2. Use a managed PostgreSQL database such as Neon, Supabase, Render, or Railway.
3. Point your domain `nabrijan.site` to the production host.
4. Set environment variables for production.
5. Run Prisma migration in production.

## Production environment variables

Use the following values in the hosting platform:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public"
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

## Prisma migration

After deploy, run:

```
npx prisma generate
npx prisma db push
```

Optional seed:

```
npm run prisma:seed
```

## Domain setup

1. Add `nabrijan.site` to the production host.
2. Set DNS/A record or nameservers to the host.
3. Enable SSL.
4. Confirm HTTPS works.

## Important note

The shared cPanel folder `/home/nabrijan/public_html` is not enough for a full Next.js SaaS app. That folder currently serves directory listings because the app itself is not deployed there.

The correct deployment target is a Node runtime with production database support.
