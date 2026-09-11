import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/prisma';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { Search, Filter, ShoppingBag, ArrowUpDown, Sparkles, Zap, Flame } from 'lucide-react';

export const revalidate = 0; // Dynamic server component

interface SearchParamsProps {
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    featured?: string;
    page?: string;
  };
}

export default async function MarketplaceProductsPage({ searchParams }: SearchParamsProps) {
  const search = searchParams.q || '';
  const category = searchParams.category || 'ALL';
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const sort = searchParams.sort || 'featured';
  const featuredOnly = searchParams.featured === 'true';
  const page = Number(searchParams.page || 1);
  const limit = 24;
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
      include: {
        store: { select: { name: true, slug: true, logo: true } },
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      },
      orderBy,
      skip,
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const categories = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Fashion & Clothing', value: 'Fashion & Clothing' },
    { label: 'Electronics & Gadgets', value: 'Electronics & Gadgets' },
    { label: 'Beauty & Cosmetics', value: 'Beauty & Cosmetics' },
    { label: 'Home & Living', value: 'Home & Living' },
    { label: 'Groceries & Organic', value: 'Groceries & Organic' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <MarketplaceHeader />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-8 h-8 text-emerald-400" />
                Marketplace Catalog
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Showing {products.length} of {total} products from verified Bangladeshi sellers
              </p>
            </div>

            {/* Quick Filter Pill Options */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.value}
                  href={`/marketplace/products?category=${encodeURIComponent(cat.value)}${search ? `&q=${encodeURIComponent(search)}` : ''}`}
                  className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all border ${
                    category === cat.value
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Catalog Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            
            {/* Left Sidebar Filters */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-bold text-sm text-white flex items-center gap-2 uppercase tracking-wider">
                  <Filter className="w-4 h-4 text-emerald-400" /> Refine Catalog
                </h3>

                {/* Sort Option */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2">Sort By</label>
                  <div className="space-y-1.5 text-xs">
                    <Link
                      href={`/marketplace/products?sort=featured&category=${category}&q=${search}`}
                      className={`block px-3 py-2 rounded-lg ${sort === 'featured' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      ★ Featured & Boosted
                    </Link>
                    <Link
                      href={`/marketplace/products?sort=newest&category=${category}&q=${search}`}
                      className={`block px-3 py-2 rounded-lg ${sort === 'newest' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      ⚡ Newest Arrivals
                    </Link>
                    <Link
                      href={`/marketplace/products?sort=price-asc&category=${category}&q=${search}`}
                      className={`block px-3 py-2 rounded-lg ${sort === 'price-asc' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      Price: Low to High
                    </Link>
                    <Link
                      href={`/marketplace/products?sort=price-desc&category=${category}&q=${search}`}
                      className={`block px-3 py-2 rounded-lg ${sort === 'price-desc' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                      Price: High to Low
                    </Link>
                  </div>
                </div>

                {/* Featured filter toggle */}
                <div className="pt-4 border-t border-slate-800">
                  <Link
                    href={`/marketplace/products?featured=${featuredOnly ? 'false' : 'true'}&category=${category}&q=${search}`}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold ${
                      featuredOnly
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400" /> Boosted Deals Only
                    </span>
                    <span>{featuredOnly ? 'ON' : 'OFF'}</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Product Grid */}
            <div className="lg:col-span-9 space-y-8">
              {products.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto text-2xl">
                    🔍
                  </div>
                  <h3 className="text-xl font-bold text-white">No products found</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    We couldn't find any products matching your query. Try clearing your search filters.
                  </p>
                  <Link
                    href="/marketplace/products"
                    className="inline-block bg-emerald-500 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-emerald-400 transition-colors"
                  >
                    Reset Filters
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col group shadow-lg"
                    >
                      <div className="aspect-square relative bg-slate-800 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {prod.isFeaturedMarketplace && (
                          <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-slate-950" /> Boosted
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="text-[11px] text-emerald-400 font-semibold truncate">
                            {prod.store.name}
                          </div>
                          <Link href={`/marketplace/product/${prod.slug}`}>
                            <h3 className="font-bold text-sm text-white line-clamp-2 hover:text-emerald-400 transition-colors">
                              {prod.title}
                            </h3>
                          </Link>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                          <div>
                            <div className="text-lg font-black text-white">
                              ৳{prod.salePrice ?? prod.regularPrice}
                            </div>
                            {prod.salePrice && (
                              <div className="text-xs text-slate-500 line-through">
                                ৳{prod.regularPrice}
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/marketplace/product/${prod.slug}`}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-colors"
                          >
                            Buy Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/marketplace/products?page=${p}&category=${category}&sort=${sort}&q=${search}`}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        p === page
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
