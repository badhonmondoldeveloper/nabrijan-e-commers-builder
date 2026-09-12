'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, X, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';

interface ExitIntentPopupProps {
  storeSlug: string;
}

export default function ExitIntentPopup({ storeSlug }: ExitIntentPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem(`exit_popup_dismissed_${storeSlug}`);
    if (isDismissed) return;

    // 1. Desktop Exit Intent (mouse leaving top of screen)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10) {
        setIsOpen(true);
        sessionStorage.setItem(`exit_popup_dismissed_${storeSlug}`, 'true');
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    // 2. Mobile fallback timer (45 seconds)
    const timer = setTimeout(() => {
      const isStillDismissed = sessionStorage.getItem(`exit_popup_dismissed_${storeSlug}`);
      if (!isStillDismissed) {
        setIsOpen(true);
        sessionStorage.setItem(`exit_popup_dismissed_${storeSlug}`, 'true');
      }
    }, 45000);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [storeSlug]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('FIRST10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative shadow-2xl space-y-6 overflow-hidden">
        {/* Decorative Top Banner Accent */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-rose-500/30 to-amber-500/30 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 pt-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
            <Gift className="w-7 h-7 text-white animate-bounce" />
          </div>

          <div className="inline-flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-black text-amber-400">
            <Sparkles className="w-3.5 h-3.5" /> বিশেষ অফার নোটিফিকেশন
          </div>

          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            অপেক্ষা করুন! ডিসকাউন্ট নিয়ে যান 🔥
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            আপনার প্রথম অর্ডারে কুপন কোড <span className="font-mono font-bold text-amber-300">FIRST10</span> ব্যবহার করে পাবেন ইনস্ট্যান্ট <span className="text-emerald-400 font-black">১০% ডিসকাউন্ট</span>!
          </p>
        </div>

        {/* Coupon Copy Box */}
        <div className="bg-slate-900 border border-amber-500/40 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Coupon Code:</div>
            <div className="font-mono font-black text-lg text-amber-400 tracking-wider">FIRST10</div>
          </div>
          <button
            onClick={handleCopyCode}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 transition shadow"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-slate-950" /> <span>কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> <span>কোড কপি করুন</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full h-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 transition"
          >
            <span>এখনই ডিসকাউন্টে কেনাকাটা করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
