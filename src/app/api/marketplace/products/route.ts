import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const sort = searchParams.get('sort') || 'featured';
    const featuredOnly = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 24;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const skip = (page - 1) * limit;

    const where: any = {
      isMarketplaceListed: true,
      marketplaceStatus: 'APPROVED',
      status: 'ACTIVE',
      stock: { gt: 0 },
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
        { fullDescription: { contains: search } },
      ];
    }

    if (category && category !== 'ALL') {
      where.OR = [
        { marketplaceCategory: category },
        { category: { name: { contains: category } } },
      ];
    }

    if (featuredOnly) {
      where.isFeaturedMarketplace = true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.salePrice = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }

    let orderBy: any = [{ isFeaturedMarketplace: 'desc' }, { createdAt: 'desc' }];
    if (sort === 'newest') {
      orderBy = [{ createdAt: 'desc' }];
    } else if (sort === 'price-asc') {
      orderBy = [{ salePrice: 'asc' }, { regularPrice: 'asc' }];
    } else if (sort === 'price-desc') {
      orderBy = [{ salePrice: 'desc' }, { regularPrice: 'desc' }];
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          shortDescription: true,
          regularPrice: true,
          salePrice: true,
          stock: true,
          isFeaturedMarketplace: true,
          boostExpiresAt: true,
          marketplaceCategory: true,
          createdAt: true,
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              settings: {
                select: { address: true, phone: true },
              },
            },
          },
          images: {
            select: { url: true },
            orderBy: { sortOrder: 'asc' },
            take: 2,
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      products: products.map((p) => ({
        ...p,
        regularPrice: p.regularPrice.toString(),
        salePrice: p.salePrice ? p.salePrice.toString() : null,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to search marketplace products' }, { status: 400 });
  }
}
