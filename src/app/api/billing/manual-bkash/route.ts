import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { storeId, senderNumber, trxId } = await req.json();

    if (!storeId || !senderNumber || !trxId) {
      return NextResponse.json({ message: 'Store ID, bKash Mobile Number, and Transaction ID (TrxID) are required.' }, { status: 400 });
    }

    // Verify store ownership
    const store = await db.store.findFirst({
      where: { id: storeId, ownerId: user.id },
    });

    if (!store) {
      return NextResponse.json({ message: 'Store not found or permission denied.' }, { status: 404 });
    }

    // Check if TrxID has already been submitted
    const existingTxn = await db.manualPaymentSubmission.findUnique({
      where: { trxId: trxId.trim() },
    });

    if (existingTxn) {
      return NextResponse.json({ message: 'This bKash Transaction ID (TrxID) has already been submitted.' }, { status: 400 });
    }

    // Get platform settings for ৳500 package price
    const settings = await db.platformSettings.findUnique({ where: { id: 'default' } });
    const amount = settings?.fullPackagePrice ? Number(settings.fullPackagePrice) : 500;

    // Create ManualPaymentSubmission
    const submission = await db.manualPaymentSubmission.create({
      data: {
        storeId: store.id,
        userId: user.id,
        amount,
        method: 'BKASH',
        senderNumber: senderNumber.trim(),
        trxId: trxId.trim(),
        status: 'PENDING',
      },
    });

    // Ensure store status reflects pending payment verification
    if (store.status !== 'ACTIVE') {
      await db.store.update({
        where: { id: store.id },
        data: { status: 'PENDING_ACTIVATION' },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'bKash Transaction ID submitted successfully! Admin will verify your payment and activate your store shortly.',
      submission,
    });
  } catch (error: any) {
    console.error('Manual bKash payment submission error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({ message: 'storeId is required' }, { status: 400 });
    }

    const submissions = await db.manualPaymentSubmission.findMany({
      where: { storeId, userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ submissions });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error fetching submissions' }, { status: 500 });
  }
}
