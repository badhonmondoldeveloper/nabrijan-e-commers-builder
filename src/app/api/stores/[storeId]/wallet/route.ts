import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';
import { Prisma } from '@prisma/client';

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'billing:write');

    let wallet = await db.sellerWallet.findUnique({
      where: { storeId: params.storeId },
      include: {
        transactions: {
          take: 50,
          orderBy: { createdAt: 'desc' },
        },
        settlements: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!wallet) {
      wallet = await db.sellerWallet.create({
        data: {
          storeId: params.storeId,
          balance: new Prisma.Decimal('0.00'),
          pendingBalance: new Prisma.Decimal('0.00'),
          pendingPayouts: new Prisma.Decimal('0.00'),
          totalEarned: new Prisma.Decimal('0.00'),
          totalCommissionPaid: new Prisma.Decimal('0.00'),
          totalWithdrawn: new Prisma.Decimal('0.00'),
        },
        include: {
          transactions: true,
          settlements: true,
        },
      });
    }

    const platformSettings = await db.platformSettings.findUnique({ where: { id: 'global-settings' } });

    return NextResponse.json({
      success: true,
      wallet: {
        ...wallet,
        balance: wallet.balance.toString(),
        pendingBalance: wallet.pendingBalance.toString(),
        pendingPayouts: wallet.pendingPayouts.toString(),
        totalEarned: wallet.totalEarned.toString(),
        totalCommissionPaid: wallet.totalCommissionPaid.toString(),
        totalWithdrawn: wallet.totalWithdrawn.toString(),
        transactions: wallet.transactions.map((t) => ({
          ...t,
          amount: t.amount.toString(),
          commissionAmount: t.commissionAmount.toString(),
          netAmount: t.netAmount.toString(),
        })),
        settlements: wallet.settlements.map((s) => ({
          ...s,
          amount: s.amount.toString(),
        })),
      },
      minWithdrawalLimit: platformSettings?.minWithdrawalLimit ? platformSettings.minWithdrawalLimit.toString() : '500.00',
      commissionRate: platformSettings?.defaultCommissionRate ? platformSettings.defaultCommissionRate.toString() : '0.0200',
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch wallet info' }, { status: 400 });
  }
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'billing:write');

    const body = await req.json();
    const { amount, paymentMethod, accountDetails } = body;

    const withdrawDecimal = new Prisma.Decimal(amount || '0');
    if (withdrawDecimal.lte(0)) {
      return NextResponse.json({ message: 'Invalid withdrawal amount' }, { status: 400 });
    }

    const platformSettings = await db.platformSettings.findUnique({ where: { id: 'global-settings' } });
    const minLimit = platformSettings?.minWithdrawalLimit ?? new Prisma.Decimal('500.00');

    if (withdrawDecimal.lt(minLimit)) {
      return NextResponse.json({ message: `Minimum withdrawal amount is ৳${minLimit}` }, { status: 400 });
    }

    const wallet = await db.sellerWallet.findUnique({
      where: { storeId: params.storeId },
    });

    if (!wallet || wallet.balance.lt(withdrawDecimal)) {
      return NextResponse.json({ message: 'Insufficient available wallet balance for this payout request' }, { status: 400 });
    }

    // Process payout request in atomic transaction
    const settlement = await db.$transaction(async (tx) => {
      // 1. Create Settlement Request
      const newSettlement = await tx.sellerSettlement.create({
        data: {
          walletId: wallet.id,
          storeId: params.storeId,
          amount: withdrawDecimal,
          payoutMethod: paymentMethod || 'BKASH',
          payoutAccountDetails: accountDetails || '',
          status: 'PENDING',
        },
      });

      // 2. Deduct from available balance and move to pendingPayouts
      await tx.sellerWallet.update({
        where: { id: wallet.id },
        data: {
          balance: wallet.balance.sub(withdrawDecimal),
          pendingPayouts: wallet.pendingPayouts.add(withdrawDecimal),
        },
      });

      // 3. Create Immutable Ledger Transaction
      await tx.ledgerTransaction.create({
        data: {
          walletId: wallet.id,
          storeId: params.storeId,
          type: 'SETTLEMENT',
          amount: withdrawDecimal,
          commissionAmount: new Prisma.Decimal('0.00'),
          netAmount: withdrawDecimal,
          currency: 'BDT',
          referenceId: newSettlement.id,
          description: `Payout Request (${paymentMethod}) Submitted — Reserved from Available Balance`,
        },
      });

      return newSettlement;
    });

    return NextResponse.json({
      success: true,
      message: 'Payout settlement request submitted successfully!',
      settlement: {
        ...settlement,
        amount: settlement.amount.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Settlement request failed' }, { status: 400 });
  }
}
