import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || searchParams.get('orderId') || searchParams.get('phone');

    if (!query) {
      return NextResponse.json({ message: 'Order ID or phone number is required' }, { status: 400 });
    }

    const store = await db.store.findUnique({
      where: { slug: params.slug },
      select: { id: true, name: true },
    });

    if (!store) {
      return NextResponse.json({ message: 'Store not found' }, { status: 404 });
    }

    const trimmed = query.trim();

    const orders = await db.order.findMany({
      where: {
        storeId: store.id,
        OR: [
          { id: trimmed },
          { orderNumber: trimmed },
          { customerPhone: { contains: trimmed } },
        ],
      },
      include: {
        items: {
          include: {
            product: { select: { title: true, images: { take: 1 } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to search order' }, { status: 400 });
  }
}
