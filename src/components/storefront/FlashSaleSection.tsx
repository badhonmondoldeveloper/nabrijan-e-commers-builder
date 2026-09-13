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
    <div className="bg-[#063B2A] rounded-2xl p-6 text-white shadow-xl space-y-6 border border-[#55B510]/30">
      {/* Header with Countdown Timer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#55B510]/30 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#55B510]/20 border border-[#55B510]/40 rounded-xl animate-pulse">
            <Zap className="w-6 h-6 text-[#55B510] fill-[#55B510]" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              FLASH SALE <span className="text-xs uppercase bg-[#55B510] text-white px-2.5 py-0.5 rounded-full font-black">Limited Time Deals</span>
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5">Huge savings up to 50% OFF. Order before timer expires!</p>
          </div>
        </div>

        {/* Timer Counter */}
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-[#55B510]/30">
          <Clock className="w-4 h-4 text-[#55B510] animate-spin" />
          <span className="text-xs text-emerald-200 font-semibold mr-1">Ends in:</span>
          <div className="flex items-center space-x-1 font-mono font-black text-sm">
            <span className="bg-[#55B510] text-white px-2 py-1 rounded shadow">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span>:</span>
            <span className="bg-[#55B510] text-white px-2 py-1 rounded shadow">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span>:</span>
            <span className="bg-[#55B510] text-white px-2 py-1 rounded shadow">{String(timeLeft.seconds).padStart(2, '0')}</span>
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
              href={`/store/${storeSlug}/product/${prod.slug}`}
              className="group bg-white text-[#17221D] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 flex flex-col justify-between border border-[#DCE7DF] hover:border-[#55B510]"
            >
              <div className="relative aspect-square bg-[#F6FAF4] overflow-hidden">
                <img
                  src={prod.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-2 left-2 bg-[#55B510] text-white font-black text-xs px-2 py-0.5 rounded-full shadow uppercase tracking-wider">
                  -{discountPercent}% OFF
                </span>
              </div>

              <div className="p-3.5 space-y-2 flex-grow flex flex-col justify-between">
                <h3 className="font-bold text-xs text-[#17221D] line-clamp-2 group-hover:text-[#063B2A] transition">
                  {prod.title}
                </h3>

                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-base font-black text-[#063B2A]">৳{prod.salePrice}</span>
                    <span className="text-xs text-[#66736C] line-through">৳{prod.regularPrice}</span>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-[#EAF7DF] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#55B510] h-full rounded-full"
                        style={{ width: `${stockSoldPercent}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-semibold text-[#66736C] text-right">
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
