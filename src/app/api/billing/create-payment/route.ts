import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { platformPaymentProvider } from '@/lib/payments/zinipay';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const { planSlug } = await req.json();

    const plan = await db.plan.findUnique({
      where: { slug: planSlug },
    });

    if (!plan) {
      return NextResponse.json({ message: 'Selected plan does not exist' }, { status: 404 });
    }

    const referenceId = `sub_${user.id}_${plan.id}`;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Call ZiniPay payment provider
    const paymentResponse = await platformPaymentProvider.createPayment({
      amount: plan.price,
      currency: 'BDT',
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone || '01700000000',
      referenceId,
      type: 'PLATFORM_SUBSCRIPTION',
      redirectUrl: `${baseUrl}/api/billing/verify-payment`,
      cancelUrl: `${baseUrl}/dashboard/billing?cancelled=true`,
    });

    // Create PaymentTransaction record
    await db.paymentTransaction.create({
      data: {
        referenceId,
        type: 'PLATFORM_SUBSCRIPTION',
        provider: 'ZINIPAY',
        amount: plan.price,
        currency: 'BDT',
        status: 'PENDING',
        gatewayTxnId: paymentResponse.transactionId,
        metadata: JSON.stringify({ planId: plan.id, userId: user.id }),
      },
    });

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResponse.paymentUrl,
      transactionId: paymentResponse.transactionId,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'ZiniPay payment session failed' }, { status: 400 });
  }
}
