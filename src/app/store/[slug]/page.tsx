import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Star, Truck, ShieldCheck, PhoneCall, ArrowRight, Heart } from 'lucide-react';
import FlashSaleSection from '@/components/storefront/FlashSaleSection';

export default async function MerchantStorefrontPage({
  params,
}: {
  params: { slug: string };
}) {
  const store = await db.store.findUnique({
    where: { slug: params.slug },
    include: {
      settings: true,
      themeSettings: {
        include: {
          sections: {
            where: { isVisible: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  });

  if (!store) notFound();

  // Fetch store products for sections
  const products = await db.product.findMany({
    where: { storeId: store.id, status: 'ACTIVE' },
    include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
    take: 12,
  });

  // Fetch store categories
  const categories = await db.category.findMany({
    where: { storeId: store.id, isActive: true },
    take: 6,
  });

  const headerConfig = store.themeSettings?.headerConfig
    ? JSON.parse(store.themeSettings.headerConfig)
    : { showAnnouncement: true, announcementText: '🎉 Free Shipping across Bangladesh!' };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Announcement Bar */}
      {headerConfig.showAnnouncement && (
        <div className="bg-blue-600 text-white text-xs py-2 px-4 text-center font-medium tracking-wide">
          {headerConfig.announcementText}
        </div>
      )}

      {/* Storefront Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/store/${store.slug}`} className="flex items-center space-x-2">
            {store.logo ? (
              <img src={store.logo} alt={store.name} className="h-8 w-auto" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                {store.name.charAt(0)}
              </div>
            )}
            <span className="text-lg font-bold text-slate-900 tracking-tight">{store.name}</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href={`/store/${store.slug}/cart`}>
              <Button variant="outline" size="sm" className="relative border-slate-200 text-slate-700">
                <ShoppingBag className="w-4 h-4 mr-1.5" /> Cart
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Dynamic Theme Section Renderer */}
      <main className="flex-1">
        {store.themeSettings?.sections.map((section) => {
          if (section.sectionType === 'HERO') {
            const content = JSON.parse(section.content || '{}');
            return (
              <React.Fragment key={section.id}>
                <section className="bg-gradient-to-r from-slate-900 to-blue-950 text-white py-16 px-4">
                  <div className="container mx-auto max-w-4xl text-center space-y-6">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                      Welcome to {store.name}
                    </Badge>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                      {section.title || `Welcome to ${store.name}`}
                    </h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
                      {section.subtitle || 'Browse our premium products with fast Cash on Delivery shipping.'}
                    </p>
                    <div>
                      <a href="#featured-products">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg">
                          {content.buttonText || 'Shop Collection Now'} <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </section>

                <div className="container mx-auto px-4 py-8">
                  <FlashSaleSection storeSlug={store.slug} products={products} />
                </div>
              </React.Fragment>
            );
          }

          if (section.sectionType === 'FEATURED_PRODUCTS') {
            return (
              <section key={section.id} id="featured-products" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                  <div className="text-center max-w-xl mx-auto mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {section.title || 'Featured Products'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">{section.subtitle}</p>
                  </div>

                  {products.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-sm">
                      No products published yet in this store catalog.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {products.map((prod) => (
                        <div
                          key={prod.id}
                          className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition flex flex-col justify-between"
                        >
                          <Link href={`/store/${store.slug}/product/${prod.slug}`}>
                            <div className="aspect-square bg-slate-100 relative overflow-hidden">
                              {prod.images[0] ? (
                                <img
                                  src={prod.images[0].url}
                                  alt={prod.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                  No Image
                                </div>
                              )}
                              {prod.salePrice && (
                                <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                  SALE
                                </span>
                              )}
                            </div>
                            <div className="p-4 space-y-2">
                              <h3 className="font-semibold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition">
                                {prod.title}
                              </h3>
                              <div className="flex items-baseline space-x-2">
                                <span className="text-base font-bold text-blue-600">
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

                          <div className="p-4 pt-0">
                            <Link href={`/store/${store.slug}/product/${prod.slug}`}>
                              <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white text-xs h-9">
                                View Product Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          if (section.sectionType === 'BENEFITS') {
            return (
              <section key={section.id} className="py-12 bg-slate-100 border-y border-slate-200">
                <div className="container mx-auto px-4">
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="p-4 space-y-2">
                      <Truck className="w-8 h-8 mx-auto text-blue-600" />
                      <h4 className="font-bold text-slate-900">Fast Delivery</h4>
                      <p className="text-xs text-slate-500">Cash on delivery shipping all across Bangladesh</p>
                    </div>
                    <div className="p-4 space-y-2">
                      <ShieldCheck className="w-8 h-8 mx-auto text-blue-600" />
                      <h4 className="font-bold text-slate-900">100% Guaranteed Quality</h4>
                      <p className="text-xs text-slate-500">Handpicked authentic products verified by merchant</p>
                    </div>
                    <div className="p-4 space-y-2">
                      <PhoneCall className="w-8 h-8 mx-auto text-blue-600" />
                      <h4 className="font-bold text-slate-900">Easy Customer Support</h4>
                      <p className="text-xs text-slate-500">Dedicated assistance for order inquiries</p>
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          return null;
        })}
      </main>

      {/* Storefront Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="font-semibold text-slate-200">{store.name}</p>
          <p>© {new Date().getFullYear()} {store.name}. Powered by Nabrijan SaaS.</p>
        </div>
      </footer>
    </div>
  );
}
