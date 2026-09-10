import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';
import { productSchema } from '@/lib/validation/schemas';
import { UsageService } from '@/lib/tenancy/usage-service';

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'products:read');

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        ...(search
          ? {
              OR: [
                { title: { contains: search } },
                { sku: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch products' }, { status: 400 });
  }
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'products:write');

    // Server-side Subscription Usage Limit Enforcement
    const productLimitCheck = await UsageService.canCreateProduct(params.storeId);
    if (!productLimitCheck.allowed) {
      return NextResponse.json({ message: productLimitCheck.reason }, { status: 403 });
    }

    const body = await req.json();
    const validated = productSchema.parse(body);

    // Ensure unique slug per store
    const existing = await db.product.findUnique({
      where: {
        storeId_slug: {
          storeId: params.storeId,
          slug: validated.slug,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ message: 'Product slug already exists in this store' }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        storeId: params.storeId,
        title: validated.title,
        slug: validated.slug,
        shortDescription: validated.shortDescription,
        fullDescription: validated.fullDescription,
        regularPrice: validated.regularPrice,
        salePrice: validated.salePrice,
        costPrice: validated.costPrice,
        sku: validated.sku,
        barcode: validated.barcode,
        categoryId: validated.categoryId || null,
        brandId: validated.brandId || null,
        status: validated.status,
        stock: validated.stock,
        lowStockThreshold: validated.lowStockThreshold,
        weight: validated.weight,
        isFeatured: validated.isFeatured,
        seoTitle: validated.seoTitle,
        seoDescription: validated.seoDescription,
        images: {
          create: validated.images.map((url, idx) => ({
            url,
            isMain: idx === 0,
            sortOrder: idx,
          })),
        },
        variants: {
          create: validated.variants.map((v) => ({
            title: v.title,
            sku: v.sku,
            price: v.price,
            salePrice: v.salePrice,
            stock: v.stock,
            attributes: JSON.stringify(v.attributes),
          })),
        },
        inventoryTxs: {
          create: {
            storeId: params.storeId,
            type: 'PURCHASE',
            quantity: validated.stock,
            previousStock: 0,
            newStock: validated.stock,
            notes: 'Initial Product Stock Setup',
          },
        },
      },
      include: { images: true, variants: true },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Product creation failed' }, { status: 400 });
  }
}
