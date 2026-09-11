import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'products:read');

    const products = await db.product.findMany({
      where: { storeId: params.storeId },
      select: {
        id: true,
        title: true,
        slug: true,
        regularPrice: true,
        salePrice: true,
        stock: true,
        status: true,
        marketplaceListing: true,
        images: {
          select: { url: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch store marketplace products' }, { status: 400 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'products:write');

    const body = await req.json();
    const { productId, isMarketplaceListed, marketplaceCategory } = body;

    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    const product = await db.product.findFirst({
      where: { id: productId, storeId: params.storeId },
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const platformSettings = await db.platformSettings.findUnique({ where: { id: 'global-settings' } });
    const autoApprove = platformSettings?.autoApproveProducts ?? false;

    // Upsert MarketplaceListing
    const listing = await db.marketplaceListing.upsert({
      where: { productId },
      update: {
        status: isMarketplaceListed ? 'ACTIVE' : 'INACTIVE',
        marketplaceCategory: marketplaceCategory ?? undefined,
        moderationStatus: isMarketplaceListed ? (autoApprove ? 'APPROVED' : 'PENDING') : 'PENDING',
      },
      create: {
        productId,
        storeId: params.storeId,
        status: isMarketplaceListed ? 'ACTIVE' : 'INACTIVE',
        marketplaceCategory: marketplaceCategory || 'Fashion & Clothing',
        moderationStatus: autoApprove ? 'APPROVED' : 'PENDING',
      },
    });

    // Update Product flags for compatibility
    await db.product.update({
      where: { id: productId },
      data: {
        isMarketplaceListed,
        marketplaceStatus: listing.moderationStatus,
        marketplaceCategory: listing.marketplaceCategory,
      },
    });

    return NextResponse.json({ success: true, listing });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update marketplace status' }, { status: 400 });
  }
}
