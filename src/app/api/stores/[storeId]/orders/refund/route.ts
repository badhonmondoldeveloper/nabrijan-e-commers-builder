import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';
import { Prisma } from '@prisma/client';

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'orders:write');

    const body = await req.json();
    const { sellerOrderId, refundReason } = body;

    if (!sellerOrderId) {
      return NextResponse.json({ message: 'Seller Order ID is required' }, { status: 400 });
    }

    const sellerOrder = await db.sellerOrder.findFirst({
      where: { id: sellerOrderId, storeId: params.storeId },
    });

    if (!sellerOrder) {
      return NextResponse.json({ message: 'Seller order not found' }, { status: 404 });
    }

    if (sellerOrder.orderStatus === 'REFUNDED') {
      return NextResponse.json({ message: 'Order has already been refunded' }, { status: 400 });
    }

    const wallet = await db.sellerWallet.findUnique({
      where: { storeId: params.storeId },
    });

    if (!wallet) {
      return NextResponse.json({ message: 'Seller wallet not found' }, { status: 404 });
    }

    const grossRefund = sellerOrder.totalAmount;
    const commissionReversal = sellerOrder.commissionAmount;
    const netSellerReversal = sellerOrder.netSellerAmount;

    await db.$transaction(async (tx) => {
      // 1. Update SellerOrder status to REFUNDED
      await tx.sellerOrder.update({
        where: { id: sellerOrderId },
        data: {
          orderStatus: 'REFUNDED',
          paymentStatus: 'REFUNDED',
          settlementStatus: 'CANCELLED',
        },
      });

      // 2. Create Reversal Ledger Transactions
      // Ledger Entry 1: REFUND (Debits gross sale amount)
      await tx.ledgerTransaction.create({
        data: {
          walletId: wallet.id,
          storeId: params.storeId,
          orderId: sellerOrderId,
          type: 'REFUND',
          amount: grossRefund,
          commissionAmount: commissionReversal,
          netAmount: netSellerReversal,
          currency: 'BDT',
          referenceId: sellerOrderId,
          description: `Order #${sellerOrder.orderNumber} Refunded — Reversal (${refundReason || 'Customer Return/Cancellation'})`,
        },
      });

      // Ledger Entry 2: COMMISSION_REVERSAL
      await tx.ledgerTransaction.create({
        data: {
          walletId: wallet.id,
          storeId: params.storeId,
          orderId: sellerOrderId,
          type: 'COMMISSION_REVERSAL',
          amount: commissionReversal,
          commissionAmount: commissionReversal,
          netAmount: new Prisma.Decimal('0.00'),
          currency: 'BDT',
          referenceId: sellerOrderId,
          description: `Platform Commission Reversal for Order #${sellerOrder.orderNumber}`,
        },
      });

      // 3. Deduct from Seller Wallet (pendingBalance if unsettled, or available balance if cleared)
      if (sellerOrder.settlementStatus === 'CLEARED' || sellerOrder.settlementStatus === 'SETTLED') {
        await tx.sellerWallet.update({
          where: { id: wallet.id },
          data: {
            balance: wallet.balance.sub(netSellerReversal),
            totalEarned: wallet.totalEarned.sub(netSellerReversal),
            totalCommissionPaid: wallet.totalCommissionPaid.sub(commissionReversal),
          },
        });
      } else {
        await tx.sellerWallet.update({
          where: { id: wallet.id },
          data: {
            pendingBalance: wallet.pendingBalance.sub(netSellerReversal),
            totalEarned: wallet.totalEarned.sub(netSellerReversal),
            totalCommissionPaid: wallet.totalCommissionPaid.sub(commissionReversal),
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: `Order #${sellerOrder.orderNumber} successfully refunded and financial reversals recorded!`,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Refund processing failed' }, { status: 400 });
  }
}
