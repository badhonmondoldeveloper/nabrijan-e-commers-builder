'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Store, ShieldCheck, Sparkles, User, Menu, X } from 'lucide-react';

export function MarketplaceHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-xl border-b border-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-xs py-1.5 px-4 font-medium text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>Nabrijan Central Marketplace — Verified Bangladeshi Merchant Storefronts & 100% Authentic Products</span>
        <Link href="/register" className="underline font-bold hover:text-emerald-100 ml-2">
          Sell on Nabrijan →
        </Link>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <Link href="/marketplace" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              N
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-emerald-400">
                NABRIJAN
              </span>
              <span className="text-[10px] block font-bold text-emerald-400 uppercase tracking-widest -mt-1">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 10,000+ authentic Bangladeshi products, fashion, electronics, gadgets..."
              className="w-full bg-slate-800/90 text-sm text-white placeholder-slate-400 rounded-xl pl-4 pr-12 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-bold flex items-center justify-center transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/marketplace/products"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              All Products
            </Link>

            <Link
              href="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-cyan-400" />
              Merchant Login
            </Link>

            <Link
              href="/register"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 flex items-center gap-1.5"
            >
              <Store className="w-4 h-4" />
              Create Store Free
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products & stores..."
              className="w-full bg-slate-800 text-sm text-white placeholder-slate-400 rounded-xl pl-4 pr-10 py-2 border border-slate-700"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 text-emerald-400 px-2"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3">
          <Link
            href="/marketplace/products"
            className="block text-sm font-semibold text-slate-200 py-2 border-b border-slate-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Explore All Products
          </Link>
          <Link
            href="/login"
            className="block text-sm font-semibold text-slate-200 py-2 border-b border-slate-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Merchant Dashboard Login
          </Link>
          <Link
            href="/register"
            className="block w-full text-center bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Start 3-Day Free Trial
          </Link>
        </div>
      )}
    </header>
  );
}
