import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Star, Truck, ShieldCheck, PhoneCall, ArrowRight, Heart, MessageCircle, Flame, CheckCircle, Search, Zap, History, LayoutGrid, Award } from 'lucide-react';
import FlashSaleSection from '@/components/storefront/FlashSaleSection';
import MobileBottomNav from '@/components/storefront/MobileBottomNav';
import RecentlyViewedSection from '@/components/storefront/RecentlyViewedSection';
import ExitIntentPopup from '@/components/storefront/ExitIntentPopup';
import SocialProofNotify from '@/components/storefront/SocialProofNotify';

export default async function MerchantStorefrontPage({
  params,
}: {
  params: { slug: string };
}) {
  let store: any = null;
  let products: any[] = [];
  let categories: any[] = [];

  try {
    store = await db.store.findUnique({
      where: { slug: params.slug },
      include: {
        settings: true,
      },
    });

    if (store && store.status === 'ACTIVE') {
      products = await db.product.findMany({
        where: { storeId: store.id, status: 'ACTIVE' },
        include: {
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
          category: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 36,
      });

      categories = await db.category.findMany({
        where: { storeId: store.id, isActive: true },
        orderBy: { sortOrder: 'asc' },
        take: 12,
      });
    }
  } catch (err) {
    console.error('Storefront DB query error:', err);
  }

  if (!store) {
    // Fallback store object if database is disconnected or store not found
    store = {
      id: 'fallback-id',
      name: params.slug === 'nabrijan-official' ? 'Nabrijan Official Store' : params.slug.replace(/-/g, ' ').toUpperCase(),
      slug: params.slug,
      status: 'ACTIVE',
      logo: null,
      banner: null,
      settings: {
        announcementText: '🔥 সারা বাংলাদেশে ক্যাশ অন ডেলিভারি এবং দ্রুত ডেলিভারি!',
        phone: '01700000000',
        whatsappNumber: '01700000000',
        seoDescription: 'Handpicked quality products with fast COD delivery across Bangladesh.',
      },
    };
  }

  const settings = store.settings || {};
  const whatsappNumber = settings.whatsappNumber || settings.phone || '';
  const announcementText = settings.announcementText || '🔥 সারা বাংলাদেশে ক্যাশ অন ডেলিভারি এবং দ্রুত ডেলিভারি!';

  const notifyProducts = products.map((p) => ({
    title: p.title,
    image: typeof p.images?.[0] === 'string' ? p.images[0] : (p.images?.[0]?.url || ''),
  }));

  return (
    <div className="min-h-screen bg-[#F6FAF4] text-[#17221D] flex flex-col font-sans pb-16 md:pb-0">
      {/* Exit Intent Popup */}
      <ExitIntentPopup storeSlug={store.slug} />

      {/* Social Proof Live Purchase Toast */}
      <SocialProofNotify products={notifyProducts} />

      {/* 1. Top Announcement Bar (Dark Green background + Brand Green accent) */}
      <div className="bg-[#063B2A] text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2 border-b border-[#063B2A]/20">
        <Flame className="w-3.5 h-3.5 text-[#55B510] animate-pulse" />
        <span>{announcementText}</span>
        {settings.phone && (
          <span className="hidden md:inline-block text-emerald-200 pl-4 border-l border-emerald-800/50">
            📞 হেল্পলাইন: <a href={`tel:${settings.phone}`} className="text-white hover:text-[#55B510] transition">{settings.phone}</a>
          </span>
        )}
      </div>

      {/* 2. Sleek Modern Header (Matching Uploaded UI Screenshot) */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#DCE7DF] shadow-xs py-3 px-4">
        <div className="container mx-auto flex items-center justify-between gap-3">
          {/* Store Brand / Logo */}
          <Link href={`/store/${store.slug}`} className="flex items-center space-x-2.5 shrink-0">
            {store.logo ? (
              <img src={store.logo} alt={store.name} className="h-10 w-auto object-contain rounded-xl border border-[#DCE7DF] p-0.5" />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-[#063B2A] text-[#55B510] flex items-center justify-center font-black text-lg shadow-xs border border-[#55B510]/30">
                {store.name.charAt(0)}
              </div>
            )}
            <div className="hidden sm:block">
              <span className="text-base font-black text-[#063B2A] tracking-tight block leading-none">
                {store.name}
              </span>
              <span className="text-[10px] text-[#55B510] font-bold">✓ Official Store</span>
            </div>
          </Link>

          {/* App Style Pill Search Bar (Matching Screenshot Search Field) */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative w-full flex items-center bg-[#F6FAF4] border border-[#DCE7DF] focus-within:border-[#55B510] rounded-full px-3.5 py-1.5 transition">
              <Search className="w-4 h-4 text-[#66736C] shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Search products in store..."
                className="w-full bg-transparent text-xs text-[#17221D] focus:outline-none placeholder-[#66736C]"
              />
              <button className="text-[#66736C] hover:text-[#55B510] transition shrink-0 ml-1">
                <Zap className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Actions (Cart Icon Badge) */}
          <div className="flex items-center space-x-2">
            <Link href={`/store/${store.slug}/track`} className="hidden md:inline-flex items-center text-xs font-bold text-[#063B2A] bg-[#EAF7DF] hover:bg-[#55B510] hover:text-white px-3 py-2 rounded-full transition border border-[#55B510]/20">
              <Truck className="w-3.5 h-3.5 mr-1" /> ট্র্যাকিং
            </Link>

            <Link href={`/store/${store.slug}/cart`}>
              <button className="relative w-10 h-10 rounded-full bg-[#F6FAF4] hover:bg-[#EAF7DF] border border-[#DCE7DF] flex items-center justify-center text-[#063B2A] transition">
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-[#55B510] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  0
                </span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 space-y-8 pb-12 max-w-7xl mx-auto w-full">
        {/* 3. Hero Promo Banner (Matching Screenshot Card Carousel) */}
        <section className="px-4 pt-4">
          <div className="relative bg-gradient-to-r from-[#063B2A] via-[#084c36] to-[#063B2A] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#55B510]/20 overflow-hidden">
            <div className="grid md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-3 z-10">
                <Badge className="bg-[#55B510] text-white border-none font-extrabold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Featured Showcase
                </Badge>
                <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                  {store.name} <span className="text-[#55B510]">Collection</span>
                </h1>
                <p className="text-emerald-100 text-xs sm:text-sm max-w-md line-clamp-2">
                  {settings.seoDescription || 'Extraordinary Visual & Exceptional Power. Browse top handpicked products with instant COD.'}
                </p>
                <div className="pt-2">
                  <a href="#products-grid">
                    <Button className="bg-white hover:bg-[#55B510] text-[#063B2A] hover:text-white font-black text-xs px-6 py-2.5 rounded-full shadow-md transition duration-300">
                      Shop Now <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </a>
                </div>
              </div>

              {/* Banner Right Image Preview */}
              <div className="md:col-span-5 flex justify-center items-center">
                {store.banner ? (
                  <img src={store.banner} alt={store.name} className="h-44 sm:h-52 w-auto object-cover rounded-2xl border border-white/10 shadow-lg" />
                ) : (
                  <div className="w-44 h-44 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <ShoppingBag className="w-16 h-16 text-[#55B510]/70" />
                  </div>
                )}
              </div>
            </div>

            {/* Carousel Dots Pagination Indicator (Matching Screenshot) */}
            <div className="flex justify-center space-x-1.5 pt-4">
              <span className="w-6 h-1.5 bg-[#55B510] rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span>
            </div>
          </div>
        </section>

        {/* 4. Categories Section (Matching Screenshot Category Icon Grid) */}
        {categories.length > 0 && (
          <section className="px-4 space-y-4">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#063B2A] tracking-tight">Categories</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/store/${store.slug}?category=${cat.id}`}
                  className="group bg-white rounded-2xl p-3.5 text-center border border-[#DCE7DF] hover:border-[#55B510] hover:shadow-md transition duration-300 flex flex-col items-center justify-between"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F6FAF4] group-hover:bg-[#EAF7DF] flex items-center justify-center text-[#55B510] transition mb-2">
                    <LayoutGrid className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#17221D] group-hover:text-[#063B2A] transition line-clamp-1">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 5. Flash Deals For You Section (Matching Screenshot Flash Deals Layout) */}
        <section className="px-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#063B2A] tracking-tight">Flash Deals For You</h2>
            <a href="#products-grid" className="text-xs font-bold text-[#55B510] hover:underline flex items-center">
              See All <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>
          <FlashSaleSection storeSlug={store.slug} products={products} />
        </section>

        {/* 6. All Products Grid (Matching App Card UI in Screenshot) */}
        <section id="products-grid" className="px-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE7DF] pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#063B2A] tracking-tight">All Products</h2>
              <p className="text-xs text-[#66736C]">Browse items with instant order & COD delivery</p>
            </div>
            <span className="text-xs font-bold text-[#063B2A] bg-[#EAF7DF] px-3 py-1 rounded-full border border-[#55B510]/30">
              {products.length} Items
            </span>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#DCE7DF] space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-[#063B2A] text-lg">No Products Available</h3>
              <p className="text-xs text-[#66736C] max-w-sm mx-auto">
                This store has not published any items in the catalog yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((prod) => {
                const discountPercent =
                  prod.salePrice && prod.regularPrice > prod.salePrice
                    ? Math.round(((prod.regularPrice - prod.salePrice) / prod.regularPrice) * 100)
                    : 0;

                return (
                  <div
                    key={prod.id}
                    className="group bg-white rounded-3xl border border-[#DCE7DF] overflow-hidden hover:shadow-xl hover:border-[#55B510] transition duration-300 flex flex-col justify-between"
                  >
                    <Link href={`/store/${store.slug}/product/${prod.slug}`}>
                      <div className="aspect-square bg-[#F6FAF4] relative overflow-hidden p-2">
                        {prod.images[0] ? (
                          <img
                            src={prod.images[0].url}
                            alt={prod.title}
                            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            No Image
                          </div>
                        )}

                        {/* Floating Wishlist Heart Icon (Matching Screenshot UI) */}
                        <button
                          type="button"
                          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-[#063B2A] hover:text-rose-600 flex items-center justify-center shadow-xs transition"
                        >
                          <Heart className="w-4 h-4" />
                        </button>

                        {/* Discount Badge */}
                        {discountPercent > 0 && (
                          <span className="absolute top-3.5 left-3.5 bg-[#55B510] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                            -{discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-[#17221D] text-xs sm:text-sm line-clamp-2 group-hover:text-[#063B2A] transition">
                          {prod.title}
                        </h3>

                        {/* Star Rating Badge (Matching Screenshot Rating Badges) */}
                        <div className="flex items-center space-x-1 text-amber-500 text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-[11px] font-extrabold text-[#063B2A]">4.9</span>
                          <span className="text-[10px] text-[#66736C] font-semibold">(2.2k)</span>
                        </div>

                        {/* Price Display */}
                        <div className="flex items-baseline space-x-2 pt-1">
                          <span className="text-base sm:text-lg font-black text-[#063B2A]">
                            ৳{prod.salePrice || prod.regularPrice}
                          </span>
                          {prod.salePrice && (
                            <span className="text-xs text-[#66736C] line-through">
                              ৳{prod.regularPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>

                    <div className="p-4 pt-0 space-y-2">
                      <Link href={`/store/${store.slug}/product/${prod.slug}`}>
                        <Button className="w-full bg-[#55B510] hover:bg-[#063B2A] text-white text-xs font-bold h-10 rounded-full shadow-xs transition">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 7. Recently Viewed Section */}
        <section className="px-4">
          <RecentlyViewedSection storeSlug={store.slug} />
        </section>
      </main>

      {/* 8. Mobile App-Style Bottom Navigation Bar */}
      <MobileBottomNav storeSlug={store.slug} categories={categories} />

      {/* 9. Floating WhatsApp Order Button */}
      {whatsappNumber && (
        <a
          href={`https://wa.me/88${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(store.name)},%20I%20have%20an%20inquiry`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 bg-[#063B2A] hover:bg-[#55B510] text-[#55B510] hover:text-white p-3.5 rounded-full shadow-2xl flex items-center space-x-2 border border-[#55B510]/40 transition hover:scale-105 group"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="hidden group-hover:inline-block text-xs font-bold pr-1">WhatsApp Chat</span>
        </a>
      )}

      {/* 10. Storefront Footer */}
      <footer className="bg-[#063B2A] text-emerald-100 text-xs border-t border-[#55B510]/20 mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="font-extrabold text-white text-base flex items-center">
                <span className="w-3 h-3 rounded-full bg-[#55B510] inline-block mr-2"></span>
                {store.name}
              </h3>
              <p className="text-emerald-200 text-xs leading-relaxed">
                {settings.seoDescription || 'Your trusted online shopping destination for high quality products across Bangladesh.'}
              </p>
              {settings.address && (
                <p className="text-emerald-300 text-xs">📍 {settings.address}</p>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Customer Support</h4>
              {settings.phone && <p>📞 Phone: {settings.phone}</p>}
              {whatsappNumber && <p>💬 WhatsApp: {whatsappNumber}</p>}
              {settings.email && <p>✉️ Email: {settings.email}</p>}
              <p>
                <Link href={`/store/${store.slug}/track`} className="text-[#55B510] hover:underline font-bold">
                  🚚 লাইভ অর্ডার ট্র্যাকিং পেজ
                </Link>
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Accepted Payment Methods</h4>
              <div className="flex flex-wrap gap-2 text-[10px] text-white font-bold">
                <span className="bg-pink-600 text-white px-2.5 py-1 rounded-full">bKash</span>
                <span className="bg-orange-600 text-white px-2.5 py-1 rounded-full">Nagad</span>
                <span className="bg-purple-600 text-white px-2.5 py-1 rounded-full">Rocket</span>
                <span className="bg-[#55B510] text-white px-2.5 py-1 rounded-full">Cash On Delivery</span>
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-900/60 mt-8 pt-6 text-center text-emerald-300/60 text-[11px]">
            © {new Date().getFullYear()} {store.name}. All rights reserved. Powered by Nabrijan E-Commerce SaaS.
          </div>
        </div>
      </footer>
    </div>
  );
}
