import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';
import { Prisma } from '@prisma/client';

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'marketing:write');

    const packages = await db.boostPackage.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });

    const store = await db.store.findUnique({
      where: { id: params.storeId },
      include: {
        wallet: true,
        products: {
          where: { isMarketplaceListed: true },
          select: { id: true, title: true, isFeaturedMarketplace: true, boostExpiresAt: true },
        },
      },
    });

    const purchases = await db.boostPurchase.findMany({
      where: { storeId: params.storeId },
      include: {
        package: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      packages: packages.map((p) => ({
        ...p,
        price: p.price.toString(),
      })),
      products: store?.products ?? [],
      walletBalance: store?.wallet?.balance ? store.wallet.balance.toString() : '0.00',
      purchases: purchases.map((p) => ({
        ...p,
        amountPaid: p.amountPaid.toString(),
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch boost options' }, { status: 400 });
  }
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'marketing:write');

    const body = await req.json();
    const { packageId, productId } = body;

    if (!packageId || !productId) {
      return NextResponse.json({ message: 'Package ID and Product ID are required' }, { status: 400 });
    }

    const pkg = await db.boostPackage.findUnique({ where: { id: packageId } });
    if (!pkg || !pkg.isActive) {
      return NextResponse.json({ message: 'Selected boost package is unavailable' }, { status: 400 });
    }

    const product = await db.product.findFirst({
      where: { id: productId, storeId: params.storeId },
    });
    if (!product) {
      return NextResponse.json({ message: 'Product not found in store' }, { status: 404 });
    }

    let wallet = await db.sellerWallet.findUnique({ where: { storeId: params.storeId } });
    if (!wallet || wallet.balance.lt(pkg.price)) {
      return NextResponse.json({ message: `Insufficient available wallet balance. Price: ৳${pkg.price}, Balance: ৳${wallet?.balance ?? 0}` }, { status: 400 });
    }

    const now = new Date();
    const currentExpiry = product.boostExpiresAt && product.boostExpiresAt > now ? product.boostExpiresAt : now;
    const newBoostExpiresAt = new Date(currentExpiry.getTime() + pkg.durationDays * 24 * 60 * 60 * 1000);

    const purchase = await db.$transaction(async (tx) => {
      // 1. Deduct available balance
      await tx.sellerWallet.update({
        where: { id: wallet.id },
        data: { balance: wallet.balance.sub(pkg.price) },
      });

      // 2. Create Immutable Ledger Transaction (DEBIT_BOOST)
      await tx.ledgerTransaction.create({
        data: {
          walletId: wallet.id,
          storeId: params.storeId,
          type: 'DEBIT_BOOST',
          amount: pkg.price,
          commissionAmount: new Prisma.Decimal('0.00'),
          netAmount: pkg.price,
          currency: 'BDT',
          description: `Boost Purchase: ${pkg.name} for "${product.title}"`,
        },
      });

      // 3. Create Boost Purchase record
      const bp = await tx.boostPurchase.create({
        data: {
          storeId: params.storeId,
          packageId: pkg.id,
          productId: product.id,
          amountPaid: pkg.price,
          startsAt: now,
          expiresAt: newBoostExpiresAt,
          status: 'ACTIVE',
        },
      });

      // 4. Update Product & MarketplaceListing boost flags
      await tx.product.update({
        where: { id: product.id },
        data: {
          isFeaturedMarketplace: true,
          boostExpiresAt: newBoostExpiresAt,
        },
      });

      await tx.marketplaceListing.upsert({
        where: { productId: product.id },
        update: {
          isFeatured: true,
          boostExpiresAt: newBoostExpiresAt,
        },
        create: {
          productId: product.id,
          storeId: params.storeId,
          isFeatured: true,
          boostExpiresAt: newBoostExpiresAt,
        },
      });

      return bp;
    });

    return NextResponse.json({
      success: true,
      message: `Product "${product.title}" boosted for ${pkg.durationDays} days!`,
      boostExpiresAt: newBoostExpiresAt,
      purchase: {
        ...purchase,
        amountPaid: purchase.amountPaid.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Boost purchase failed' }, { status: 400 });
  }
}
