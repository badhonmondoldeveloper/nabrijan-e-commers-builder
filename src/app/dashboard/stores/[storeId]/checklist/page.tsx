'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, Circle, Rocket, Store, Package, Truck, Globe, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export default function MerchantLaunchChecklistPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStoreDetails() {
      try {
        const res = await fetch(`/api/stores/${storeId}`);
        const data = await res.json();
        if (data.store) {
          setStore(data.store);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (storeId) fetchStoreDetails();
  }, [storeId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> Computing store launch score...
      </div>
    );
  }

  const hasProducts = store?.products?.length > 0;
  const hasLogo = Boolean(store?.logo);
  const hasPhone = Boolean(store?.settings?.phone);
  const hasMarketplaceProduct = store?.products?.some((p: any) => p.isMarketplaceListed);
  const hasCustomDomain = Boolean(store?.customDomain);

  const completedSteps = [
    hasProducts,
    hasLogo && hasPhone,
    hasMarketplaceProduct,
    hasCustomDomain,
  ].filter(Boolean).length;

  const progressPercent = Math.round((completedSteps / 4) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Rocket className="w-3.5 h-3.5" /> Merchant Onboarding & Launch Score
            </div>
            <h1 className="text-2xl font-black text-white">Store Launch Checklist</h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Complete these steps to maximize your store conversion rate and start receiving customer orders.
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-black text-emerald-400">{progressPercent}%</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Completion Score</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              hasProducts ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
            }`}>
              {hasProducts ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Add Your First Product</h3>
              <p className="text-xs text-slate-400">Upload products with images, price, and stock info.</p>
            </div>
          </div>
          <Link
            href={`/dashboard/stores/${storeId}`}
            className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl border border-slate-700"
          >
            Manage Products →
          </Link>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              hasLogo && hasPhone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
            }`}>
              {hasLogo && hasPhone ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Configure Store Logo & Contact Details</h3>
              <p className="text-xs text-slate-400">Add merchant phone number and logo for customer trust.</p>
            </div>
          </div>
          <Link
            href={`/dashboard/stores/${storeId}`}
            className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl border border-slate-700"
          >
            Edit Store Info →
          </Link>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              hasMarketplaceProduct ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
            }`}>
              {hasMarketplaceProduct ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">List Product on Central Marketplace</h3>
              <p className="text-xs text-slate-400">Get free exposure on central /marketplace channel.</p>
            </div>
          </div>
          <Link
            href={`/dashboard/stores/${storeId}/marketplace`}
            className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl border border-slate-700"
          >
            Marketplace Sync →
          </Link>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              hasCustomDomain ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
            }`}>
              {hasCustomDomain ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Connect Custom Domain (Optional)</h3>
              <p className="text-xs text-slate-400">Link your own .com or .com.bd domain with SSL.</p>
            </div>
          </div>
          <Link
            href={`/dashboard/stores/${storeId}`}
            className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl border border-slate-700"
          >
            Domain Settings →
          </Link>
        </div>
      </div>
    </div>
  );
}
