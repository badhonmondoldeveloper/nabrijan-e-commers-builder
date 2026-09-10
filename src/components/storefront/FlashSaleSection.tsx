'use client';

import React, { useEffect, useState } from 'react';
import { Flame, Clock, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

interface FlashSaleSectionProps {
  storeSlug: string;
  products: {
    id: string;
    title: string;
    slug: string;
    regularPrice: number;
    salePrice?: number | null;
    stock: number;
    images: { url: string }[];
  }[];
}

export default function FlashSaleSection({ storeSlug, products }: FlashSaleSectionProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.salePrice && p.salePrice < p.regularPrice).slice(0, 4);

  if (flashProducts.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 rounded-2xl p-6 text-white shadow-2xl space-y-6">
      {/* Header with Countdown Timer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl animate-pulse">
            <Zap className="w-6 h-6 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              FLASH SALE <span className="text-xs uppercase bg-black/40 px-2 py-0.5 rounded-full font-bold text-amber-300">Limited Time Deals</span>
            </h2>
            <p className="text-xs text-rose-100 mt-0.5">Huge savings up to 50% OFF. Order before timer expires!</p>
          </div>
        </div>

        {/* Timer Counter */}
        <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15">
          <Clock className="w-4 h-4 text-amber-300 animate-spin" />
          <span className="text-xs text-rose-200 font-semibold mr-1">Ends in:</span>
          <div className="flex items-center space-x-1 font-mono font-black text-sm">
            <span className="bg-white text-slate-900 px-2 py-1 rounded shadow">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span>:</span>
            <span className="bg-white text-slate-900 px-2 py-1 rounded shadow">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span>:</span>
            <span className="bg-white text-slate-900 px-2 py-1 rounded shadow">{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Flash Sale Product Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {flashProducts.map((prod) => {
          const discountPercent = Math.round(((prod.regularPrice - (prod.salePrice || 0)) / prod.regularPrice) * 100);
          const stockSoldPercent = Math.min(85, Math.max(40, (100 - prod.stock) * 3));

          return (
            <Link
              key={prod.id}
              href={`/store/${storeSlug}/products/${prod.slug}`}
              className="group bg-white text-slate-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <img
                  src={prod.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-2 left-2 bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded-full shadow uppercase tracking-wider">
                  -{discountPercent}% OFF
                </span>
              </div>

              <div className="p-3.5 space-y-2 flex-grow flex flex-col justify-between">
                <h3 className="font-bold text-xs text-slate-800 line-clamp-2 group-hover:text-red-600 transition">
                  {prod.title}
                </h3>

                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-base font-black text-red-600">৳{prod.salePrice}</span>
                    <span className="text-xs text-slate-400 line-through">৳{prod.regularPrice}</span>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-red-600 h-full rounded-full"
                        style={{ width: `${stockSoldPercent}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-semibold text-slate-500 text-right">
                      {stockSoldPercent}% Sold Out
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
