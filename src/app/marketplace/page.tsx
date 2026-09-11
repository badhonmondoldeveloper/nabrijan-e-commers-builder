import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/prisma';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { Sparkles, ShoppingBag, ShieldCheck, Flame, ArrowRight, Store, Star, Zap, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CentralMarketplacePage() {
  let featuredProducts: any[] = [];
  let stores: any[] = [];
  let latestProducts: any[] = [];

  try {
    // Fetch Boosted & Featured Products
    const rawFeatured = await db.product.findMany({
      where: {
        isMarketplaceListed: true,
        marketplaceStatus: 'APPROVED',
        status: 'ACTIVE',
        stock: { gt: 0 },
      },
      include: {
        store: {
          select: { name: true, slug: true, logo: true },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
      orderBy: [
        { isFeaturedMarketplace: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 8,
    });

    featuredProducts = rawFeatured.map((p) => ({
      ...p,
      regularPrice: p.regularPrice.toString(),
      salePrice: p.salePrice ? p.salePrice.toString() : null,
    }));

    // Fetch Top Stores
    stores = await db.store.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        logo: true,
        _count: { select: { products: true } },
      },
      take: 6,
    });

    // Fetch Latest Marketplace Arrivals
    const rawLatest = await db.product.findMany({
      where: {
        isMarketplaceListed: true,
        marketplaceStatus: 'APPROVED',
        status: 'ACTIVE',
        stock: { gt: 0 },
      },
      include: {
        store: {
          select: { name: true, slug: true },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 12,
    });

    latestProducts = rawLatest.map((p) => ({
      ...p,
      regularPrice: p.regularPrice.toString(),
      salePrice: p.salePrice ? p.salePrice.toString() : null,
    }));
  } catch (err) {
    console.warn('CentralMarketplacePage db fetch skipped during build without DB:', err);
  }

  const categories = [
    { name: 'Fashion & Apparel', slug: 'Fashion & Clothing', icon: '👔', bg: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30' },
    { name: 'Electronics & Gadgets', slug: 'Electronics & Gadgets', icon: '⚡', bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30' },
    { name: 'Beauty & Cosmetics', slug: 'Beauty & Cosmetics', icon: '✨', bg: 'from-purple-500/20 to-indigo-500/20', border: 'border-purple-500/30' },
    { name: 'Home & Lifestyle', slug: 'Home & Living', icon: '🏠', bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
    { name: 'Organic Groceries', slug: 'Groceries & Organic', icon: '🌿', bg: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <MarketplaceHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 md:py-24 border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column Text */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Bangladesh E-Commerce Hub
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                  Discover Top <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Bangladeshi Stores</span> & Brands
                </h1>

                <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                  Shop directly from thousands of independent Bangladeshi merchants. Safe Cash on Delivery, verified sellers, and fast local delivery.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/marketplace/products"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl transition-all shadow-xl shadow-emerald-500/25 flex items-center gap-2 text-base hover:scale-105"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Browse All Products
                  </Link>

                  <Link
                    href="/register"
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3.5 rounded-xl border border-slate-700 transition-all flex items-center gap-2 text-base"
                  >
                    <Store className="w-5 h-5 text-emerald-400" />
                    Sell on Nabrijan (Free Trial)
                  </Link>
                </div>

                {/* Trust stats */}
                <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-800/80">
                  <div>
                    <div className="text-2xl font-black text-white">100%</div>
                    <div className="text-xs text-slate-400">Verified Sellers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-emerald-400">2%</div>
                    <div className="text-xs text-slate-400">Fair Merchant Fee</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-cyan-400">64</div>
                    <div className="text-xs text-slate-400">Districts COD</div>
                  </div>
                </div>
              </div>

              {/* Right Column Grid Cards preview */}
              <div className="lg:col-span-5 relative">
                <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> Hot Seller Spotlight
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                      VERIFIED STORE
                    </span>
                  </div>

                  {featuredProducts[0] && (
                    <div className="space-y-4">
                      <div className="aspect-video w-full rounded-2xl bg-slate-800 overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={featuredProducts[0].images[0]?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'}
                          alt={featuredProducts[0].title}
                          className="w-full h-full object-cover"
                        />
                        {featuredProducts[0].isFeaturedMarketplace && (
                          <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <Flame className="w-3 h-3 fill-slate-950" /> Boosted Deal
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-xs text-emerald-400 font-semibold mb-1">
                          By {featuredProducts[0].store?.name}
                        </div>
                        <h3 className="font-bold text-lg text-white line-clamp-1">
                          {featuredProducts[0].title}
                        </h3>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-emerald-400">
                              ৳{featuredProducts[0].salePrice ?? featuredProducts[0].regularPrice}
                            </span>
                            {featuredProducts[0].salePrice && (
                              <span className="text-xs text-slate-500 line-through">
                                ৳{featuredProducts[0].regularPrice}
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/marketplace/product/${featuredProducts[0].slug}`}
                            className="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors"
                          >
                            Buy Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CATEGORIES GRID */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white">Explore Categories</h2>
              <p className="text-xs text-slate-400">Top product categories across merchant stores</p>
            </div>
            <Link
              href="/marketplace/products"
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/marketplace/products?category=${encodeURIComponent(cat.slug)}`}
                className={`bg-gradient-to-br ${cat.bg} p-5 rounded-2xl border ${cat.border} hover:scale-105 transition-all group`}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-slate-400 block mt-1">Browse →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED / BOOSTED PRODUCTS GRID */}
        {featuredProducts.length > 0 && (
          <section className="py-12 bg-slate-900/40 border-y border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-amber-500 fill-amber-500 animate-bounce" />
                  <div>
                    <h2 className="text-2xl font-black text-white">Featured Merchant Deals</h2>
                    <p className="text-xs text-slate-400">Boosted products from verified Bangladeshi merchants</p>
                  </div>
                </div>
                <Link
                  href="/marketplace/products?featured=true"
                  className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                >
                  See All Deals <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col group shadow-lg"
                  >
                    <div className="aspect-square relative bg-slate-800 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prod.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {prod.isFeaturedMarketplace && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-slate-950" /> Featured
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="text-[11px] text-emerald-400 font-semibold truncate">
                          {prod.store?.name}
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
            </div>
          </section>
        )}

        {/* FEATURED MERCHANT STORES */}
        {stores.length > 0 && (
          <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-white">Top Merchant Stores</h2>
                <p className="text-xs text-slate-400">Discover independent Bangladeshi store owners</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((st) => (
                <div key={st.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-emerald-400 flex-shrink-0">
                    {st.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-base truncate">{st.name}</h3>
                    <div className="text-xs text-slate-400">{st.category || 'E-Commerce Merchant'}</div>
                    <div className="text-[11px] text-emerald-400 mt-1">{st._count?.products ?? 0} Products Listed</div>
                  </div>
                  <Link
                    href={`/store/${st.slug}`}
                    target="_blank"
                    className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg border border-slate-700 transition-colors flex-shrink-0"
                  >
                    Visit Store →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LATEST MARKETPLACE ARRIVALS */}
        {latestProducts.length > 0 && (
          <section className="py-12 bg-slate-900/30 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white">New Marketplace Products</h2>
                  <p className="text-xs text-slate-400">Recently added items across all Bangladeshi stores</p>
                </div>
                <Link
                  href="/marketplace/products?sort=newest"
                  className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  Browse All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {latestProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col group"
                  >
                    <div className="aspect-square relative bg-slate-800 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prod.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] text-emerald-400 truncate">{prod.store?.name}</div>
                        <Link href={`/marketplace/product/${prod.slug}`}>
                          <h4 className="font-semibold text-xs text-white line-clamp-2 mt-0.5 hover:text-emerald-400">
                            {prod.title}
                          </h4>
                        </Link>
                      </div>
                      <div className="mt-2 text-sm font-black text-emerald-400">
                        ৳{prod.salePrice ?? prod.regularPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <MarketplaceFooter />
    </div>
  );
}
