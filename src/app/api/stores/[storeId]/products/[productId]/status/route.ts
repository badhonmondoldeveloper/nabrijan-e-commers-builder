import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId);

    const body = await req.json();
    const { status } = body;

    if (!status || !['ACTIVE', 'INACTIVE', 'DRAFT'].includes(status)) {
      return NextResponse.json({ message: 'Invalid product status. Allowed: ACTIVE, INACTIVE, DRAFT' }, { status: 400 });
    }

    const product = await db.product.update({
      where: { id: params.productId, storeId: params.storeId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      product: { id: product.id, title: product.title, status: product.status },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update product status' }, { status: 500 });
  }
}
