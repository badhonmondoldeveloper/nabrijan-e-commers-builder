import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { createStoreSchema } from '@/lib/validation/schemas';
import { UsageService } from '@/lib/tenancy/usage-service';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    // Server-side Subscription Usage Limit Enforcement
    const storeLimitCheck = await UsageService.canCreateStore(user.id);
    if (!storeLimitCheck.allowed) {
      return NextResponse.json({ message: storeLimitCheck.reason }, { status: 403 });
    }

    const body = await req.json();
    const validated = createStoreSchema.parse(body);

    // Check slug uniqueness
    const existing = await db.store.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return NextResponse.json({ message: 'Store slug is already taken. Please choose another.' }, { status: 400 });
    }

    // Default theme (or selected template)
    let defaultTheme = await db.theme.findFirst({ where: { isFree: true } });
    if (!defaultTheme) {
      defaultTheme = await db.theme.create({
        data: {
          name: 'Classic Storefront',
          slug: 'classic-storefront',
          description: 'A modern, high-converting e-commerce layout.',
          previewImage: '/themes/classic-preview.jpg',
          isFree: true,
        },
      });
    }

    // Create store with settings, theme settings, and initial shipping zone
    const store = await db.store.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        category: validated.category,
        logo: validated.logo || null,
        ownerId: user.id,
        settings: {
          create: {
            currency: validated.currency || 'BDT',
            phone: validated.phone,
            address: validated.address || '',
            enableCOD: true,
          },
        },
        themeSettings: {
          create: {
            themeId: defaultTheme.id,
            headerConfig: JSON.stringify({ showSearch: true, showAnnouncement: true, announcementText: '🎉 Free Shipping on orders over ৳1000!' }),
            footerConfig: JSON.stringify({ copyright: `© ${new Date().getFullYear()} ${validated.name}. All rights reserved.` }),
            colorsConfig: JSON.stringify({ primary: '#2563eb', secondary: '#4f46e5' }),
            typographyConfig: JSON.stringify({ fontFamily: 'Inter' }),
            sections: {
              create: [
                {
                  sectionType: 'HERO',
                  title: `Welcome to ${validated.name}`,
                  subtitle: 'Explore our latest collections and exclusive offers today!',
                  content: JSON.stringify({ buttonText: 'Shop Now', bannerUrl: '' }),
                  sortOrder: 0,
                  isVisible: true,
                },
                {
                  sectionType: 'FEATURED_PRODUCTS',
                  title: 'Featured Products',
                  subtitle: 'Our top hand-picked items for you',
                  content: JSON.stringify({ limit: 8 }),
                  sortOrder: 1,
                  isVisible: true,
                },
                {
                  sectionType: 'BENEFITS',
                  title: 'Why Shop With Us',
                  subtitle: 'Fast delivery & guaranteed quality',
                  content: JSON.stringify({}),
                  sortOrder: 2,
                  isVisible: true,
                },
              ],
            },
          },
        },
        shippingZones: {
          create: [
            {
              name: 'Inside Dhaka',
              regions: JSON.stringify(['Dhaka']),
              rates: {
                create: [
                  { name: 'Standard Delivery', price: 60, estimatedDays: '1-2 Days' },
                ],
              },
            },
            {
              name: 'Outside Dhaka',
              regions: JSON.stringify(['Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh']),
              rates: {
                create: [
                  { name: 'Courier Shipping', price: 120, estimatedDays: '3-5 Days' },
                ],
              },
            },
          ],
        },
      },
    });

    // Ensure active trial or subscription
    const existingSub = await db.subscription.findFirst({
      where: { userId: user.id, status: 'ACTIVE' },
    });

    if (!existingSub) {
      let starterPlan = await db.plan.findFirst({ where: { slug: 'starter' } });
      if (!starterPlan) {
        starterPlan = await db.plan.create({
          data: {
            name: 'Starter Plan',
            slug: 'starter',
            price: 990,
            storeLimit: 1,
            productLimit: 100,
            staffLimit: 2,
            features: JSON.stringify(['COD Checkout', '1 Store', 'Basic Analytics']),
          },
        });
      }

      await db.subscription.create({
        data: {
          userId: user.id,
          storeId: store.id,
          planId: starterPlan.id,
          status: 'TRIALING',
          currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
        },
      });
    }

    // Audit log
    await db.auditLog.create({
      data: {
        actorId: user.id,
        actorEmail: user.email,
        storeId: store.id,
        action: 'STORE_CREATE',
        resource: 'Store',
        resourceId: store.id,
        details: JSON.stringify({ name: store.name, slug: store.slug }),
      },
    });

    return NextResponse.json({ success: true, store });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Store creation failed' }, { status: 400 });
  }
}
