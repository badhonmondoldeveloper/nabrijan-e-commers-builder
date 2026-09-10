import { db } from '@/lib/db';

export class ReorderService {
  /**
   * One-click Buy Again validator
   * Validates product status, stock availability, and current live prices
   */
  static async validateAndPrepareReorder(orderId: string) {
    const originalOrder = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: true
      }
    });

    if (!originalOrder) {
      throw new Error('Original order not found');
    }

    const reorderItems = [];
    let isAnyItemOutOfStock = false;

    for (const item of originalOrder.items) {
      const liveProduct = await db.product.findUnique({
        where: { id: item.productId }
      });

      if (!liveProduct || liveProduct.status !== 'ACTIVE' || liveProduct.stock <= 0) {
        isAnyItemOutOfStock = true;
        continue;
      }

      // Determine current live price (sale price if available, else regular price)
      const currentPrice = liveProduct.salePrice && liveProduct.salePrice > 0 
        ? liveProduct.salePrice 
        : liveProduct.regularPrice;

      const qtyToOrder = Math.min(item.quantity, liveProduct.stock);

      reorderItems.push({
        productId: liveProduct.id,
        variantId: item.variantId,
        title: liveProduct.title,
        price: currentPrice,
        quantity: qtyToOrder,
        total: currentPrice * qtyToOrder
      });
    }

    if (reorderItems.length === 0) {
      throw new Error('All items from this order are currently out of stock or archived');
    }

    return {
      storeId: originalOrder.storeId,
      customerName: originalOrder.customerName,
      customerPhone: originalOrder.customerPhone,
      shippingAddress: originalOrder.shippingAddress,
      shippingDistrict: originalOrder.shippingDistrict,
      items: reorderItems,
      hasOutOfStockWarning: isAnyItemOutOfStock
    };
  }
}
