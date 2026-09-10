import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const attempts = await db.integrationAttempt.findMany({
      orderBy: { createdAt: 'desc' },
      take: 25
    });

    const shipments = await db.shipment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15,
      include: {
        store: { select: { name: true } },
        order: { select: { orderNumber: true, totalAmount: true } }
      }
    });

    const notificationLogs = await db.notificationLog.findMany({
      orderBy: { sentAt: 'desc' },
      take: 15
    });

    const totalShipments = await db.shipment.count();
    const successfulAttempts = await db.integrationAttempt.count({ where: { status: 'SUCCESS' } });
    const failedAttempts = await db.integrationAttempt.count({ where: { status: 'FAILED' } });
    const aiUsagesCount = await db.aiUsage.count();

    return NextResponse.json({
      stats: {
        totalShipments,
        successfulAttempts,
        failedAttempts,
        aiUsagesCount
      },
      attempts,
      shipments,
      notificationLogs
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch admin integrations' }, { status: 500 });
  }
}
