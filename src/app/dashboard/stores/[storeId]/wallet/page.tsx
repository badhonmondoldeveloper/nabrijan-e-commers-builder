'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, DollarSign, Loader2, RefreshCw } from 'lucide-react';

export default function MerchantWalletPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const [wallet, setWallet] = useState<any>(null);
  const [minLimit, setMinLimit] = useState(500);
  const [commissionRate, setCommissionRate] = useState(0.02);
  const [loading, setLoading] = useState(true);

  // Withdrawal form
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [accountDetails, setAccountDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stores/${storeId}/wallet`);
      const data = await res.json();
      if (data.wallet) {
        setWallet(data.wallet);
        setMinLimit(data.minWithdrawalLimit ?? 500);
        setCommissionRate(data.commissionRate ?? 0.02);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchWallet();
    }
  }, [storeId]);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');

    try {
      const res = await fetch(`/api/stores/${storeId}/wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          paymentMethod,
          accountDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Payout request failed');
      }

      setMsg('Payout request submitted successfully!');
      setShowWithdrawModal(false);
      setAmount('');
      setAccountDetails('');
      fetchWallet();
    } catch (err: any) {
      setMsg(err.message || 'Error submitting payout request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> Loading financial wallet...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Wallet className="w-7 h-7 text-emerald-400" /> Merchant Financial Wallet
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Auditable double-entry accounting ledger, Marketplace sales credits, and payout settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchWallet}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            Request Payout →
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          {msg}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Available Balance</div>
          <div className="text-3xl font-black text-emerald-400">৳{wallet?.balance ?? 0}</div>
          <div className="text-[10px] text-slate-500">Min. payout threshold: ৳{minLimit}</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Sales Earned</div>
          <div className="text-3xl font-black text-white">৳{wallet?.totalEarned ?? 0}</div>
          <div className="text-[10px] text-slate-500">Net revenue after 2% commission</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending Payouts</div>
          <div className="text-3xl font-black text-amber-400">৳{wallet?.pendingPayouts ?? 0}</div>
          <div className="text-[10px] text-slate-500">Processing by platform admin</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Platform Commission</div>
          <div className="text-3xl font-black text-purple-400">৳{wallet?.totalCommissionPaid ?? 0}</div>
          <div className="text-[10px] text-slate-500">{(commissionRate * 100).toFixed(1)}% Central Fee Paid</div>
        </div>
      </div>

      {/* Ledger Transactions Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-white">Auditable Financial Ledger</h3>
          <span className="text-xs text-slate-400">Double-Entry Accounting</span>
        </div>

        {wallet?.transactions?.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">
            No ledger transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {wallet?.transactions?.map((tx: any) => {
                  const isCredit = tx.type.startsWith('CREDIT');
                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 text-slate-400 font-mono">
                        {new Date(tx.createdAt).toLocaleDateString('en-GB')} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCredit ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-white font-medium">
                        {tx.description}
                      </td>
                      <td className={`py-4 px-6 text-right font-black ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isCredit ? '+' : '-'}৳{tx.amount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Request Payout Settlement</h3>
            <p className="text-xs text-slate-400">
              Available Balance: <span className="font-bold text-emerald-400">৳{wallet?.balance ?? 0}</span> (Min: ৳{minLimit})
            </p>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Amount (BDT) *</label>
                <input
                  type="number"
                  required
                  min={minLimit}
                  max={wallet?.balance ?? 0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Min ৳${minLimit}`}
                  className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Payout Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-800 text-sm text-white rounded-xl px-3 py-2.5 border border-slate-700"
                >
                  <option value="bKash">bKash Personal / Agent</option>
                  <option value="Nagad">Nagad Personal / Agent</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Bank Transfer">Bank Wire Transfer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Account Number / Bank Details *</label>
                <input
                  type="text"
                  required
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder="e.g. 01712345678 (Personal) or Bank Account Info"
                  className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 bg-slate-800 text-slate-300 font-bold text-xs py-2.5 rounded-xl border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-emerald-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl hover:bg-emerald-400"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
