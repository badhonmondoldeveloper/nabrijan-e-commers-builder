import { db } from '@/lib/db';

export class AiCreditsService {
  /**
   * Checks remaining AI credits for store owner
   */
  static async getRemainingCredits(storeId: string): Promise<number> {
    const store = await db.store.findUnique({
      where: { id: storeId },
      include: {
        subscriptions: {
          include: { plan: true }
        }
      }
    });

    if (!store) return 0;
    const planCredits = store.subscriptions[0]?.plan?.aiCredits || 50;

    const usedCount = await db.aiUsage.count({
      where: { storeId }
    });

    return Math.max(0, planCredits - usedCount);
  }

  /**
   * Atomically deducts AI credit for copy generation action
   */
  static async deductCredit(storeId: string, promptType: string, userId: string = 'system'): Promise<boolean> {
    const remaining = await this.getRemainingCredits(storeId);
    if (remaining <= 0) {
      throw new Error('AI credit balance exhausted. Upgrade your plan or purchase an AI Credit Pack to continue.');
    }

    await db.aiUsage.create({
      data: {
        storeId,
        userId,
        actionType: promptType,
        creditsUsed: 1
      }
    });

    return true;
  }
}
