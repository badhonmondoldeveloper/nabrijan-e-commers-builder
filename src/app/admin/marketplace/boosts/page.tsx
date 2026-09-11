'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, CheckCircle2, Plus, Loader2 } from 'lucide-react';

export default function AdminMarketplaceBoostsPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Package Form
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [durationDays, setDurationDays] = useState('7');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchBoosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/marketplace/boosts');
      const data = await res.json();
      if (data.packages) {
        setPackages(data.packages);
        setPurchases(data.purchases);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/marketplace/boosts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
          price: Number(price),
          durationDays: Number(durationDays),
          description,
          isFeatured,
          isActive: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save boost package');

      setShowModal(false);
      setName('');
      setSlug('');
      setPrice('');
      setDescription('');
      fetchBoosts();
    } catch (err: any) {
      alert(err.message || 'Error creating package');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-amber-400" /> Loading boost packages...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Flame className="w-7 h-7 text-amber-400 fill-amber-400" /> Boost Package Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure promotion packages offered to Bangladeshi merchants for central hub placement.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Boost Package
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-slate-900 p-6 rounded-3xl border flex flex-col justify-between space-y-4 ${
              pkg.isFeatured ? 'border-amber-500/50 shadow-xl shadow-amber-500/10' : 'border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg text-white">{pkg.name}</h3>
                {pkg.isFeatured && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded">
                    FEATURED
                  </span>
                )}
              </div>
              <div className="text-2xl font-black text-amber-400">
                ৳{pkg.price} <span className="text-xs text-slate-400 font-normal">/ {pkg.durationDays} Days</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{pkg.description}</p>
            </div>

            <div className="text-[11px] text-emerald-400 font-bold pt-3 border-t border-slate-800">
              ✓ Active Package
            </div>
          </div>
        ))}
      </div>

      {/* Recent Purchases Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h3 className="font-bold text-base text-white">Merchant Boost Purchases ({purchases.length})</h3>
        </div>

        {purchases.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">
            No boost purchases recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-4">Merchant Store</th>
                  <th className="py-3.5 px-4">Product Title</th>
                  <th className="py-3.5 px-4">Package</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-6">Expires At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 text-slate-400 font-mono">
                      {new Date(p.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-400">
                      {p.store.name}
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">
                      {p.product?.title || 'Catalog Boost'}
                    </td>
                    <td className="py-4 px-4 font-semibold text-amber-300">
                      {p.package.name}
                    </td>
                    <td className="py-4 px-4 font-black text-white">
                      ৳{p.amountPaid}
                    </td>
                    <td className="py-4 px-6 text-slate-400 font-mono">
                      {new Date(p.expiresAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">New Boost Package</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pro Merchant Spotlight (7 Days)"
                  className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Price (BDT) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 499"
                  className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Duration (Days) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What features are included in this package..."
                  className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <label htmlFor="featuredCheck" className="text-xs font-semibold text-slate-300">
                  Mark as Most Popular / Featured
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-800 text-slate-300 font-bold text-xs py-2.5 rounded-xl border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-amber-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl hover:bg-amber-400"
                >
                  {submitting ? 'Creating...' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
