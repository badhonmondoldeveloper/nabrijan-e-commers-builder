import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  try {
    let settings = await db.platformSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await db.platformSettings.create({
        data: {
          id: 'default',
          siteName: 'Nabrijan E-Commerce',
          siteTagline: 'Create your professional online store in minutes',
          logoUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&q=80',
          bannerText: '🔥 ৩ দিনের ফ্রি ট্রায়াল সুবিধা পেতে আজই রেজিস্ট্রেশন করুন!',
          trialDays: 3,
          freePrice: 0,
          starterPrice: 599,
          proPrice: 1099,
          growthPrice: 2499,
          businessPrice: 2499,
          contactEmail: 'badhonmondoldeveloper@gmail.com',
          contactPhone: '+8801625642420',
          whatsappNumber: '+8801625642420',
        },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Super Admin access required' }, { status: 403 });
    }

    const body = await req.json();

    const freePrice = body.freePrice !== undefined ? Number(body.freePrice) : 0;
    const starterPrice = body.starterPrice !== undefined ? Number(body.starterPrice) : 599;
    const proPrice = body.proPrice !== undefined ? Number(body.proPrice) : 1099;
    const growthPrice = body.growthPrice !== undefined ? Number(body.growthPrice) : 2499;
    const businessPrice = body.businessPrice !== undefined ? Number(body.businessPrice) : growthPrice;

    const settings = await db.platformSettings.upsert({
      where: { id: 'default' },
      update: {
        siteName: body.siteName,
        siteTagline: body.siteTagline,
        logoUrl: body.logoUrl,
        bannerText: body.bannerText,
        trialDays: Number(body.trialDays) || 3,
        freePrice,
        starterPrice,
        proPrice,
        growthPrice,
        businessPrice,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        whatsappNumber: body.whatsappNumber,
      },
      create: {
        id: 'default',
        siteName: body.siteName || 'Nabrijan E-Commerce',
        siteTagline: body.siteTagline || 'Create your professional online store in minutes',
        logoUrl: body.logoUrl,
        bannerText: body.bannerText,
        trialDays: Number(body.trialDays) || 3,
        freePrice,
        starterPrice,
        proPrice,
        growthPrice,
        businessPrice,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        whatsappNumber: body.whatsappNumber,
      },
    });

    try {
      await db.plan.upsert({
        where: { slug: 'free' },
        update: { price: freePrice },
        create: { name: 'Free Plan', slug: 'free', price: freePrice, description: '20 Products, 5% physical COD fee, 10% digital order fee' },
      });
      await db.plan.upsert({
        where: { slug: 'starter' },
        update: { price: starterPrice },
        create: { name: 'Starter Plan', slug: 'starter', price: starterPrice, description: 'Up to 500 products, report exports, 0% fee' },
      });
      await db.plan.upsert({
        where: { slug: 'pro' },
        update: { price: proPrice },
        create: { name: 'Pro Plan', slug: 'pro', price: proPrice, isPopular: true, description: 'Up to 2,000 products, custom domain, theme builder' },
      });
      await db.plan.upsert({
        where: { slug: 'growth' },
        update: { price: growthPrice },
        create: { name: 'Growth Plan', slug: 'growth', price: growthPrice, description: 'Unlimited products, unlimited couriers & stores' },
      });
    } catch (e) {
      console.warn('Plan sync ignored:', e);
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to update settings' }, { status: 400 });
  }
}
