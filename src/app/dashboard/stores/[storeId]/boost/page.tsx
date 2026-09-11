'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Flame, Sparkles, Zap, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export default function MerchantBoostPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const [packages, setPackages] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [buyingPkgId, setBuyingPkgId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchBoostData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stores/${storeId}/boost`);
      const data = await res.json();
      if (data.packages) {
        setPackages(data.packages);
        setProducts(data.products);
        setWalletBalance(data.walletBalance);
        if (data.products.length > 0) {
          setSelectedProduct(data.products[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchBoostData();
    }
  }, [storeId]);

  const handlePurchase = async (packageId: string) => {
    if (!selectedProduct) {
      setMsg({ type: 'error', text: 'Please select a product to boost' });
      return;
    }

    setBuyingPkgId(packageId);
    setMsg(null);

    try {
      const res = await fetch(`/api/stores/${storeId}/boost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, productId: selectedProduct }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Boost purchase failed');
      }

      setMsg({ type: 'success', text: data.message });
      fetchBoostData();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Error purchasing boost' });
    } finally {
      setBuyingPkgId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-amber-400" /> Loading boost store...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 p-6 rounded-3xl border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-amber-400" /> Merchant Boost Store
          </div>
          <h1 className="text-2xl font-black text-white">Promote Products & Skyrocket Sales</h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Pin your product to top category results and Central Marketplace hero placement. Instant activation using wallet balance.
          </p>
        </div>

        <div className="bg-slate-900/90 px-5 py-3 rounded-2xl border border-slate-800 text-right">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Wallet Balance</div>
          <div className="text-xl font-black text-emerald-400">৳{walletBalance}</div>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl text-xs font-semibold border ${
          msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          {msg.text}
        </div>
      )}

      {/* Target Product Selector */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
        <label className="text-xs font-bold text-white block uppercase tracking-wider">
          Step 1: Choose Product to Boost
        </label>
        {products.length === 0 ? (
          <p className="text-xs text-amber-400">
            No marketplace-listed products found. Please list a product on the Central Marketplace channel first.
          </p>
        ) : (
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-3 border border-slate-700 font-semibold focus:border-amber-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} {p.isFeaturedMarketplace ? '(★ Currently Boosted)' : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Packages Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 2: Select Promotion Package</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-slate-900 p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-6 ${
                pkg.isFeatured ? 'border-amber-500/60 shadow-xl shadow-amber-500/10 relative' : 'border-slate-800'
              }`}
            >
              {pkg.isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-3 py-0.5 rounded-full shadow-md">
                  ★ MOST POPULAR
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-bold text-lg text-white">{pkg.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-400">৳{pkg.price}</span>
                  <span className="text-xs text-slate-400">/ {pkg.durationDays} Days</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{pkg.description}</p>
              </div>

              <button
                onClick={() => handlePurchase(pkg.id)}
                disabled={buyingPkgId === pkg.id || !selectedProduct}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                {buyingPkgId === pkg.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" /> Activate Boost Now
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
