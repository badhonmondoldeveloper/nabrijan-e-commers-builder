import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';
import { Prisma } from '@prisma/client';

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'orders:write');

    const body = await req.json();
    const { sellerOrderId } = body;

    if (!sellerOrderId) {
      return NextResponse.json({ message: 'Seller Order ID is required' }, { status: 400 });
    }

    const sellerOrder = await db.sellerOrder.findFirst({
      where: { id: sellerOrderId, storeId: params.storeId },
    });

    if (!sellerOrder) {
      return NextResponse.json({ message: 'Seller order not found' }, { status: 404 });
    }

    if (sellerOrder.settlementStatus === 'CLEARED' || sellerOrder.settlementStatus === 'SETTLED') {
      return NextResponse.json({ message: 'Order has already been cleared' }, { status: 400 });
    }

    const wallet = await db.sellerWallet.findUnique({
      where: { storeId: params.storeId },
    });

    if (!wallet) {
      return NextResponse.json({ message: 'Seller wallet not found' }, { status: 404 });
    }

    const netAmount = sellerOrder.netSellerAmount;

    // Execute Clearance Transaction
    await db.$transaction(async (tx) => {
      // 1. Mark SellerOrder settlementStatus as CLEARED & orderStatus as DELIVERED
      await tx.sellerOrder.update({
        where: { id: sellerOrderId },
        data: {
          settlementStatus: 'CLEARED',
          orderStatus: 'DELIVERED',
          fulfillmentStatus: 'DELIVERED',
          clearanceDate: new Date(),
        },
      });

      // 2. Transfer funds from pendingBalance to available balance (balance)
      await tx.sellerWallet.update({
        where: { id: wallet.id },
        data: {
          pendingBalance: wallet.pendingBalance.sub(netAmount),
          balance: wallet.balance.add(netAmount),
        },
      });

      // 3. Insert Ledger Transaction (SALE_AVAILABLE)
      await tx.ledgerTransaction.create({
        data: {
          walletId: wallet.id,
          storeId: params.storeId,
          orderId: sellerOrderId,
          type: 'SALE_AVAILABLE',
          amount: sellerOrder.totalAmount,
          commissionAmount: sellerOrder.commissionAmount,
          netAmount,
          currency: 'BDT',
          referenceId: sellerOrderId,
          description: `Order #${sellerOrder.orderNumber} Delivered & Cleared to Available Balance`,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Order #${sellerOrder.orderNumber} cleared to Available Balance!`,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Order clearance failed' }, { status: 400 });
  }
}
