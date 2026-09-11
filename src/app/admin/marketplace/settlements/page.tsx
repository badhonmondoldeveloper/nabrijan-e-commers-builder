'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, CheckCircle2, XCircle, Clock, Loader2, RefreshCw } from 'lucide-react';

export default function AdminMarketplaceSettlementsPage() {
  const [settlements, setSettlements] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<any>(null);
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/marketplace/settlements?status=${filter}`);
      const data = await res.json();
      if (data.settlements) {
        setSettlements(data.settlements);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, [filter]);

  const handleProcess = async (action: 'APPROVE' | 'REJECT') => {
    if (!activeModal) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/marketplace/settlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settlementId: activeModal.id,
          action,
          transactionId,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Settlement update failed');

      setActiveModal(null);
      setTransactionId('');
      setNotes('');
      fetchSettlements();
    } catch (err: any) {
      alert(err.message || 'Error processing settlement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Wallet className="w-7 h-7 text-amber-400" /> Seller Settlement Payout Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review and execute merchant payout requests via bKash, Nagad, or Bank Wire.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'PENDING', 'PAID', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                filter === st
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
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
            <Loader2 className="w-5 h-5 animate-spin text-amber-400" /> Loading payout queue...
          </div>
        ) : settlements.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">
            No settlement requests found for status: {filter}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-4">Merchant Store</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-6">Account Details</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {settlements.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 text-slate-400 font-mono">
                      {new Date(s.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-4 px-4 font-bold text-white">
                      {s.wallet.store.name}
                    </td>
                    <td className="py-4 px-4 font-black text-amber-400 text-sm">
                      ৳{s.amount}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-300">
                      {s.paymentMethod}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">
                      {s.accountDetails}
                    </td>
                    <td className="py-4 px-4">
                      {s.status === 'PAID' ? (
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          PAID
                        </span>
                      ) : s.status === 'REJECTED' ? (
                        <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                          REJECTED
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {s.status === 'PENDING' && (
                        <button
                          onClick={() => setActiveModal(s)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-md"
                        >
                          Process Payout
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

      {/* Process Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Process Merchant Payout</h3>
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div>Store: <span className="font-bold text-white">{activeModal.wallet.store.name}</span></div>
              <div>Amount: <span className="font-bold text-amber-400">৳{activeModal.amount}</span></div>
              <div>Method: <span className="font-bold text-slate-200">{activeModal.paymentMethod}</span></div>
              <div>Account: <span className="font-mono text-emerald-400">{activeModal.accountDetails}</span></div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Transaction ID / Reference Number</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. BKASH-9988210"
                  className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Admin Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional comments for seller..."
                  className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => handleProcess('REJECT')}
                  disabled={submitting}
                  className="flex-1 bg-rose-500/20 text-rose-300 font-bold text-xs py-3 rounded-xl border border-rose-500/30"
                >
                  Reject & Refund
                </button>
                <button
                  type="button"
                  onClick={() => handleProcess('APPROVE')}
                  disabled={submitting}
                  className="flex-1 bg-emerald-500 text-slate-950 font-bold text-xs py-3 rounded-xl hover:bg-emerald-400"
                >
                  Approve & Mark Paid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
