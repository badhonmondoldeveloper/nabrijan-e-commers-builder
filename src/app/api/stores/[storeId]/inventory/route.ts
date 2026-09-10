import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { user } = await verifyStoreAccess(params.storeId, 'inventory:write');
    const { productId, type, quantity, notes } = await req.json();

    if (!productId || !type || !quantity) {
      return NextResponse.json({ message: 'Product, type, and quantity are required' }, { status: 400 });
    }

    const product = await db.product.findFirst({
      where: { id: productId, storeId: params.storeId },
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const qtyNumber = parseInt(quantity, 10);
    const previousStock = product.stock;
    const isDecrement = type === 'SALE' || type === 'DAMAGE';
    const newStock = isDecrement ? Math.max(0, previousStock - qtyNumber) : previousStock + qtyNumber;

    // Update product stock and log transaction
    await db.product.update({
      where: { id: product.id },
      data: { stock: newStock },
    });

    const transaction = await db.inventoryTransaction.create({
      data: {
        storeId: params.storeId,
        productId: product.id,
        type,
        quantity: qtyNumber,
        previousStock,
        newStock,
        notes: notes || `Manual stock adjustment (${type})`,
        createdById: user.id,
      },
    });

    return NextResponse.json({ success: true, transaction, newStock });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Inventory adjustment failed' }, { status: 400 });
  }
}
