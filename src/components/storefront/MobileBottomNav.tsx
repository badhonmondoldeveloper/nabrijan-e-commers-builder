'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, LayoutGrid, Search, ShoppingBag, X } from 'lucide-react';

interface MobileBottomNavProps {
  storeSlug: string;
  categories: Array<{ id: string; name: string }>;
  cartCount?: number;
}

export default function MobileBottomNav({ storeSlug, categories, cartCount = 0 }: MobileBottomNavProps) {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [localCartCount, setLocalCartCount] = useState(cartCount);

  useEffect(() => {
    // Read cart count from localStorage
    const updateCartCount = () => {
      try {
        const raw = localStorage.getItem(`cart_${storeSlug}`);
        if (raw) {
          const items = JSON.parse(raw);
          const count = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
          setLocalCartCount(count);
        }
      } catch (e) {}
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    const interval = setInterval(updateCartCount, 2000);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, [storeSlug]);

  return (
    <>
      {/* Mobile Bottom Fixed Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DCE7DF] shadow-2xl md:hidden">
        <div className="grid grid-cols-4 h-15">
          <Link
            href={`/store/${storeSlug}`}
            className="flex flex-col items-center justify-center text-[#66736C] hover:text-[#55B510] transition"
          >
            <Home className="w-5 h-5 text-[#063B2A]" />
            <span className="text-[10px] font-bold mt-1 text-[#063B2A]">হোম</span>
          </Link>

          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex flex-col items-center justify-center text-[#66736C] hover:text-[#55B510] transition"
          >
            <LayoutGrid className="w-5 h-5 text-[#063B2A]" />
            <span className="text-[10px] font-bold mt-1 text-[#063B2A]">ক্যাটাগরি</span>
          </button>

          <button
            onClick={() => setShowSearchModal(true)}
            className="flex flex-col items-center justify-center text-[#66736C] hover:text-[#55B510] transition"
          >
            <Search className="w-5 h-5 text-[#063B2A]" />
            <span className="text-[10px] font-bold mt-1 text-[#063B2A]">সার্চ</span>
          </button>

          <Link
            href={`/store/${storeSlug}/cart`}
            className="flex flex-col items-center justify-center text-[#66736C] hover:text-[#55B510] transition relative"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#063B2A]" />
              {localCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#55B510] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {localCartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-1 text-[#063B2A]">কার্ট</span>
          </Link>
        </div>
      </nav>

      {/* Category Modal Sheet */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end md:hidden">
          <div className="w-full bg-white rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">সকল ক্যাটাগরি</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/store/${storeSlug}?category=${cat.id}`}
                    onClick={() => setShowCategoryModal(false)}
                    className="p-3 bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-xl text-center font-bold text-xs text-slate-800 transition"
                  >
                    {cat.name}
                  </Link>
                ))
              ) : (
                <p className="col-span-2 text-xs text-slate-500 text-center py-4">কোনো ক্যাটাগরি পাওয়া যায়নি</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs p-4 flex items-start pt-20 justify-center md:hidden">
          <div className="w-full max-w-md bg-white rounded-2xl p-4 space-y-4 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">পণ্য খুঁজুন</h3>
              <button onClick={() => setShowSearchModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="যেমন: স্মার্ট ওয়াচ, হেডফোন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
            {searchQuery && (
              <div className="pt-2 text-center">
                <Link
                  href={`/store/${storeSlug}?q=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setShowSearchModal(false)}
                  className="inline-block w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md"
                >
                  " {searchQuery} " ফলাফল দেখুন
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
