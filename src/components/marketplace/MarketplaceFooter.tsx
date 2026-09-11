import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Headphones, BadgePercent } from 'lucide-react';

export function MarketplaceFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Verified Merchants</h4>
              <p className="text-xs text-slate-400">100% authentic Bangladeshi sellers & brands</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Nationwide COD</h4>
              <p className="text-xs text-slate-400">Cash on Delivery across all 64 districts</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <BadgePercent className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Low 2% Commission</h4>
              <p className="text-xs text-slate-400">Fair growth ecosystem for online merchants</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dedicated Support</h4>
              <p className="text-xs text-slate-400">24/7 Merchant & buyer customer care</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Nabrijan Marketplace</h5>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              The premier Bangladeshi multi-tenant e-commerce SaaS platform. Powering independent storefronts and central discovery.
            </p>
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} Nabrijan Inc. All rights reserved.
            </div>
          </div>

          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop Categories</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/marketplace/products?category=Fashion%20%26%20Clothing" className="hover:text-emerald-400">Fashion & Apparel</Link></li>
              <li><Link href="/marketplace/products?category=Electronics%20%26%20Gadgets" className="hover:text-emerald-400">Electronics & Gadgets</Link></li>
              <li><Link href="/marketplace/products?category=Beauty%20%26%20Cosmetics" className="hover:text-emerald-400">Beauty & Cosmetics</Link></li>
              <li><Link href="/marketplace/products?category=Home%20%26%20Living" className="hover:text-emerald-400">Home & Lifestyle</Link></li>
              <li><Link href="/marketplace/products?category=Groceries%20%26%20Organic" className="hover:text-emerald-400">Organic Groceries</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">For Merchants</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/register" className="hover:text-emerald-400">Create Online Store (3-Day Free Trial)</Link></li>
              <li><Link href="/pricing" className="hover:text-emerald-400">SaaS Subscription Plans</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400">Merchant Dashboard Login</Link></li>
              <li><Link href="/marketplace/products" className="hover:text-emerald-400">List Products on Central Hub</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Service</h5>
            <ul className="space-y-2 text-xs">
              <li><span className="block text-slate-300 font-semibold">Hotline / WhatsApp:</span> 01700-000000</li>
              <li><span className="block text-slate-300 font-semibold">Email Support:</span> support@nabrijan.site</li>
              <li><span className="block text-slate-300 font-semibold">Headquarters:</span> Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
