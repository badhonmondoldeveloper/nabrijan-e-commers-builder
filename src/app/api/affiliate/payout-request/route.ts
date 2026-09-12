import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { getAuthSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || !session.userId) {
      return NextResponse.json({ message: 'UNAUTHORIZED: Please login first' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, paymentMethod, accountNumber } = body;

    const requestAmount = Number(amount);
    if (isNaN(requestAmount) || requestAmount < 500) {
      return NextResponse.json(
        { message: 'Minimum withdrawal payout threshold is ৳500 BDT' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !['bkash', 'nagad'].includes(paymentMethod.toLowerCase())) {
      return NextResponse.json({ message: 'Select a valid payment method (bKash or Nagad)' }, { status: 400 });
    }

    if (!accountNumber || accountNumber.trim().length < 11) {
      return NextResponse.json({ message: 'Provide a valid 11-digit mobile wallet number' }, { status: 400 });
    }

    const profile = await db.affiliateProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile || profile.status !== 'ACTIVE') {
      return NextResponse.json({ message: 'Active affiliate account is required' }, { status: 403 });
    }

    const currentBalance = Number(profile.availableBalance);
    if (currentBalance < requestAmount) {
      return NextResponse.json(
        { message: `Insufficient available balance (৳${currentBalance} BDT available)` },
        { status: 400 }
      );
    }

    // Check if there is already a PENDING request
    const pendingRequest = await db.payoutRequest.findFirst({
      where: { affiliateId: profile.id, status: 'PENDING' },
    });

    if (pendingRequest) {
      return NextResponse.json(
        { message: 'You already have a pending payout request under review. Please wait for Super Admin approval.' },
        { status: 400 }
      );
    }

    // Deduct available balance and create PayoutRequest atomically
    const [payout] = await db.$transaction([
      db.payoutRequest.create({
        data: {
          affiliateId: profile.id,
          amount: requestAmount,
          paymentMethod: paymentMethod.toLowerCase(),
          accountNumber: accountNumber.trim(),
          status: 'PENDING',
        },
      }),
      db.affiliateProfile.update({
        where: { id: profile.id },
        data: {
          availableBalance: { decrement: requestAmount },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      payout,
      message: `Payout request for ৳${requestAmount} BDT via ${paymentMethod.toUpperCase()} submitted successfully!`,
    });
  } catch (error: any) {
    console.error('Error submitting payout request:', error);
    return NextResponse.json({ message: error.message || 'Failed to submit payout request' }, { status: 500 });
  }
}
