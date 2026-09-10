import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PathaoAdapter } from '@/lib/integrations/courier/pathao-adapter';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const consignmentId = body.consignment_id || body.merchant_order_id;
    const trackingCode = body.tracking_code;
    const rawStatus = body.order_status || body.status;

    if (!consignmentId && !trackingCode) {
      return NextResponse.json({ error: 'Missing consignment identifier' }, { status: 400 });
    }

    const normalizedStatus = PathaoAdapter.normalizeStatus(rawStatus);

    // Find target shipment by tracking code or consignment ID
    const shipment = await db.shipment.findFirst({
      where: {
        OR: [
          trackingCode ? { trackingCode } : {},
          consignmentId ? { consignmentId: String(consignmentId) } : {}
        ]
      },
      include: { order: true }
    });

    if (!shipment) {
      return NextResponse.json({ message: 'Shipment not found in system, acknowledged' }, { status: 200 });
    }

    // Idempotency check: Skip duplicate status events
    if (shipment.deliveryStatus === normalizedStatus) {
      return NextResponse.json({ message: 'Status already up-to-date (Idempotent)' }, { status: 200 });
    }

    // Update shipment delivery status & add shipment event log
    await db.shipment.update({
      where: { id: shipment.id },
      data: {
        deliveryStatus: normalizedStatus,
        updatedAt: new Date()
      }
    });

    await db.shipmentEvent.create({
      data: {
        shipmentId: shipment.id,
        status: normalizedStatus,
        notes: `Pathao Webhook status update: ${rawStatus} -> ${normalizedStatus}`
      }
    });

    // Sync order fulfillment status
    let mappedOrderStatus = shipment.order.orderStatus;
    if (normalizedStatus === 'DELIVERED') {
      mappedOrderStatus = 'DELIVERED';
    } else if (normalizedStatus === 'OUT_FOR_DELIVERY' || normalizedStatus === 'IN_TRANSIT' || normalizedStatus === 'PICKED_UP') {
      mappedOrderStatus = 'SHIPPED';
    } else if (normalizedStatus === 'CANCELLED' || normalizedStatus === 'RETURNED') {
      mappedOrderStatus = 'CANCELLED';
    }

    if (mappedOrderStatus !== shipment.order.orderStatus) {
      await db.order.update({
        where: { id: shipment.orderId },
        data: {
          orderStatus: mappedOrderStatus,
          paymentStatus: normalizedStatus === 'DELIVERED' ? 'PAID' : shipment.order.paymentStatus,
          updatedAt: new Date()
        }
      });
    }

    return NextResponse.json({ success: true, status: normalizedStatus }, { status: 200 });
  } catch (error: any) {
    console.error('Pathao Webhook error:', error);
    return NextResponse.json({ error: error.message || 'Internal webhook error' }, { status: 500 });
  }
}
