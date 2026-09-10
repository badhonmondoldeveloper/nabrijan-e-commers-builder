import { db } from '@/lib/db';

export class WishlistService {
  static async toggleWishlist(storeId: string, customerPhone: string, productId: string) {
    let wishlist = await db.wishlist.findFirst({
      where: { storeId, customerId: customerPhone },
      include: { items: true }
    });

    if (!wishlist) {
      wishlist = await db.wishlist.create({
        data: { storeId, customerId: customerPhone }
      }) as any;
    }

    const existingItem = await db.wishlistItem.findFirst({
      where: { wishlistId: wishlist!.id, productId }
    });

    if (existingItem) {
      await db.wishlistItem.delete({ where: { id: existingItem.id } });
      return { added: false, message: 'Item removed from wishlist' };
    } else {
      await db.wishlistItem.create({
        data: { wishlistId: wishlist!.id, productId }
      });
      return { added: true, message: 'Item added to wishlist' };
    }
  }

  static async getWishlist(storeId: string, customerPhone: string) {
    return db.wishlist.findFirst({
      where: { storeId, customerId: customerPhone },
      include: {
        items: {
          include: { product: { include: { images: true } } }
        }
      }
    });
  }
}
