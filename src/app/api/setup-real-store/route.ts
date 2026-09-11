import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (key !== 'nabrijan_deploy_2026_secret') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const email = 'badhonmondoldeveloper@gmail.com';
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: `User ${email} not found` }, { status: 404 });
    }

    // Set role to SUPER_ADMIN
    await db.user.update({
      where: { id: user.id },
      data: { role: 'SUPER_ADMIN' },
    });

    // Find or create store
    let store = await db.store.findUnique({
      where: { slug: 'nabrijan-official' },
    });

    if (!store) {
      store = await db.store.create({
        data: {
          name: 'Nabrijan Official Store',
          slug: 'nabrijan-official',
          logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80',
          banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
          category: 'Electronics & Lifestyle',
          status: 'ACTIVE',
          ownerId: user.id,
        },
      });
    } else {
      store = await db.store.update({
        where: { id: store.id },
        data: {
          name: 'Nabrijan Official Store',
          logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80',
          banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
          category: 'Electronics & Lifestyle',
          status: 'ACTIVE',
        },
      });
    }

    // Store Settings using raw SQL execute to guarantee compatibility
    await db.$executeRawUnsafe(`
      INSERT INTO StoreSettings (id, storeId, currency, currencySymbol, language, country, phone, email, address, whatsappNumber, facebookUrl, instagramUrl, announcementText, accentColor, enableCOD)
      VALUES (CONCAT('sett_', UUID()), '${store.id}', 'BDT', '৳', 'bn', 'BD', '01700000000', 'badhonmondoldeveloper@gmail.com', 'Dhaka, Bangladesh', '01700000000', 'https://facebook.com/nabrijan', 'https://instagram.com/nabrijan', '🔥 ক্যাশ অন ডেলিভারিতে দ্রুত ডেলিভারি সারা বাংলাদেশে! ৫০% পর্যন্ত ছাড়!', '#e11d48', 1)
      ON DUPLICATE KEY UPDATE
        phone = '01700000000',
        email = 'badhonmondoldeveloper@gmail.com',
        address = 'Dhaka, Bangladesh',
        whatsappNumber = '01700000000',
        facebookUrl = 'https://facebook.com/nabrijan',
        instagramUrl = 'https://instagram.com/nabrijan',
        announcementText = '🔥 ক্যাশ অন ডেলিভারিতে দ্রুত ডেলিভারি সারা বাংলাদেশে! ৫০% পর্যন্ত ছাড়!',
        accentColor = '#e11d48',
        enableCOD = 1
    `);

    // Create Categories
    const categoriesData = [
      { name: 'স্মার্ট গ্যাজেট', slug: 'smart-gadgets' },
      { name: 'হেডফোন ও অডিও', slug: 'audio-headphones' },
      { name: 'ফ্যাশন ও লাইফস্টাইল', slug: 'fashion-lifestyle' },
    ];

    const categoryMap: Record<string, string> = {};
    for (const cat of categoriesData) {
      let category = await db.category.findUnique({
        where: { storeId_slug: { storeId: store.id, slug: cat.slug } },
      });
      if (!category) {
        category = await db.category.create({
          data: {
            storeId: store.id,
            name: cat.name,
            slug: cat.slug,
            isActive: true,
          },
        });
      }
      categoryMap[cat.slug] = category.id;
    }

    // Products
    const productsData = [
      {
        title: 'T900 Ultra Smartwatch 2.01 inch HD Display',
        slug: 't900-ultra-smartwatch',
        shortDescription: 'হৃদস্পন্দন, ব্লাড প্রেসার ও স্লিপ ট্র্যাকিং সুবিধা সহ প্রিমিয়াম ওয়াটারপ্রুফ স্মার্টওয়াচ।',
        fullDescription: 'T900 Ultra Smartwatch একটি সর্বাধুনিক স্মার্টওয়াচ যা ফুল টাচ স্ক্রিন ডিসপ্লে ও ব্লুটুথ কলিং সুবিধা সহ আসে। এতে রয়েছে হেলথ ট্র্যাকার, ফিটনেস মোড, স্পোর্টস ট্র্যাকার এবং দীর্ঘস্থায়ী ব্যাটারি ব্যাকআপ।',
        regularPrice: 1990,
        salePrice: 1250,
        stock: 50,
        catSlug: 'smart-gadgets',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
      },
      {
        title: 'AirPods Pro 2nd Gen Wireless Earbuds with ANC',
        slug: 'airpods-pro-2nd-gen',
        shortDescription: 'একটিভ নয়েজ ক্যানসেলেশন ও ক্রিস্টাল ক্লিয়ার সাউন্ড কোয়ালিটি সহ সেরা ওয়াটারপ্রুফ ব্লুটুথ ইয়ারবাড।',
        fullDescription: 'AirPods Pro 2nd Gen ইয়ারবাডে রয়েছে ডিপ বেস সাউন্ড, অ্যাক্টিভ নয়েজ ক্যানসেলেশন (ANC), ট্রান্সপারেন্সি মোড এবং প্রায় ২৪ ঘণ্টা পর্যন্ত ব্যাটারি প্লেব্যাক টাইম।',
        regularPrice: 2490,
        salePrice: 1490,
        stock: 30,
        catSlug: 'audio-headphones',
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80',
      },
      {
        title: "Premium Men's Genuine Leather Wallet",
        slug: 'premium-mens-leather-wallet',
        shortDescription: '১০০% খাঁটি চামড়ায় তৈরি লাক্সারি ম্যানস ওয়ালেট ও কার্ড হোল্ডার।',
        fullDescription: 'উচ্চমানের রিয়েল লেদার দিয়ে তৈরি এই মানিব্যাগটিতে রয়েছে একাধিক কার্ড স্লট, ক্যাশ পকেট এবং জিপার কম্পার্টমেন্ট। দীর্ঘস্থায়ী ও স্টাইলিশ ডিজাইন।',
        regularPrice: 1200,
        salePrice: 790,
        stock: 40,
        catSlug: 'fashion-lifestyle',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
      },
      {
        title: 'RGB Gaming Headphone with HD Mic',
        slug: 'rgb-gaming-headphone',
        shortDescription: 'ভারী বেস ও আরজিবি লাইটিং সহ প্রফেশনাল গেমিং হেডফোন।',
        fullDescription: 'গেমারদের জন্য বিশেষ ভাবে তৈরি ৭.১ সরাউন্ড সাউন্ড গেমিং হেডসেট। এতে আছে নয়েজ ক্যানসেলিং নমনীয় মাইক এবং সফট ইয়ার প্যাড যা দীর্ঘ সময় ব্যবহারে আরামদায়ক।',
        regularPrice: 2800,
        salePrice: 1850,
        stock: 25,
        catSlug: 'audio-headphones',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
      },
      {
        title: 'Stylish Slim Fit Casual Shirt for Men',
        slug: 'stylish-slim-fit-casual-shirt',
        shortDescription: '১০০% কটন ফ্যাব্রিকসে তৈরি প্রিমিয়াম ক্যাজুয়াল ফুল স্লিভ শার্ট।',
        fullDescription: 'যেকোনো পার্টি, অফিস বা ক্যাজুয়াল লুকে পড়ার জন্য উপযোগী প্রিমিয়াম কটন শার্ট। সফট ও আরামদায়ক ফেব্রিক যা ধোয়ার পরও রং ও সাইজ ঠিক থাকে।',
        regularPrice: 1500,
        salePrice: 990,
        stock: 60,
        catSlug: 'fashion-lifestyle',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
      },
    ];

    const seededProducts = [];

    for (const p of productsData) {
      const catId = categoryMap[p.catSlug] || null;

      let product = await db.product.findUnique({
        where: { storeId_slug: { storeId: store.id, slug: p.slug } },
      });

      if (!product) {
        product = await db.product.create({
          data: {
            storeId: store.id,
            title: p.title,
            slug: p.slug,
            shortDescription: p.shortDescription,
            fullDescription: p.fullDescription,
            regularPrice: p.regularPrice,
            salePrice: p.salePrice,
            costPrice: 0.0,
            stock: p.stock,
            categoryId: catId,
            status: 'ACTIVE',
            isFeatured: true,
            images: {
              create: [
                {
                  url: p.image,
                  isMain: true,
                  sortOrder: 0,
                },
              ],
            },
          },
        });
      } else {
        product = await db.product.update({
          where: { id: product.id },
          data: {
            title: p.title,
            shortDescription: p.shortDescription,
            fullDescription: p.fullDescription,
            regularPrice: p.regularPrice,
            salePrice: p.salePrice,
            stock: p.stock,
            categoryId: catId,
            status: 'ACTIVE',
            isFeatured: true,
          },
        });

        // Ensure main image
        const imgCount = await db.productImage.count({ where: { productId: product.id } });
        if (imgCount === 0) {
          await db.productImage.create({
            data: {
              productId: product.id,
              url: p.image,
              isMain: true,
              sortOrder: 0,
            },
          });
        }
      }

      seededProducts.push(product.title);
    }

    return NextResponse.json({
      success: true,
      message: 'Real store and sample ecommerce products setup successfully!',
      user: { email: user.email, role: 'SUPER_ADMIN' },
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        url: `https://nabrijan.site/store/${store.slug}`,
      },
      productsSeededCount: seededProducts.length,
      products: seededProducts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Setup failed' },
      { status: 500 }
    );
  }
}
