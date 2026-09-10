import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';
import { couponSchema } from '@/lib/validation/schemas';

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'marketing:write');

    const coupons = await db.coupon.findMany({
      where: { storeId: params.storeId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch coupons' }, { status: 400 });
  }
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'marketing:write');

    const body = await req.json();
    const validated = couponSchema.parse(body);

    const existing = await db.coupon.findUnique({
      where: {
        storeId_code: {
          storeId: params.storeId,
          code: validated.code,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ message: 'Coupon code already exists in this store' }, { status: 400 });
    }

    const coupon = await db.coupon.create({
      data: {
        storeId: params.storeId,
        code: validated.code,
        discountType: validated.discountType,
        amount: validated.amount,
        minPurchase: validated.minPurchase || 0,
        maxDiscount: validated.maxDiscount || null,
        usageLimit: validated.usageLimit || null,
        isFirstOrderOnly: validated.isFirstOrderOnly,
        isActive: validated.isActive,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create coupon' }, { status: 400 });
  }
}
