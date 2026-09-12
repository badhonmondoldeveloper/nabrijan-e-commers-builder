import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, CheckCircle2, Star, PhoneCall } from 'lucide-react';
import AddToCartForm from '@/components/storefront/AddToCartForm';
import ProductReviewsSection from '@/components/storefront/ProductReviewsSection';
import StorefrontFaqAccordion from '@/components/storefront/StorefrontFaqAccordion';
import RecentlyViewedTracker from '@/components/storefront/RecentlyViewedTracker';
import RecentlyViewedSection from '@/components/storefront/RecentlyViewedSection';
import SocialProofNotify from '@/components/storefront/SocialProofNotify';
import MobileBottomNav from '@/components/storefront/MobileBottomNav';
import ExitIntentPopup from '@/components/storefront/ExitIntentPopup';

export default async function StoreProductDetailPage({
  params,
}: {
  params: { slug: string; productSlug: string };
}) {
  const store = await db.store.findUnique({
    where: { slug: params.slug },
    include: {
      settings: true,
    },
  });

  if (!store) notFound();

  const product = await db.product.findUnique({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: params.productSlug,
      },
    },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
      reviews: { where: { status: 'APPROVED' }, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!product) notFound();

  // Fetch categories for bottom nav
  const categories = await db.category.findMany({
    where: { storeId: store.id, isActive: true },
    select: { id: true, name: true },
    take: 8,
  });

  // Fetch all active products for social proof simulation
  const allProducts = await db.product.findMany({
    where: { storeId: store.id, status: 'ACTIVE' },
    select: { title: true, images: { take: 1 } },
    take: 10,
  });

  const notifyProducts = allProducts.map((p) => ({
    title: p.title,
    image: p.images[0]?.url,
  }));

  const mainImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 md:pb-8 selection:bg-blue-600 selection:text-white">
      {/* Tracker Client Component */}
      <RecentlyViewedTracker
        storeSlug={store.slug}
        product={{
          id: product.id,
          slug: product.slug,
          title: product.title,
          price: product.salePrice || product.regularPrice,
          regularPrice: product.salePrice ? product.regularPrice : undefined,
          image: mainImage,
        }}
      />

      {/* Social Proof Floating Toast */}
      <SocialProofNotify products={notifyProducts} />

      {/* Exit Intent Modal */}
      <ExitIntentPopup storeSlug={store.slug} />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/store/${store.slug}`}
            className="inline-flex items-center text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> স্টোরফ্রন্টে ফিরে যান
          </Link>
          <span className="font-bold text-slate-900 text-sm">{store.name}</span>
          <Link href={`/store/${store.slug}/cart`}>
            <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 font-bold">
              <ShoppingBag className="w-4 h-4 mr-1 text-blue-600" /> Cart
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Product Container */}
      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-12">
        <div className="grid md:grid-cols-12 gap-8 items-start bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          {/* 1. Desktop Sticky Image Gallery */}
          <div className="md:col-span-6 space-y-4 md:sticky md:top-24">
            <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative group">
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {product.salePrice && product.regularPrice > product.salePrice && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                  -{Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt={product.title}
                    className="w-18 h-18 rounded-xl object-cover border border-slate-200 cursor-pointer hover:border-blue-500 transition"
                  />
                ))}
              </div>
            )}
          </div>

          {/* 2. Product Details & Purchase Controls */}
          <div className="md:col-span-6 space-y-6">
            <div className="space-y-3">
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-700 bg-emerald-50 font-bold px-3 py-1">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> ইন স্টক আছে ({product.stock} টি এভেলেবল)
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{product.title}</h1>
              {product.sku && <p className="text-xs text-slate-400 font-mono">SKU: {product.sku}</p>}
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-3xl sm:text-4xl font-black text-blue-600">
                ৳{product.salePrice || product.regularPrice}
              </span>
              {product.salePrice && (
                <span className="text-lg text-slate-400 line-through font-semibold">৳{product.regularPrice}</span>
              )}
            </div>

            {product.shortDescription && (
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                {product.shortDescription}
              </div>
            )}

            {/* Interactive Add to Cart Form Component with Size/Color selector */}
            <AddToCartForm storeSlug={store.slug} product={product} storePhone={store.settings?.phone || '01700000000'} />

            {/* Merchant Trust Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-slate-700 font-semibold">ক্যাশ অন ডেলিভারি সুবিধা</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-semibold">১০০% আসল ও কোয়ালিটি পণ্য</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Product Description */}
        {product.description && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">পণ্যের বিবরণ (Description)</h3>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>
        )}

        {/* 4. Product FAQ Accordion */}
        <StorefrontFaqAccordion />

        {/* 5. Recently Viewed Items */}
        <RecentlyViewedSection storeSlug={store.slug} currentProductId={product.id} />

        {/* 6. Customer Reviews Section */}
        <ProductReviewsSection
          storeSlug={store.slug}
          productId={product.id}
          reviews={product.reviews || []}
        />
      </main>

      {/* Mobile App-Style Bottom Navigation Bar */}
      <MobileBottomNav storeSlug={store.slug} categories={categories} />
    </div>
  );
}
