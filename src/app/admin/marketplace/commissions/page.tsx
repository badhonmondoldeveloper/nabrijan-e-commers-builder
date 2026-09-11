'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

export default function AdminMarketplaceCommissionsPage() {
  const [commissionRate, setCommissionRate] = useState('0.02');
  const [minWithdrawalLimit, setMinWithdrawalLimit] = useState('500');
  const [autoApproveProducts, setAutoApproveProducts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/marketplace/commissions');
        const data = await res.json();
        if (data.settings) {
          setCommissionRate(String(data.settings.defaultCommissionRate ?? 0.02));
          setMinWithdrawalLimit(String(data.settings.minWithdrawalLimit ?? 500));
          setAutoApproveProducts(Boolean(data.settings.autoApproveProducts));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');

    try {
      const res = await fetch('/api/admin/marketplace/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultCommissionRate: Number(commissionRate),
          minWithdrawalLimit: Number(minWithdrawalLimit),
          autoApproveProducts,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save settings');

      setMsg('Platform settings updated successfully!');
    } catch (err: any) {
      setMsg(err.message || 'Error updating settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> Loading commission settings...
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <DollarSign className="w-7 h-7 text-emerald-400" /> Platform Commission & Financial Rules
        </h1>
        <p className="text-xs text-slate-400">
          Configure marketplace commission rate, merchant payout limits, and product auto-approval policies.
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <label className="text-xs font-bold text-white block mb-1">
            Default Marketplace Commission Rate (Decimal, e.g. 0.02 = 2%)
          </label>
          <input
            type="number"
            step="0.005"
            min="0"
            max="0.5"
            required
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
            className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-3 border border-slate-700 font-mono"
          />
          <p className="text-[11px] text-emerald-400 mt-1">
            Current Rate: <span className="font-bold">{(Number(commissionRate) * 100).toFixed(1)}%</span> automatically deducted on every marketplace checkout sale.
          </p>
        </div>

        <div>
          <label className="text-xs font-bold text-white block mb-1">
            Minimum Seller Payout Withdrawal Limit (BDT)
          </label>
          <input
            type="number"
            required
            min="100"
            value={minWithdrawalLimit}
            onChange={(e) => setMinWithdrawalLimit(e.target.value)}
            className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-3 border border-slate-700 font-mono"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Sellers must accumulate at least ৳{minWithdrawalLimit} before submitting payout requests.
          </p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-850 border border-slate-800">
          <div>
            <span className="font-bold text-sm text-white block">Auto-Approve Merchant Products</span>
            <span className="text-xs text-slate-400">If enabled, products listed by merchants go live instantly without manual review.</span>
          </div>
          <input
            type="checkbox"
            checked={autoApproveProducts}
            onChange={(e) => setAutoApproveProducts(e.target.checked)}
            className="w-5 h-5 accent-emerald-500 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl text-sm transition-colors shadow-lg shadow-emerald-500/20"
        >
          {submitting ? 'Saving Rules...' : 'Save Financial Rules'}
        </button>
      </form>
    </div>
  );
}
