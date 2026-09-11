'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, XCircle, Star, Clock, Loader2, RefreshCw } from 'lucide-react';

export default function AdminMarketplaceProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/marketplace/products?status=${filter}`);
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
    fetchProducts();
  }, [filter]);

  const handleAction = async (productId: string, action: 'APPROVE' | 'REJECT', isFeatured?: boolean) => {
    setUpdatingId(productId);
    try {
      const res = await fetch('/api/admin/marketplace/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action, isFeaturedMarketplace: isFeatured }),
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
      setUpdatingId(null);
    }
  };

  const toggleFeatured = async (productId: string, currentFeatured: boolean) => {
    setUpdatingId(productId);
    try {
      const res = await fetch('/api/admin/marketplace/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action: 'NONE', isFeaturedMarketplace: !currentFeatured }),
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
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-emerald-400" /> Marketplace Product Moderation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review product submissions from merchant storefronts before central hub listing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                filter === st
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> Fetching marketplace catalog...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">
            No products found for filter: {filter}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-4">Merchant Store</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-6 text-right">Moderation Actions</th>
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
                      <span className="truncate max-w-xs">{p.title}</span>
                    </td>

                    <td className="py-4 px-4 font-bold text-emerald-400">
                      {p.store.name}
                    </td>

                    <td className="py-4 px-4 font-bold text-white">
                      ৳{p.salePrice ?? p.regularPrice}
                    </td>

                    <td className="py-4 px-4">
                      {p.marketplaceStatus === 'APPROVED' ? (
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          APPROVED
                        </span>
                      ) : p.marketplaceStatus === 'REJECTED' ? (
                        <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                          REJECTED
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          PENDING
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleFeatured(p.id, p.isFeaturedMarketplace)}
                        disabled={updatingId === p.id}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all ${
                          p.isFeaturedMarketplace
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {p.isFeaturedMarketplace ? '★ Featured' : 'Normal'}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      {p.marketplaceStatus !== 'APPROVED' && (
                        <button
                          onClick={() => handleAction(p.id, 'APPROVE')}
                          disabled={updatingId === p.id}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl"
                        >
                          Approve
                        </button>
                      )}

                      {p.marketplaceStatus !== 'REJECTED' && (
                        <button
                          onClick={() => handleAction(p.id, 'REJECT')}
                          disabled={updatingId === p.id}
                          className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-500/30"
                        >
                          Reject
                        </button>
                      )}
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
