'use client';

import React, { useState, useEffect } from 'react';
import { Flame, ShoppingBag, X, CheckCircle2 } from 'lucide-react';

interface SocialProofNotifyProps {
  products: Array<{ title: string; image?: string }>;
}

const CITIES = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Gazipur', 'Cumilla', 'Narayanganj', 'Barishal', 'Bogra'];
const NAMES = ['আরিফ', 'রাফসান', 'সাব্বির', 'তানজিম', 'ফাহিম', 'মাহমুদ', 'তাহসীন', 'নুসরাত', 'শামীম', 'ইমরান'];
const TIMES = ['১ মিনিট আগে', '২ মিনিট আগে', 'এইমাত্র', '৩ মিনিট আগে', '৪ মিনিট আগে'];

export default function SocialProofNotify({ products }: SocialProofNotifyProps) {
  const [currentNotice, setCurrentNotice] = useState<{
    name: string;
    city: string;
    productTitle: string;
    time: string;
    image?: string;
  } | null>(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!products || products.length === 0) return;

    const triggerNotification = () => {
      const randomProd = products[Math.floor(Math.random() * products.length)];
      const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
      const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
      const randomTime = TIMES[Math.floor(Math.random() * TIMES.length)];

      setCurrentNotice({
        name: randomName,
        city: randomCity,
        productTitle: randomProd.title,
        time: randomTime,
        image: randomProd.image,
      });

      setVisible(true);

      // Hide notification after 6 seconds
      setTimeout(() => {
        setVisible(false);
      }, 6000);
    };

    // First trigger after 8 seconds
    const initialTimer = setTimeout(triggerNotification, 8000);

    // Repeat every 35 seconds
    const interval = setInterval(triggerNotification, 35000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [products]);

  if (!visible || !currentNotice) return null;

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-xs bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white rounded-2xl p-3.5 shadow-2xl animate-in slide-in-from-bottom duration-500 hidden sm:block">
      <div className="flex items-center space-x-3 relative">
        <button
          onClick={() => setVisible(false)}
          className="absolute -top-1 -right-1 text-slate-500 hover:text-slate-300 p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
          {currentNotice.image ? (
            <img src={currentNotice.image} alt={currentNotice.productTitle} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
          )}
        </div>

        <div className="space-y-0.5 pr-3">
          <div className="flex items-center space-x-1 text-[11px] font-extrabold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>নতুন অনলাইন অর্ডার 🔥</span>
          </div>
          <p className="text-xs font-bold text-slate-100 line-clamp-1">
            <span className="text-amber-300 font-extrabold">{currentNotice.city}</span> থেকে {currentNotice.name}
          </p>
          <p className="text-[10px] text-slate-300 truncate max-w-[170px]">
            {currentNotice.productTitle}
          </p>
          <span className="text-[9px] text-slate-500 font-semibold">{currentNotice.time}</span>
        </div>
      </div>
    </div>
  );
}
