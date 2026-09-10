import { db } from '@/lib/db/prisma';
import crypto from 'crypto';

export class PaymentIdempotencyService {
  /**
   * Generates a deterministic payload hash for incoming webhooks
   */
  static generatePayloadHash(payload: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  }

  /**
   * Checks if a webhook event or gateway transaction was already processed
   */
  static async isProcessed(provider: string, gatewayTxnId: string): Promise<boolean> {
    const existing = await db.paymentTransaction.findFirst({
      where: {
        provider,
        gatewayTxnId,
        status: 'PAID',
      },
    });

    return !!existing;
  }

  /**
   * Safely logs audit trail and returns whether action should proceed
   */
  static async processOnce(
    provider: string,
    gatewayTxnId: string,
    actionFn: () => Promise<void>
  ): Promise<{ alreadyProcessed: boolean; success: boolean }> {
    const alreadyProcessed = await this.isProcessed(provider, gatewayTxnId);

    if (alreadyProcessed) {
      console.log(`[IDEMPOTENCY] Skipping duplicate event for ${provider}:${gatewayTxnId}`);
      return { alreadyProcessed: true, success: true };
    }

    // Execute business logic
    await actionFn();

    // Register transaction record to enforce idempotency
    await db.paymentTransaction.upsert({
      where: { id: `idemp_${gatewayTxnId}` },
      update: { status: 'PAID' },
      create: {
        id: `idemp_${gatewayTxnId}`,
        referenceId: gatewayTxnId,
        type: 'IDEMPOTENCY_CHECK',
        provider,
        amount: 0,
        currency: 'BDT',
        status: 'PAID',
        gatewayTxnId,
      },
    });

    return { alreadyProcessed: false, success: true };
  }
}
