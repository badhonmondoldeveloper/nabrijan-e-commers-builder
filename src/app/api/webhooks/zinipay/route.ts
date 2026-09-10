import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { platformPaymentProvider } from '@/lib/payments/zinipay';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const result = await platformPaymentProvider.handleWebhook(payload);

    if (result.verified && result.transactionId) {
      const transaction = await db.paymentTransaction.findFirst({
        where: { referenceId: result.transactionId },
      });

      if (transaction) {
        await db.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            status: result.status === 'COMPLETED' ? 'COMPLETED' : 'FAILED',
            rawResponse: JSON.stringify(payload),
          },
        });
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('ZiniPay webhook error:', error);
    return NextResponse.json({ message: error.message || 'Webhook failed' }, { status: 400 });
  }
}
