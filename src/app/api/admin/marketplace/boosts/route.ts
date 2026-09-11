import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifySuperAdmin } from '@/lib/auth/rbac';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    await verifySuperAdmin();

    const packages = await db.boostPackage.findMany({
      orderBy: { price: 'asc' },
    });

    const purchases = await db.boostPurchase.findMany({
      include: {
        package: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Fetch store details for purchases
    const storeIds = [...new Set(purchases.map((p) => p.storeId))];
    const stores = await db.store.findMany({
      where: { id: { in: storeIds } },
      select: { id: true, name: true, slug: true },
    });
    const storeMap = new Map(stores.map((s) => [s.id, s]));

    return NextResponse.json({
      success: true,
      packages: packages.map((p) => ({
        ...p,
        price: p.price.toString(),
      })),
      purchases: purchases.map((p) => ({
        ...p,
        amountPaid: p.amountPaid.toString(),
        store: storeMap.get(p.storeId) || { name: 'Unknown Store', slug: '' },
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch boost packages' }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    await verifySuperAdmin();

    const body = await req.json();
    const { name, slug, price, durationDays, description, isFeatured, isActive } = body;

    if (!name || !slug || !price || !durationDays) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const priceDecimal = new Prisma.Decimal(price);

    const pkg = await db.boostPackage.upsert({
      where: { slug },
      update: {
        name,
        price: priceDecimal,
        durationDays: Number(durationDays),
        description: description || '',
        isFeatured: Boolean(isFeatured),
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
      create: {
        name,
        slug,
        price: priceDecimal,
        durationDays: Number(durationDays),
        description: description || '',
        isFeatured: Boolean(isFeatured),
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
    });

    return NextResponse.json({
      success: true,
      package: {
        ...pkg,
        price: pkg.price.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update boost package' }, { status: 400 });
  }
}
