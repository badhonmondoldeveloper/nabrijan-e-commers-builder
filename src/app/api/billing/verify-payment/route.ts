import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { platformPaymentProvider } from '@/lib/payments/zinipay';
import { processAffiliateCommission } from '@/lib/affiliate/engine';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get('invoice_id') || searchParams.get('val_id') || searchParams.get('transaction_id') || searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.redirect(new URL('/dashboard/billing?error=missing_transaction', req.url));
    }

    // Mandatory Server-Side ZiniPay Verification
    const verification = await platformPaymentProvider.verifyPayment(transactionId);

    if (!verification.success || verification.status !== 'PAID') {
      return NextResponse.redirect(new URL('/dashboard/billing?error=payment_failed', req.url));
    }

    // Find pending payment record
    const txnRecord = await db.paymentTransaction.findFirst({
      where: { gatewayTxnId: transactionId },
    });

    if (txnRecord) {
      await db.paymentTransaction.update({
        where: { id: txnRecord.id },
        data: { status: 'PAID' },
      });

      const metadata = txnRecord.metadata ? JSON.parse(txnRecord.metadata) : {};

      if (metadata.userId && metadata.planId) {
        // Upgrade/Update Subscription
        const sub = await db.subscription.upsert({
          where: { id: txnRecord.referenceId },
          update: {
            status: 'ACTIVE',
            planId: metadata.planId,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
          create: {
            id: txnRecord.referenceId,
            userId: metadata.userId,
            planId: metadata.planId,
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });

        // Generate Invoice
        await db.invoice.create({
          data: {
            subscriptionId: sub.id,
            userId: metadata.userId,
            amount: txnRecord.amount,
            status: 'PAID',
            paidAt: new Date(),
          },
        });

        // Trigger 15% Recurring Affiliate Commission Calculation
        try {
          const numAmount = Number(txnRecord.amount);
          await processAffiliateCommission(metadata.userId, numAmount, txnRecord.id);
        } catch (affErr) {
          console.error('Failed to process affiliate commission:', affErr);
        }

        // Audit log
        await db.auditLog.create({
          data: {
            actorId: metadata.userId,
            actorEmail: 'system@zinipay',
            action: 'SUBSCRIPTION_PAYMENT_VERIFIED',
            resource: 'Subscription',
            resourceId: sub.id,
            details: JSON.stringify({ transactionId, amount: txnRecord.amount }),
          },
        });
      }
    }

    return NextResponse.redirect(new URL('/dashboard/billing?success=true', req.url));
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(new URL('/dashboard/billing?error=verification_exception', req.url));
  }
}
