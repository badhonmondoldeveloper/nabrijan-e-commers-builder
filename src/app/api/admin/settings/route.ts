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
          logoUrl: '/logo.png',
          bannerText: '🔥 ৳৫০০ টাকায় ফুল স্টোর প্যাকেজ সাবস্ক্রিপশন চালু করুন!',
          fullPackagePrice: 500,
          bkashNumber: '01625642420',
          bkashType: 'Personal',
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

    const fullPackagePrice = body.fullPackagePrice !== undefined ? Number(body.fullPackagePrice) : 500;

    const settings = await db.platformSettings.upsert({
      where: { id: 'default' },
      update: {
        siteName: body.siteName,
        siteTagline: body.siteTagline,
        logoUrl: body.logoUrl,
        bannerText: body.bannerText,
        fullPackagePrice,
        bkashNumber: body.bkashNumber || '01625642420',
        bkashType: body.bkashType || 'Personal',
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
        fullPackagePrice,
        bkashNumber: body.bkashNumber || '01625642420',
        bkashType: body.bkashType || 'Personal',
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        whatsappNumber: body.whatsappNumber,
      },
    });

    // Sync Plan record
    try {
      await db.plan.upsert({
        where: { slug: 'full-package' },
        update: { price: fullPackagePrice },
        create: {
          name: 'Full Package',
          slug: 'full-package',
          price: fullPackagePrice,
          description: 'Full store access, unlimited products, courier APIs, custom domain',
          storeLimit: 1,
          productLimit: 10000,
          staffLimit: 10,
          customDomainAllowed: true,
        },
      });
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
