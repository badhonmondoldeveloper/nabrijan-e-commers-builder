import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifySuperAdmin } from '@/lib/auth/rbac';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  try {
    await verifySuperAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'ALL';

    const settlements = await db.sellerSettlement.findMany({
      where: {
        ...(status !== 'ALL' ? { status: status as any } : {}),
      },
      include: {
        wallet: {
          include: {
            store: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      settlements: settlements.map((s) => ({
        ...s,
        amount: s.amount.toString(),
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch settlement requests' }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    await verifySuperAdmin();

    const body = await req.json();
    const { settlementId, action, transactionId, notes } = body;

    if (!settlementId || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ message: 'Invalid request parameters' }, { status: 400 });
    }

    const settlement = await db.sellerSettlement.findUnique({
      where: { id: settlementId },
      include: { wallet: true },
    });

    if (!settlement || settlement.status !== 'PENDING') {
      return NextResponse.json({ message: 'Settlement request is not pending' }, { status: 400 });
    }

    const updatedSettlement = await db.$transaction(async (tx) => {
      if (action === 'APPROVE') {
        // 1. Mark settlement as PAID
        const updated = await tx.sellerSettlement.update({
          where: { id: settlementId },
          data: {
            status: 'PAID',
            processedAt: new Date(),
            transactionId: transactionId || null,
            adminNotes: notes || 'Payout approved and executed by Super Admin',
          },
        });

        // 2. Reduce pendingPayouts and increment totalWithdrawn
        await tx.sellerWallet.update({
          where: { id: settlement.walletId },
          data: {
            pendingPayouts: settlement.wallet.pendingPayouts.sub(settlement.amount),
            totalWithdrawn: settlement.wallet.totalWithdrawn.add(settlement.amount),
          },
        });

        return updated;
      } else {
        // REJECT action: Refund pendingPayouts back to available balance
        const updated = await tx.sellerSettlement.update({
          where: { id: settlementId },
          data: {
            status: 'REJECTED',
            processedAt: new Date(),
            adminNotes: notes || 'Payout request rejected by Super Admin',
          },
        });

        await tx.sellerWallet.update({
          where: { id: settlement.walletId },
          data: {
            pendingPayouts: settlement.wallet.pendingPayouts.sub(settlement.amount),
            balance: settlement.wallet.balance.add(settlement.amount),
          },
        });

        // Add ledger transaction for refund reversal
        await tx.ledgerTransaction.create({
          data: {
            walletId: settlement.walletId,
            storeId: settlement.storeId,
            type: 'SETTLEMENT_REVERSAL',
            amount: settlement.amount,
            commissionAmount: new Prisma.Decimal('0.00'),
            netAmount: settlement.amount,
            currency: 'BDT',
            referenceId: settlementId,
            description: `Payout Request Rejected & Available Balance Restored`,
          },
        });

        return updated;
      }
    });

    return NextResponse.json({
      success: true,
      message: `Settlement ${action === 'APPROVE' ? 'approved' : 'rejected'} successfully`,
      settlement: {
        ...updatedSettlement,
        amount: updatedSettlement.amount.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Settlement update failed' }, { status: 400 });
  }
}
