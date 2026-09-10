import { db } from '@/lib/db/prisma';

export interface StoreMembershipContext {
  storeId: string;
  storeName: string;
  storeSlug: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'SUPER_ADMIN';
  isOwner: boolean;
}

export class StoreMembershipService {
  /**
   * Retrieves all stores where the user is an owner or invited staff member
   */
  static fontGetAccessibleStores(userId: string) {
    return db.store.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { staff: { some: { userId, status: 'ACTIVE' } } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        ownerId: true,
        logo: true,
      },
    });
  }

  /**
   * Resolves the active store context for an authenticated request
   */
  static async resolveStoreContext(userId: string, targetStoreId: string): Promise<StoreMembershipContext | null> {
    const store = await db.store.findUnique({
      where: { id: targetStoreId },
    });

    if (!store) return null;

    if (store.ownerId === userId) {
      return {
        storeId: store.id,
        storeName: store.name,
        storeSlug: store.slug,
        role: 'OWNER',
        isOwner: true,
      };
    }

    const staff = await db.staff.findFirst({
      where: { storeId: store.id, userId, status: 'ACTIVE' },
    });

    if (staff) {
      return {
        storeId: store.id,
        storeName: store.name,
        storeSlug: store.slug,
        role: staff.role as any,
        isOwner: false,
      };
    }

    return null;
  }
}
