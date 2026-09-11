'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Store, ShoppingBag, CheckCircle2, Clock, AlertTriangle, Sparkles, Loader2, RefreshCw } from 'lucide-react';

export default function MerchantMarketplacePage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stores/${storeId}/marketplace`);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchProducts();
    }
  }, [storeId]);

  const toggleListing = async (productId: string, currentStatus: boolean, currentCategory?: string) => {
    setSavingId(productId);
    try {
      const res = await fetch(`/api/stores/${storeId}/marketplace`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          isMarketplaceListed: !currentStatus,
          marketplaceCategory: currentCategory || 'Fashion & Clothing',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, ...data.product } : p))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Central Marketplace Sync
          </div>
          <h1 className="text-2xl font-black text-white">Marketplace Product Channels</h1>
          <p className="text-xs text-slate-400 max-w-xl">
            List your store products on the central Nabrijan Marketplace to reach thousands of Bangladeshi shoppers nationwide. Standard platform commission applies (2%).
          </p>
        </div>

        <button
          onClick={fetchProducts}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync List
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-white">Store Catalog ({products.length})</h3>
          <span className="text-xs text-emerald-400 font-bold">
            {products.filter((p) => p.isMarketplaceListed).length} Listed on Marketplace
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> Loading store products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No products found in this store</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Marketplace Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                        {p.images[0]?.url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">📦</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate max-w-xs">{p.title}</span>
                        {p.isFeaturedMarketplace && (
                          <span className="inline-block text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded mt-0.5">
                            ★ BOOSTED
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-white">
                      ৳{p.salePrice ?? p.regularPrice}
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-400">
                      {p.stock} units
                    </td>

                    <td className="py-4 px-4">
                      {p.isMarketplaceListed ? (
                        p.marketplaceStatus === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                            <Clock className="w-3.5 h-3.5" /> Pending Review
                          </span>
                        )
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">Not Listed</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => toggleListing(p.id, p.isMarketplaceListed, p.marketplaceCategory)}
                        disabled={savingId === p.id}
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all ${
                          p.isMarketplaceListed
                            ? 'bg-slate-800 hover:bg-slate-700 text-rose-400 border-slate-700'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400 shadow-md'
                        }`}
                      >
                        {savingId === p.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                        ) : p.isMarketplaceListed ? (
                          'Remove'
                        ) : (
                          'List on Marketplace'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
