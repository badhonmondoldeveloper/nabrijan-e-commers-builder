import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'products:read');

    const categories = await db.category.findMany({
      where: { storeId: params.storeId },
      include: {
        parent: true,
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch categories' }, { status: 400 });
  }
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'products:write');

    const body = await req.json();
    const { name, slug, description, parentId, image } = body;

    if (!name || !slug) {
      return NextResponse.json({ message: 'Category name and slug are required' }, { status: 400 });
    }

    const existing = await db.category.findUnique({
      where: {
        storeId_slug: {
          storeId: params.storeId,
          slug,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ message: 'Category slug already exists in this store' }, { status: 400 });
    }

    const category = await db.category.create({
      data: {
        storeId: params.storeId,
        name,
        slug,
        description: description || null,
        parentId: parentId || null,
        image: image || null,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create category' }, { status: 400 });
  }
}
