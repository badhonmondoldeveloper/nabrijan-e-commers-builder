import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'products:read');

    const reviews = await db.review.findMany({
      where: { storeId: params.storeId },
      include: {
        product: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch reviews' },
      { status: 400 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'products:write');

    const body = await req.json();
    const { reviewId, status } = body;

    if (!reviewId || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid reviewId or status' },
        { status: 400 }
      );
    }

    const review = await db.review.updateMany({
      where: { id: reviewId, storeId: params.storeId },
      data: { status },
    });

    return NextResponse.json({ success: true, message: `Review status updated to ${status}` });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to update review' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'products:write');

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json({ message: 'Review ID required' }, { status: 400 });
    }

    await db.review.deleteMany({
      where: { id: reviewId, storeId: params.storeId },
    });

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to delete review' },
      { status: 400 }
    );
  }
}
