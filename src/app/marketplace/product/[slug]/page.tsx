import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { ShoppingBag, ShieldCheck, Truck, Store, Star, Flame, CheckCircle2, MessageCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MarketplaceProductDetailPage({ params }: { params: { slug: string } }) {
  const productRaw = await db.product.findFirst({
    where: {
      slug: params.slug,
      isMarketplaceListed: true,
      marketplaceStatus: 'APPROVED',
      status: 'ACTIVE',
    },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          settings: { select: { phone: true, address: true } },
        },
      },
      images: { orderBy: { sortOrder: 'asc' } },
      reviews: {
        where: { status: 'APPROVED' },
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
      marketplaceListing: true,
    },
  });

  if (!productRaw) {
    notFound();
  }

  const product = {
    ...productRaw,
    regularPrice: productRaw.regularPrice.toString(),
    salePrice: productRaw.salePrice ? productRaw.salePrice.toString() : null,
  };

  const regNum = Number(product.regularPrice);
  const saleNum = product.salePrice ? Number(product.salePrice) : null;
  const savings = saleNum ? regNum - saleNum : 0;

  const averageRating = product.reviews.length
    ? Math.round(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length)
    : 5;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <MarketplaceHeader />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="text-xs text-slate-400 flex items-center gap-2 mb-8">
            <Link href="/marketplace" className="hover:text-emerald-400">Marketplace</Link>
            <span>/</span>
            <Link href="/marketplace/products" className="hover:text-emerald-400">Products</Link>
            <span>/</span>
            <span className="text-slate-200 truncate max-w-xs">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Product Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-square bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {product.isFeaturedMarketplace && (
                  <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Flame className="w-4 h-4 fill-slate-950" /> Boosted Deal
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img) => (
                    <div key={img.id} className="aspect-square bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info & Merchant Info */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Merchant Badge Card */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Sold & Shipped By</div>
                    <Link href={`/store/${product.store.slug}`} target="_blank" className="text-sm font-bold text-white hover:text-emerald-400 flex items-center gap-1">
                      {product.store.name} <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                    </Link>
                  </div>
                </div>

                <Link
                  href={`/store/${product.store.slug}`}
                  target="_blank"
                  className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
                >
                  Visit Merchant Store →
                </Link>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {product.title}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400 text-xs">
                    {'★'.repeat(averageRating)}{'☆'.repeat(5 - averageRating)}
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">
                    ({product.reviews.length} customer reviews)
                  </span>
                </div>
              </div>

              {/* Price Box */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-baseline gap-4">
                <div className="text-3xl font-black text-emerald-400">
                  ৳{product.salePrice ?? product.regularPrice}
                </div>
                {product.salePrice && (
                  <div className="text-base text-slate-500 line-through">
                    ৳{product.regularPrice}
                  </div>
                )}
                {product.salePrice && (
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full">
                    SAVE ৳{savings}
                  </span>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
                  {product.shortDescription}
                </p>
              )}

              {/* Stock status */}
              <div className="text-xs font-semibold">
                {product.stock > 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock ({product.stock} units available)
                  </span>
                ) : (
                  <span className="text-rose-400">Out of Stock</span>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href={`/marketplace/checkout/${product.slug}`}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl text-center block text-base shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02]"
                >
                  ⚡ Buy Now (Cash on Delivery)
                </Link>
              </div>

              {/* Value Props */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Truck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Nationwide Express Shipping</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <span>100% Buyer Protection</span>
                </div>
              </div>

              {/* Full Description Tab */}
              {product.fullDescription && (
                <div className="pt-6 border-t border-slate-800 space-y-2">
                  <h3 className="font-bold text-sm text-white">Product Description</h3>
                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {product.fullDescription}
                  </div>
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
