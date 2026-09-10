import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'orders:read');

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const orders = await db.order.findMany({
      where: {
        storeId: params.storeId,
        ...(status ? { orderStatus: status as any } : {}),
      },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch orders' }, { status: 400 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { user } = await verifyStoreAccess(params.storeId, 'orders:write');
    const body = await req.json();
    const { orderId, newStatus, comment } = body;

    const order = await db.order.findFirst({
      where: { id: orderId, storeId: params.storeId },
    });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const updated = await db.order.update({
      where: { id: orderId },
      data: {
        orderStatus: newStatus,
        paymentStatus: newStatus === 'DELIVERED' ? 'PAID' : order.paymentStatus,
        statusHistory: {
          create: {
            status: newStatus,
            comment: comment || `Status updated to ${newStatus}`,
            changedById: user.id,
          },
        },
      },
      include: { statusHistory: true },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        actorId: user.id,
        actorEmail: user.email,
        storeId: params.storeId,
        action: 'ORDER_STATUS_UPDATE',
        resource: 'Order',
        resourceId: orderId,
        details: JSON.stringify({ oldStatus: order.orderStatus, newStatus, comment }),
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update order status' }, { status: 400 });
  }
}
