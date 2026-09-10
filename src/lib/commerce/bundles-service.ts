import { db } from '@/lib/db';

export class BundlesService {
  /**
   * Creates a product bundle package
   */
  static async createBundle(payload: {
    storeId: string;
    title: string;
    description?: string;
    bundlePrice: number;
    items: Array<{ productId: string; quantity: number }>;
  }) {
    return db.productBundle.create({
      data: {
        storeId: payload.storeId,
        title: payload.title,
        description: payload.description,
        bundlePrice: payload.bundlePrice,
        items: {
          create: payload.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }
      },
      include: { items: { include: { product: true } } }
    });
  }

  /**
   * Validates bundle inventory respecting component product stock
   */
  static async validateBundleStock(bundleId: string): Promise<{ available: boolean; maxQuantity: number }> {
    const bundle = await db.productBundle.findUnique({
      where: { id: bundleId },
      include: { items: { include: { product: true } } }
    });

    if (!bundle || !bundle.isActive) return { available: false, maxQuantity: 0 };

    let maxPossible = Infinity;
    for (const item of bundle.items) {
      if (item.product.stock <= 0) return { available: false, maxQuantity: 0 };
      const maxForThisItem = Math.floor(item.product.stock / item.quantity);
      if (maxForThisItem < maxPossible) {
        maxPossible = maxForThisItem;
      }
    }

    return { available: maxPossible > 0, maxQuantity: maxPossible === Infinity ? 0 : maxPossible };
  }
}
