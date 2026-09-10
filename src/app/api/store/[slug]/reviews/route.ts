import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await req.json();
    const { productId, customerName, rating, title, comment } = body;

    if (!productId || !customerName || !rating || !comment) {
      return NextResponse.json(
        { message: 'Missing required review fields' },
        { status: 400 }
      );
    }

    const store = await db.store.findUnique({
      where: { slug },
    });

    if (!store) {
      return NextResponse.json({ message: 'Store not found' }, { status: 404 });
    }

    const product = await db.product.findFirst({
      where: { id: productId, storeId: store.id },
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found in this store' }, { status: 404 });
    }

    const review = await db.review.create({
      data: {
        storeId: store.id,
        productId: product.id,
        customerName: customerName.trim(),
        rating: Math.min(5, Math.max(1, Number(rating))),
        title: title ? title.trim() : null,
        comment: comment.trim(),
        status: 'PENDING', // Submissions require merchant approval
        isVerifiedPurchase: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully and is pending approval',
      review,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}
