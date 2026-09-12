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
  const store = await db.store.findUnique({
    where: { slug: params.slug },
    include: {
      settings: true,
    },
  });

  if (!store) notFound();

  if (store.status !== 'ACTIVE') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">{store.name} is Temporarily Inactive</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            This store is currently undergoing maintenance or has been set to inactive by platform management.
          </p>
          <Link href="/" className="inline-block mt-2">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-6 py-2 rounded-lg">
              Return to Nabrijan Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch store products
  const products = await db.product.findMany({
    where: { storeId: store.id, status: 'ACTIVE' },
    include: {
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      category: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 36,
  });

  // Fetch store categories
  const categories = await db.category.findMany({
    where: { storeId: store.id, isActive: true },
    orderBy: { sortOrder: 'asc' },
    take: 12,
  });

  const settings = store.settings || {};
  const whatsappNumber = settings.whatsappNumber || settings.phone || '';
  const announcementText = settings.announcementText || '🔥 সারা বাংলাদেশে ক্যাশ অন ডেলিভারি এবং দ্রুত ডেলিভারি!';

  const notifyProducts = products.map((p) => ({
    title: p.title,
    image: p.images[0]?.url,
  }));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-16 md:pb-0">
      {/* Exit Intent Popup */}
      <ExitIntentPopup storeSlug={store.slug} />

      {/* Social Proof Live Purchase Toast */}
      <SocialProofNotify products={notifyProducts} />

      {/* 1. Top Announcement Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2 border-b border-slate-800">
        <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>{announcementText}</span>
        {settings.phone && (
          <span className="hidden md:inline-block text-slate-400 pl-4 border-l border-slate-700">
            📞 হেল্পলাইন: <a href={`tel:${settings.phone}`} className="text-white hover:underline">{settings.phone}</a>
          </span>
        )}
      </div>

      {/* 2. Amazon / Daraz Style Main Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Store Brand / Logo */}
          <Link href={`/store/${store.slug}`} className="flex items-center space-x-3 group">
            {store.logo ? (
              <img src={store.logo} alt={store.name} className="h-10 sm:h-12 w-auto object-contain rounded-lg border border-slate-100 p-0.5" />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-md">
                {store.name.charAt(0)}
              </div>
            )}
            <div>
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition">
                {store.name}
              </span>
              <p className="text-[10px] text-slate-500 font-bold">Verified E-Commerce Store</p>
            </div>
          </Link>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <Link href={`/store/${store.slug}/track`} className="hidden sm:inline-flex items-center text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 px-3 py-2 rounded-xl">
              <Truck className="w-4 h-4 mr-1.5 text-blue-600" /> অর্ডার ট্র্যাকিং
            </Link>

            {whatsappNumber && (
              <a
                href={`https://wa.me/88${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(store.name)},%20I%20want%20to%20order`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl shadow-sm transition"
              >
                <MessageCircle className="w-4 h-4 mr-1.5 fill-current" /> WhatsApp Order
              </a>
            )}

            <Link href={`/store/${store.slug}/cart`}>
              <Button variant="outline" size="sm" className="relative border-slate-300 text-slate-800 hover:bg-slate-50 font-bold px-4 h-10 rounded-xl">
                <ShoppingBag className="w-4 h-4 mr-2 text-blue-600" /> Cart
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 space-y-8 pb-12">
        {/* 3. Hero Banner & Amazon-Style Sidebar Layout */}
        <section className="container mx-auto px-4 pt-6">
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Desktop Category Sidebar (Amazon Style) */}
            {categories.length > 0 && (
              <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="font-extrabold text-slate-900 text-sm flex items-center border-b border-slate-100 pb-2.5">
                  <LayoutGrid className="w-4 h-4 text-blue-600 mr-2" /> সকল ক্যাটাগরি
                </div>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/store/${store.slug}?category=${cat.id}`}
                      className="block text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 p-2.5 rounded-xl transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </aside>
            )}

            {/* Banner Section */}
            <div className={`w-full ${categories.length > 0 ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
              <div className="relative bg-slate-900 text-white rounded-3xl overflow-hidden shadow-md">
                {store.banner ? (
                  <div className="relative h-64 sm:h-80 w-full">
                    <img src={store.banner} alt={store.name} className="w-full h-full object-cover opacity-85" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex items-end p-6 sm:p-10">
                      <div className="max-w-xl space-y-2.5">
                        <Badge className="bg-blue-600 text-white border-none font-bold">Official Storefront</Badge>
                        <h1 className="text-2xl sm:text-4xl font-black text-white">{store.name} Collection</h1>
                        <p className="text-slate-300 text-xs sm:text-sm line-clamp-2">
                          {settings.seoDescription || 'Browse top quality handpicked products with instant Cash on Delivery all across Bangladesh.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 sm:py-20 px-6 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-center relative overflow-hidden">
                    <div className="max-w-2xl mx-auto space-y-4">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 font-bold px-3 py-1 text-xs">
                        100% Authentic Quality Guaranteed
                      </Badge>
                      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                        Welcome to <span className="text-blue-400">{store.name}</span>
                      </h1>
                      <p className="text-slate-300 text-xs sm:text-sm">
                        {settings.seoDescription || 'Order premium products online with fast delivery & Cash on Delivery anywhere in Bangladesh.'}
                      </p>
                      <div className="pt-2 flex justify-center">
                        <a href="#products-grid">
                          <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 rounded-xl shadow-lg shadow-blue-600/30">
                            পণ্যসমূহ দেখুন <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Trust Badges */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">দ্রুত ডেলিভারি</h4>
                <p className="text-[11px] text-slate-500">সারা বাংলাদেশে হোম ডেলিভারি</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">ক্যাশ অন ডেলিভারি</h4>
                <p className="text-[11px] text-slate-500">পণ্য হাতে পেয়ে টাকা দিন</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">১০০% আসল পণ্য</h4>
                <p className="text-[11px] text-slate-500">সেরা মানের প্রিমিয়াম প্রোডাক্ট</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">সরাসরি সাপোর্ট</h4>
                <p className="text-[11px] text-slate-500">যেকোনো তথ্যে কল বা মেসেজ দিন</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Flash Sale Section */}
        <section className="container mx-auto px-4">
          <FlashSaleSection storeSlug={store.slug} products={products} />
        </section>

        {/* 6. All Products Grid (Modern Product Cards with Hover Elevation) */}
        <section id="products-grid" className="container mx-auto px-4 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">All Store Products</h2>
              <p className="text-xs text-slate-500">Explore items with price, stock, and instant order</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {products.length} Products Available
            </span>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-lg">No Products Available</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
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
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
                  >
                    <Link href={`/store/${store.slug}/product/${prod.slug}`}>
                      <div className="aspect-square bg-slate-100 relative overflow-hidden">
                        {prod.images[0] ? (
                          <img
                            src={prod.images[0].url}
                            alt={prod.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            No Image
                          </div>
                        )}

                        {/* Discount Badge */}
                        {discountPercent > 0 && (
                          <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-md">
                            -{discountPercent}% OFF
                          </span>
                        )}

                        <span className="absolute top-2.5 right-2.5 bg-slate-900/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          In Stock ({prod.stock})
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        {prod.category && (
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                            {prod.category.name}
                          </span>
                        )}
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 group-hover:text-blue-600 transition">
                          {prod.title}
                        </h3>

                        {/* Price Display */}
                        <div className="flex items-baseline space-x-2 pt-1">
                          <span className="text-base sm:text-lg font-black text-slate-900">
                            ৳{prod.salePrice || prod.regularPrice}
                          </span>
                          {prod.salePrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ৳{prod.regularPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>

                    <div className="p-4 pt-0 space-y-2">
                      <Link href={`/store/${store.slug}/product/${prod.slug}`}>
                        <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold h-10 rounded-xl shadow-xs transition">
                          View & Order Now
                        </Button>
                      </Link>

                      {whatsappNumber && (
                        <a
                          href={`https://wa.me/88${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi,%20I%20want%20to%20order%20*${encodeURIComponent(prod.title)}*%20(Price:%20৳${prod.salePrice || prod.regularPrice})`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-center text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-1.5 rounded-xl border border-emerald-200 transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5 mr-1" /> Order on WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 7. Recently Viewed Section */}
        <section className="container mx-auto px-4">
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
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl flex items-center space-x-2 transition hover:scale-105 group"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="hidden group-hover:inline-block text-xs font-bold pr-1">WhatsApp Chat</span>
        </a>
      )}

      {/* 10. Storefront Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base">{store.name}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                {settings.seoDescription || 'Your trusted online shopping destination for high quality products across Bangladesh.'}
              </p>
              {settings.address && (
                <p className="text-slate-400 text-xs">📍 {settings.address}</p>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Customer Support</h4>
              {settings.phone && <p>📞 Phone: {settings.phone}</p>}
              {whatsappNumber && <p>💬 WhatsApp: {whatsappNumber}</p>}
              {settings.email && <p>✉️ Email: {settings.email}</p>}
              <p>
                <Link href={`/store/${store.slug}/track`} className="text-blue-400 hover:underline">
                  🚚 লাইভ অর্ডার ট্র্যাকিং পেজ
                </Link>
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Accepted Payment Methods</h4>
              <div className="flex flex-wrap gap-2 text-[10px] text-slate-300 font-bold">
                <span className="bg-pink-600 text-white px-2.5 py-1 rounded">bKash</span>
                <span className="bg-orange-600 text-white px-2.5 py-1 rounded">Nagad</span>
                <span className="bg-purple-600 text-white px-2.5 py-1 rounded">Rocket</span>
                <span className="bg-slate-800 text-white px-2.5 py-1 rounded">Cash On Delivery</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-900 mt-8 pt-6 text-center text-slate-600 text-[11px]">
            © {new Date().getFullYear()} {store.name}. All rights reserved. Powered by Nabrijan E-Commerce SaaS.
          </div>
        </div>
      </footer>
    </div>
  );
}
