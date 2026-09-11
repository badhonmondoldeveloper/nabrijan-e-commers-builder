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
          contactEmail: 'badhonmondoldeveloper@gmail.com',
          contactPhone: '01700000000',
          whatsappNumber: '01700000000',
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

    const settings = await db.platformSettings.upsert({
      where: { id: 'default' },
      update: {
        siteName: body.siteName,
        siteTagline: body.siteTagline,
        logoUrl: body.logoUrl,
        bannerText: body.bannerText,
        trialDays: Number(body.trialDays) || 3,
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
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        whatsappNumber: body.whatsappNumber,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to update settings' }, { status: 400 });
  }
}
