import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting development seed...');

  // 1. Password hash for demo users
  const passwordHash = await bcrypt.hash('merchant123456', 10);
  const adminHash = await bcrypt.hash('admin123456', 10);

  // 2. Create Super Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@platform.com' },
    update: {},
    create: {
      name: 'Platform Administrator',
      email: 'admin@platform.com',
      passwordHash: adminHash,
      role: 'SUPER_ADMIN',
    },
  });

  // 3. Create Owner Super Admin (badhonmondoldeveloper)
  const ownerHash = await bcrypt.hash('badhon#2006', 10);
  await prisma.user.upsert({
    where: { email: 'badhonmondoldeveloper@gmail.com' },
    update: { passwordHash: ownerHash, role: 'SUPER_ADMIN', name: 'Badhon Mondol' },
    create: {
      name: 'Badhon Mondol',
      email: 'badhonmondoldeveloper@gmail.com',
      passwordHash: ownerHash,
      role: 'SUPER_ADMIN',
    },
  });

  // 4. Create Demo Merchant User
  const merchantUser = await prisma.user.upsert({
    where: { email: 'merchant@example.com' },
    update: {},
    create: {
      name: 'Tanvir Ahmed',
      email: 'merchant@example.com',
      passwordHash,
      role: 'MERCHANT',
    },
  });

  // 4. Create Single Subscription Plan (৳500 Full Package)
  const fullPackagePlan = await prisma.plan.upsert({
    where: { slug: 'full-package' },
    update: {
      name: 'Full Package',
      price: 500,
      storeLimit: 1,
      productLimit: 10000,
      staffLimit: 10,
      customDomainAllowed: true,
      features: JSON.stringify(['Unlimited Products', 'Custom Domain', 'Theme Customizer', 'Courier Integration', 'bKash/Nagad/COD']),
    },
    create: {
      name: 'Full Package',
      slug: 'full-package',
      price: 500,
      isPopular: true,
      storeLimit: 1,
      productLimit: 10000,
      staffLimit: 10,
      customDomainAllowed: true,
      features: JSON.stringify(['Unlimited Products', 'Custom Domain', 'Theme Customizer', 'Courier Integration', 'bKash/Nagad/COD']),
    },
  });

  // 5. Create Default Theme
  const classicTheme = await prisma.theme.upsert({
    where: { slug: 'classic-storefront' },
    update: {},
    create: {
      name: 'Classic Storefront',
      slug: 'classic-storefront',
      description: 'Clean, high-converting e-commerce layout optimized for BD mobile shoppers.',
      previewImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
      isFree: true,
    },
  });

  // 6. Create Demo Store
  const demoStore = await prisma.store.upsert({
    where: { slug: 'nabrijan-fashion' },
    update: {},
    create: {
      name: 'Nabrijan Fashion & Style',
      slug: 'nabrijan-fashion',
      category: 'Fashion & Clothing',
      ownerId: merchantUser.id,
      settings: {
        create: {
          currency: 'BDT',
          phone: '01712345678',
          address: 'Mirpur 10, Dhaka',
          enableCOD: true,
        },
      },
      themeSettings: {
        create: {
          themeId: classicTheme.id,
          headerConfig: JSON.stringify({ showSearch: true, showAnnouncement: true, announcementText: '🎉 Free Shipping on orders over ৳1000!' }),
          footerConfig: JSON.stringify({ copyright: '© 2026 Nabrijan Fashion. All rights reserved.' }),
          colorsConfig: JSON.stringify({ primary: '#2563eb', secondary: '#4f46e5' }),
          typographyConfig: JSON.stringify({ fontFamily: 'Inter' }),
          sections: {
            create: [
              {
                sectionType: 'HERO',
                title: 'Premium Bangladeshi Fashion Collection',
                subtitle: 'Authentic quality, fast Cash on Delivery shipping across BD.',
                content: JSON.stringify({ buttonText: 'Shop New Arrivals' }),
                sortOrder: 0,
                isVisible: true,
              },
              {
                sectionType: 'FEATURED_PRODUCTS',
                title: 'Featured Collection',
                subtitle: 'Top rated products for this season',
                content: JSON.stringify({ limit: 8 }),
                sortOrder: 1,
                isVisible: true,
              },
              {
                sectionType: 'BENEFITS',
                title: 'Why Shop With Us',
                subtitle: 'Quality service guaranteed',
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
              create: [{ name: 'Standard Express', price: 60, estimatedDays: '1-2 Days' }],
            },
          },
          {
            name: 'Outside Dhaka',
            regions: JSON.stringify(['Chittagong', 'Rajshahi', 'Khulna', 'Sylhet']),
            rates: {
              create: [{ name: 'Courier Shipping', price: 120, estimatedDays: '3-4 Days' }],
            },
          },
        ],
      },
    },
  });

  // 7. Create Active Subscription for Demo Merchant
  await prisma.subscription.create({
    data: {
      userId: merchantUser.id,
      storeId: demoStore.id,
      planId: businessPlan.id,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // 8. Create Demo Category & Products
  const fashionCategory = await prisma.category.create({
    data: {
      storeId: demoStore.id,
      name: 'Men & Women Wear',
      slug: 'men-women-wear',
      description: 'Exclusive traditional & modern apparel',
    },
  });

  const prod1 = await prisma.product.create({
    data: {
      storeId: demoStore.id,
      title: 'Premium Cotton Panjabi',
      slug: 'premium-cotton-panjabi',
      shortDescription: 'Elegant hand-crafted cotton Panjabi for special occasions.',
      regularPrice: 2800,
      salePrice: 2250,
      costPrice: 1300,
      sku: 'PJ-001',
      categoryId: fashionCategory.id,
      stock: 25,
      status: 'ACTIVE',
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80',
            isMain: true,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      storeId: demoStore.id,
      title: 'Smart Digital Chrono Watch',
      slug: 'smart-digital-chrono-watch',
      shortDescription: 'Water resistant smart watch with heart rate and fitness tracker.',
      regularPrice: 3500,
      salePrice: 2990,
      costPrice: 1800,
      sku: 'SW-909',
      stock: 12,
      status: 'ACTIVE',
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
            isMain: true,
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // 9. Create Demo Orders
  const demoCustomer = await prisma.customer.create({
    data: {
      storeId: demoStore.id,
      name: 'Rahat Chowdhury',
      phone: '01819000000',
      email: 'rahat@example.com',
      totalOrders: 1,
      totalSpent: 2310,
    },
  });

  await prisma.order.create({
    data: {
      storeId: demoStore.id,
      orderNumber: 'ORD-882101',
      customerId: demoCustomer.id,
      customerName: demoCustomer.name,
      customerPhone: demoCustomer.phone,
      shippingDivision: 'Dhaka',
      shippingDistrict: 'Dhaka',
      shippingArea: 'Mirpur 11',
      shippingAddress: 'House 45, Road 3',
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      subtotal: 2250,
      shippingFee: 60,
      totalAmount: 2310,
      estimatedProfit: 950, // 2250 - 1300
      items: {
        create: [
          {
            productId: prod1.id,
            productTitle: prod1.title,
            price: 2250,
            costPrice: 1300,
            quantity: 1,
            total: 2250,
          },
        ],
      },
      statusHistory: {
        create: [
          { status: 'PENDING', comment: 'Initial COD Order created' },
        ],
      },
    },
  });

  // 10. Seed Platform Settings
  await prisma.platformSettings.upsert({
    where: { id: 'global-settings' },
    update: {},
    create: {
      id: 'global-settings',
      defaultCommissionRate: 0.02,
      minWithdrawalLimit: 500,
      autoApproveProducts: false,
    },
  });

  // 11. Seed Boost Packages
  const boostPackages = [
    {
      name: 'Starter Highlights (3 Days)',
      slug: 'starter-3-days',
      price: 199,
      durationDays: 3,
      description: 'Pin product to Top Category & Search Results for 3 days.',
      isFeatured: false,
    },
    {
      name: 'Pro Merchant Spotlight (7 Days)',
      slug: 'pro-7-days',
      price: 499,
      durationDays: 7,
      description: 'Homepage Flash Banner + Priority Marketplace Placement for 7 days.',
      isFeatured: true,
    },
    {
      name: 'Growth Beast Blast (14 Days)',
      slug: 'growth-14-days',
      price: 899,
      durationDays: 14,
      description: 'Central Marketplace Hero Carousel + Social & Email Highlights.',
      isFeatured: false,
    },
  ];

  for (const pkg of boostPackages) {
    await prisma.boostPackage.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }

  console.log('✅ Development Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
