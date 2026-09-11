import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifySuperAdmin } from '@/lib/auth/rbac';

export async function GET(req: Request) {
  try {
    await verifySuperAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'ALL';

    const products = await db.product.findMany({
      where: {
        isMarketplaceListed: true,
        ...(status !== 'ALL' ? { marketplaceStatus: status as any } : {}),
      },
      include: {
        store: { select: { name: true, slug: true } },
        images: { select: { url: true }, take: 1 },
        marketplaceListing: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      products: products.map((p) => ({
        ...p,
        regularPrice: p.regularPrice.toString(),
        salePrice: p.salePrice ? p.salePrice.toString() : null,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch marketplace products' }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    await verifySuperAdmin();

    const body = await req.json();
    const { productId, action, rejectionReason, isFeaturedMarketplace } = body;

    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    let updateData: any = {};
    let listingUpdateData: any = {};

    if (action === 'APPROVE') {
      updateData.marketplaceStatus = 'APPROVED';
      listingUpdateData.moderationStatus = 'APPROVED';
      listingUpdateData.approvedAt = new Date();
    } else if (action === 'REJECT') {
      updateData.marketplaceStatus = 'REJECTED';
      listingUpdateData.moderationStatus = 'REJECTED';
      listingUpdateData.rejectionReason = rejectionReason || 'Product violates marketplace guidelines';
      listingUpdateData.rejectedAt = new Date();
    }

    if (typeof isFeaturedMarketplace === 'boolean') {
      updateData.isFeaturedMarketplace = isFeaturedMarketplace;
      listingUpdateData.isFeatured = isFeaturedMarketplace;
    }

    const product = await db.product.update({
      where: { id: productId },
      data: updateData,
    });

    await db.marketplaceListing.upsert({
      where: { productId },
      update: listingUpdateData,
      create: {
        productId,
        storeId: product.storeId,
        status: 'ACTIVE',
        moderationStatus: listingUpdateData.moderationStatus || 'APPROVED',
        isFeatured: Boolean(isFeaturedMarketplace),
      },
    });

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        regularPrice: product.regularPrice.toString(),
        salePrice: product.salePrice ? product.salePrice.toString() : null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update product' }, { status: 400 });
  }
}
