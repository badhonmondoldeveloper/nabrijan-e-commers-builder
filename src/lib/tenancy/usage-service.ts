import { db } from '@/lib/db/prisma';

export interface UsageCheckResult {
  allowed: boolean;
  currentCount: number;
  limit: number;
  reason?: string;
}

export class UsageService {
  /**
   * Verifies if a user can create a new store based on their active subscription plan storeLimit
   */
  static async canCreateStore(userId: string): Promise<UsageCheckResult> {
    const userStoresCount = await db.store.count({
      where: { ownerId: userId },
    });

    const subscription = await db.subscription.findFirst({
      where: { userId, status: { in: ['ACTIVE', 'TRIALING'] } },
      include: { plan: true },
    });

    // Default limit for free/trial starter if no active subscription record found
    const limit = subscription?.plan?.storeLimit ?? 1;

    if (userStoresCount >= limit) {
      return {
        allowed: false,
        currentCount: userStoresCount,
        limit,
        reason: `Store limit reached (${userStoresCount}/${limit}). Please upgrade your subscription plan to create additional stores.`,
      };
    }

    return { allowed: true, currentCount: userStoresCount, limit };
  }

  /**
   * Verifies if a store can create a new product based on subscription productLimit
   */
  static async canCreateProduct(storeId: string): Promise<UsageCheckResult> {
    const store = await db.store.findUnique({
      where: { id: storeId },
      include: {
        subscriptions: {
          where: { status: { in: ['ACTIVE', 'TRIALING'] } },
          include: { plan: true },
          take: 1,
        },
      },
    });

    if (!store) {
      return { allowed: false, currentCount: 0, limit: 0, reason: 'Store not found' };
    }

    const currentProductCount = await db.product.count({
      where: { storeId },
    });

    const activeSub = store.subscriptions[0];
    const limit = activeSub?.plan?.productLimit ?? 100;

    if (currentProductCount >= limit) {
      return {
        allowed: false,
        currentCount: currentProductCount,
        limit,
        reason: `Product limit reached (${currentProductCount}/${limit}). Upgrade your store plan to add more catalog items.`,
      };
    }

    return { allowed: true, currentCount: currentProductCount, limit };
  }

  /**
   * Verifies staff invitation limits
   */
  static async canInviteStaff(storeId: string): Promise<UsageCheckResult> {
    const currentStaffCount = await db.staff.count({
      where: { storeId, status: 'ACTIVE' },
    });

    const store = await db.store.findUnique({
      where: { id: storeId },
      include: {
        subscriptions: {
          where: { status: { in: ['ACTIVE', 'TRIALING'] } },
          include: { plan: true },
          take: 1,
        },
      },
    });

    const activeSub = store?.subscriptions[0];
    const limit = activeSub?.plan?.staffLimit ?? 2;

    if (currentStaffCount >= limit) {
      return {
        allowed: false,
        currentCount: currentStaffCount,
        limit,
        reason: `Staff account limit reached (${currentStaffCount}/${limit}).`,
      };
    }

    return { allowed: true, currentCount: currentStaffCount, limit };
  }
}
