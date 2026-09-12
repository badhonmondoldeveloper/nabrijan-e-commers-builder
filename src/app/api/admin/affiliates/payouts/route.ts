import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { getAuthSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'UNAUTHORIZED: Super Admin access required' }, { status: 403 });
    }

    const payouts = await db.payoutRequest.findMany({
      include: {
        affiliate: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      payouts: payouts.map((p) => ({
        id: p.id,
        affiliateId: p.affiliateId,
        affiliateName: p.affiliate.user.name,
        affiliateEmail: p.affiliate.user.email,
        code: p.affiliate.code,
        amount: Number(p.amount),
        paymentMethod: p.paymentMethod,
        accountNumber: p.accountNumber,
        status: p.status,
        adminNote: p.adminNote,
        transactionId: p.transactionId,
        processedAt: p.processedAt,
        createdAt: p.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching admin payout requests:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch payout requests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'UNAUTHORIZED: Super Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { payoutId, action, transactionId, adminNote } = body;

    if (!payoutId || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ message: 'Valid payoutId and action (APPROVE or REJECT) required' }, { status: 400 });
    }

    const payout = await db.payoutRequest.findUnique({
      where: { id: payoutId },
      include: { affiliate: true },
    });

    if (!payout || payout.status !== 'PENDING') {
      return NextResponse.json({ message: 'Payout request not found or already processed' }, { status: 404 });
    }

    const amountNum = Number(payout.amount);

    if (action === 'APPROVE') {
      if (!transactionId || transactionId.trim().length === 0) {
        return NextResponse.json({ message: 'bKash/Nagad Transaction ID is required to approve payout' }, { status: 400 });
      }

      await db.$transaction([
        db.payoutRequest.update({
          where: { id: payoutId },
          data: {
            status: 'APPROVED',
            transactionId: transactionId.trim(),
            adminNote: adminNote || 'Paid out via bKash/Nagad MFS',
            processedAt: new Date(),
          },
        }),
        db.affiliateProfile.update({
          where: { id: payout.affiliateId },
          data: {
            paidOutAmount: { increment: amountNum },
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: `Payout request of ৳${amountNum} BDT approved and marked as paid with Txn ID ${transactionId}`,
      });
    } else {
      // REJECT: refund money back to affiliate's availableBalance
      await db.$transaction([
        db.payoutRequest.update({
          where: { id: payoutId },
          data: {
            status: 'REJECTED',
            adminNote: adminNote || 'Payout request rejected by Super Admin',
            processedAt: new Date(),
          },
        }),
        db.affiliateProfile.update({
          where: { id: payout.affiliateId },
          data: {
            availableBalance: { increment: amountNum },
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: `Payout request rejected. ৳${amountNum} BDT refunded to affiliate balance.`,
      });
    }
  } catch (error: any) {
    console.error('Error processing admin payout request:', error);
    return NextResponse.json({ message: error.message || 'Failed to process payout request' }, { status: 500 });
  }
}
