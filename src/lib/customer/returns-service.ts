import { db } from '@/lib/db';

export class ReturnsService {
  /**
   * Submit a customer return request
   */
  static async createReturnRequest(payload: {
    storeId: string;
    orderId: string;
    customerPhone: string;
    customerName: string;
    reason: string;
    items: Array<{ productId: string; quantity: number; price: number }>;
  }) {
    const order = await db.order.findUnique({ where: { id: payload.orderId } });
    if (!order) throw new Error('Order not found');

    const totalRefundAmount = payload.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return db.returnRequest.create({
      data: {
        storeId: payload.storeId,
        orderId: payload.orderId,
        customerPhone: payload.customerPhone,
        customerName: payload.customerName,
        reason: payload.reason,
        status: 'REQUESTED',
        refundAmount: totalRefundAmount,
        items: {
          create: payload.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });
  }

  /**
   * Approve return and process refund atomically
   */
  static async approveReturn(returnRequestId: string, adminNotes?: string) {
    const returnReq = await db.returnRequest.findUnique({
      where: { id: returnRequestId }
    });
    if (!returnReq) throw new Error('Return request not found');

    return db.$transaction(async (tx) => {
      const updated = await tx.returnRequest.update({
        where: { id: returnRequestId },
        data: {
          status: 'REFUNDED',
          adminNotes: adminNotes || 'Approved by merchant',
          updatedAt: new Date()
        }
      });

      const refund = await tx.refund.create({
        data: {
          returnRequestId,
          amount: returnReq.refundAmount,
          method: 'MANUAL_COD',
          referenceNumber: `RFD-${Date.now().toString().slice(-8)}`
        }
      });

      return { updated, refund };
    });
  }
}
