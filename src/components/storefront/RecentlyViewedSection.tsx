'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, ShoppingBag, ArrowRight } from 'lucide-react';

interface RecentlyViewedItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  regularPrice?: number;
  image?: string;
}

interface RecentlyViewedSectionProps {
  storeSlug: string;
  currentProductId?: string;
}

export default function RecentlyViewedSection({ storeSlug, currentProductId }: RecentlyViewedSectionProps) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`recently_viewed_${storeSlug}`);
      if (raw) {
        const parsed: RecentlyViewedItem[] = JSON.parse(raw);
        // Filter out current product if provided
        const filtered = currentProductId
          ? parsed.filter((item) => item.id !== currentProductId)
          : parsed;
        setItems(filtered.slice(0, 6));
      }
    } catch (e) {}
  }, [storeSlug, currentProductId]);

  if (items.length === 0) return null;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center">
          <History className="w-5 h-5 text-indigo-600 mr-2" /> সম্প্রতি দেখা প্রোডাক্টসমূহ (Recently Viewed)
        </h3>
        <span className="text-xs text-slate-500 font-medium">You might also like</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-400 transition duration-300 flex flex-col justify-between"
          >
            <Link href={`/store/${storeSlug}/product/${item.slug}`}>
              <div className="aspect-square bg-slate-200 overflow-hidden relative">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-3 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-blue-600 transition">
                  {item.title}
                </h4>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-sm font-black text-slate-900">৳{item.price}</span>
                  {item.regularPrice && item.regularPrice > item.price && (
                    <span className="text-[10px] text-slate-400 line-through">৳{item.regularPrice}</span>
                  )}
                </div>
              </div>
            </Link>

            <div className="p-3 pt-0">
              <Link
                href={`/store/${storeSlug}/product/${item.slug}`}
                className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-blue-600 text-white font-bold text-[11px] py-1.5 rounded-lg transition"
              >
                আরেকবার দেখুন
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
