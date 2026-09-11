import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'store:read');

    const store = await db.store.findUnique({
      where: { id: params.storeId },
      include: {
        settings: true,
      },
    });

    if (!store) {
      return NextResponse.json({ message: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, store });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch store details' }, { status: 400 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'store:settings');

    const body = await req.json();
    const {
      name,
      logo,
      banner,
      category,
      phone,
      email,
      address,
      whatsappNumber,
      facebookUrl,
      instagramUrl,
      announcementText,
      accentColor,
      enableCOD,
      seoTitle,
      seoDescription,
    } = body;

    // Update Store details
    const updatedStore = await db.store.update({
      where: { id: params.storeId },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(logo !== undefined ? { logo: logo ? logo.trim() : null } : {}),
        ...(banner !== undefined ? { banner: banner ? banner.trim() : null } : {}),
        ...(category ? { category: category.trim() } : {}),
      },
    });

    // Upsert StoreSettings details
    const settings = await db.storeSettings.upsert({
      where: { storeId: params.storeId },
      update: {
        phone: phone !== undefined ? (phone ? phone.trim() : null) : undefined,
        email: email !== undefined ? (email ? email.trim() : null) : undefined,
        address: address !== undefined ? (address ? address.trim() : null) : undefined,
        whatsappNumber: whatsappNumber !== undefined ? (whatsappNumber ? whatsappNumber.trim() : null) : undefined,
        facebookUrl: facebookUrl !== undefined ? (facebookUrl ? facebookUrl.trim() : null) : undefined,
        instagramUrl: instagramUrl !== undefined ? (instagramUrl ? instagramUrl.trim() : null) : undefined,
        announcementText: announcementText !== undefined ? (announcementText ? announcementText.trim() : null) : undefined,
        accentColor: accentColor !== undefined ? (accentColor ? accentColor.trim() : '#2563eb') : undefined,
        enableCOD: enableCOD !== undefined ? Boolean(enableCOD) : undefined,
        seoTitle: seoTitle !== undefined ? (seoTitle ? seoTitle.trim() : null) : undefined,
        seoDescription: seoDescription !== undefined ? (seoDescription ? seoDescription.trim() : null) : undefined,
      },
      create: {
        storeId: params.storeId,
        phone: phone ? phone.trim() : null,
        email: email ? email.trim() : null,
        address: address ? address.trim() : null,
        whatsappNumber: whatsappNumber ? whatsappNumber.trim() : null,
        facebookUrl: facebookUrl ? facebookUrl.trim() : null,
        instagramUrl: instagramUrl ? instagramUrl.trim() : null,
        announcementText: announcementText ? announcementText.trim() : null,
        accentColor: accentColor ? accentColor.trim() : '#2563eb',
        enableCOD: enableCOD !== undefined ? Boolean(enableCOD) : true,
        seoTitle: seoTitle ? seoTitle.trim() : null,
        seoDescription: seoDescription ? seoDescription.trim() : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Store settings updated successfully',
      store: { ...updatedStore, settings },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update store settings' }, { status: 400 });
  }
}
