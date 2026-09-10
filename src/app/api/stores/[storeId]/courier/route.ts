import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';
import { CourierService } from '@/lib/integrations/courier-service';
import { SMSService } from '@/lib/integrations/sms-service';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'orders:write');

    const body = await req.json();
    const { orderId, provider } = body;

    if (!orderId || !['STEADFAST', 'PATHAO'].includes(provider)) {
      return NextResponse.json(
        { message: 'Invalid orderId or provider' },
        { status: 400 }
      );
    }

    const order = await db.order.findFirst({
      where: { id: orderId, storeId: params.storeId },
      include: { store: true },
    });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Dispatch Courier Consignment
    const result = await CourierService.createConsignment(provider, {
      storeName: order.store.name,
      orderNumber: order.orderNumber,
      recipientName: order.customerName,
      recipientPhone: order.customerPhone,
      recipientAddress: order.shippingAddress,
      recipientDistrict: order.shippingDistrict,
      codAmount: order.totalAmount,
    });

    // Update Order Status to PACKED and add history log
    await db.order.update({
      where: { id: order.id },
      data: {
        orderStatus: 'PACKED',
        statusHistory: {
          create: {
            status: 'PACKED',
            comment: `Booked with ${provider} Courier (Tracking: ${result.trackingCode})`,
          },
        },
      },
    });

    // Send Automated SMS Notification to Customer
    await SMSService.sendSMS({
      recipientPhone: order.customerPhone,
      storeName: order.store.name,
      message: `Dear ${order.customerName}, your order #${order.orderNumber} from ${order.store.name} has been dispatched via ${provider} Courier (Tracking: ${result.trackingCode}). Cash on Delivery Amount: ৳${order.totalAmount}.`,
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      trackingCode: result.trackingCode,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Courier dispatch failed' },
      { status: 500 }
    );
  }
}
