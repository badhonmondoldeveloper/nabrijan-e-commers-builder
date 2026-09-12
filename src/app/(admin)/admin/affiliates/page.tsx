'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  Wallet, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  Search,
  Check,
  X
} from 'lucide-react';

interface AffiliateItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  code: string;
  status: string;
  payoutMethod: string;
  payoutNumber: string;
  totalClicks: number;
  totalEarnings: number;
  availableBalance: number;
  paidOutAmount: number;
  referralCount: number;
  createdAt: string;
}

interface PayoutItem {
  id: string;
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
  code: string;
  amount: number;
  paymentMethod: string;
  accountNumber: string;
  status: string;
  adminNote?: string;
  transactionId?: string;
  processedAt?: string;
  createdAt: string;
}

export default function AdminAffiliatesControlPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>([]);
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [activeTab, setActiveTab] = useState<'payouts' | 'roster'>('payouts');
  const [searchQuery, setSearchQuery] = useState('');

  // Approve payout modal state
  const [selectedPayout, setSelectedPayout] = useState<PayoutItem | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [affRes, payRes] = await Promise.all([
        fetch('/api/admin/affiliates'),
        fetch('/api/admin/affiliates/payouts'),
      ]);

      const affData = await affRes.json();
      const payData = await payRes.json();

      if (affRes.ok) {
        setMetrics(affData.metrics);
        setAffiliates(affData.affiliates || []);
      }
      if (payRes.ok) {
        setPayouts(payData.payouts || []);
      }
    } catch (err) {
      console.error('Error loading admin affiliate data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprovePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout || !transactionId || transactionId.trim().length === 0) {
      setActionMessage({ type: 'error', text: 'bKash/Nagad Transaction ID is required' });
      return;
    }

    setProcessing(true);
    setActionMessage(null);

    try {
      const res = await fetch('/api/admin/affiliates/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payoutId: selectedPayout.id,
          action: 'APPROVE',
          transactionId: transactionId.trim(),
          adminNote: adminNote.trim() || 'Paid via MFS',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setActionMessage({ type: 'success', text: data.message });
      setTimeout(() => {
        setSelectedPayout(null);
        setTransactionId('');
        setAdminNote('');
        setActionMessage(null);
        fetchData();
      }, 1500);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectPayout = async (payoutId: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই উইথড্রয়াল রিকোয়েস্টটি বাতিল করবেন? ফান্ডগুলো আবার অ্যাফিলিয়েট ব্যালেন্সে ফেরত যাবে।')) return;

    try {
      const res = await fetch('/api/admin/affiliates/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payoutId,
          action: 'REJECT',
          adminNote: 'Rejected by Super Admin',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert(data.message);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'বাতিলকরণ ব্যর্থ হয়েছে');
    }
  };

  const handleToggleStatus = async (affiliateId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ affiliateId, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে');
    }
  };

  const filteredAffiliates = affiliates.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingPayouts = payouts.filter((p) => p.status === 'PENDING');

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin text-orange-500" />
          <span>অ্যাফিলিয়েট কন্ট্রোল সেন্টার লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs font-bold uppercase mb-2">
            <ShieldCheck className="w-4 h-4" /> Super Admin Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">১৫% অ্যাফিলিয়েট কন্ট্রোল সেন্টার</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            সমগ্র প্ল্যাটফর্মের অ্যাফিলিয়েট মেম্বার ও বিকাশ/নগদ পে-আউট রিকোয়েস্ট ম্যানেজ করুন
          </p>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> ডাটা রিফ্রেশ
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>মোট অ্যাফিলিয়েট সংখ্যা</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{metrics?.totalAffiliates || 0} জন</div>
          <div className="text-xs text-slate-500 mt-1">সক্রিয় রিকারিং পার্টনার</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>মোট জেনারেটেড কমিশন</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-400 mt-2">
            ৳{(metrics?.totalEarningsAll || 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">১৫% রেকারিং শেয়ারের পরিমাণ</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>মোট পরিশোধিত (Paid Out)</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">
            ৳{(metrics?.totalPaidOutAll || 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">বিকাশ ও নগদে প্রেরিত সর্বমোট</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>পেন্ডিং উইথড্র রিকোয়েস্ট</span>
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">
            {pendingPayouts.length} টি
          </div>
          <div className="text-xs text-amber-400/80 font-medium mt-1">
            মোট বকেয়া: ৳{(metrics?.totalPendingBalance || 0).toLocaleString()} BDT
          </div>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div className="flex gap-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('payouts')}
              className={`pb-2 border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'payouts'
                  ? 'border-orange-500 text-orange-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>পেন্ডিং পে-আউট কিউ ({pendingPayouts.length})</span>
              {pendingPayouts.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === 'roster'
                  ? 'border-orange-500 text-orange-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              সকল অ্যাফিলিয়েট মেম্বার তালিকা ({affiliates.length})
            </button>
          </div>

          {activeTab === 'roster' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="নাম বা কোড সার্চ করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Payout Queue */}
        {activeTab === 'payouts' && (
          <div className="overflow-x-auto">
            {payouts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                কোনো পে-আউট রিকোয়েস্ট পাওয়া যায়নি।
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">অ্যাফিলিয়েট নাম & ইমেইল</th>
                    <th className="py-3.5 px-4 font-semibold">পরিমাণ (৳)</th>
                    <th className="py-3.5 px-4 font-semibold">মেথড & নম্বর</th>
                    <th className="py-3.5 px-4 font-semibold">স্ট্যাটাস</th>
                    <th className="py-3.5 px-4 font-semibold">Txn ID / নোট</th>
                    <th className="py-3.5 px-4 font-semibold text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {payouts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-950/40 transition-all">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{p.affiliateName}</div>
                        <div className="text-xs text-slate-400">{p.affiliateEmail} ({p.code})</div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-400 text-base">
                        ৳{p.amount} BDT
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="uppercase font-bold text-orange-400 text-xs">{p.paymentMethod}</div>
                        <div className="font-mono text-xs text-slate-200">{p.accountNumber}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {p.status === 'PENDING' && (
                          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold animate-pulse">
                            পেন্ডিং ভেরিফিকেশন
                          </span>
                        )}
                        {p.status === 'APPROVED' && (
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
                            পরিশোধিত (Paid)
                          </span>
                        )}
                        {p.status === 'REJECTED' && (
                          <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold">
                            বাতিল (Refunded)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                        {p.transactionId ? (
                          <div className="text-emerald-400 font-bold">Txn: {p.transactionId}</div>
                        ) : (
                          p.adminNote || '—'
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {p.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedPayout(p);
                                setTransactionId('');
                                setAdminNote('');
                              }}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-md"
                            >
                              <Check className="w-3.5 h-3.5" /> অ্যাপ্রুভ করুন
                            </button>
                            <button
                              onClick={() => handleRejectPayout(p.id)}
                              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-bold rounded-lg text-xs"
                            >
                              <X className="w-3.5 h-3.5" /> রিজেক্ট
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">সম্পন্ন হয়েছে</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: All Affiliates Roster */}
        {activeTab === 'roster' && (
          <div className="overflow-x-auto">
            {filteredAffiliates.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                কোনো অ্যাফিলিয়েট মেম্বার পাওয়া যায়নি।
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">মেম্বার নাম & কোড</th>
                    <th className="py-3.5 px-4 font-semibold">ক্লিক / রেফারেন্স</th>
                    <th className="py-3.5 px-4 font-semibold">মোট ইনকাম (৳)</th>
                    <th className="py-3.5 px-4 font-semibold">ব্যালেন্স (৳)</th>
                    <th className="py-3.5 px-4 font-semibold">পে-আউট নম্বর</th>
                    <th className="py-3.5 px-4 font-semibold text-right">স্ট্যাটাস & অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredAffiliates.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-950/40 transition-all">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{a.name}</div>
                        <div className="text-xs text-orange-400 font-mono">কোড: {a.code}</div>
                        <div className="text-xs text-slate-500">{a.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <div>ক্লিক: <span className="font-bold text-white">{a.totalClicks}</span></div>
                        <div>রেফারেন্স: <span className="font-bold text-emerald-400">{a.referralCount} জন</span></div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-purple-400">
                        ৳{a.totalEarnings}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">
                        ৳{a.availableBalance}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="uppercase text-orange-400 font-bold">{a.payoutMethod}: </span>
                        <span className="font-mono">{a.payoutNumber}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(a.id, a.status)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                            a.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30'
                          }`}
                        >
                          {a.status === 'ACTIVE' ? 'সক্রিয় (Active)' : 'সাসপেন্ডেড (Suspended)'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Approve Payout Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-1">পে-আউট পেমেন্ট ভেরিফিকেশন ও অ্যাপ্রুভাল</h3>
            <p className="text-xs text-slate-400 mb-4">
              গ্রাহক: <span className="text-white font-bold">{selectedPayout.affiliateName}</span> (
              <span className="uppercase text-orange-400 font-bold">{selectedPayout.paymentMethod}</span>: {selectedPayout.accountNumber})
            </p>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl mb-6">
              <div className="text-xs text-emerald-400 uppercase font-semibold">প্রদানের পরিমাণ</div>
              <div className="text-3xl font-black text-emerald-400 mt-1">৳{selectedPayout.amount} BDT</div>
            </div>

            {actionMessage && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium border ${
                  actionMessage.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {actionMessage.text}
              </div>
            )}

            <form onSubmit={handleApprovePayout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  {selectedPayout.paymentMethod.toUpperCase()} ট্রানজেকশন আইডি (Txn ID):
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: B7K9X0P1L2"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">অ্যাডমিন নোট (ঐচ্ছিক):</label>
                <input
                  type="text"
                  placeholder="যেমন: bKash Merchant Cashout Sent"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayout(null)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm"
                >
                  ক্যান্সেল
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm disabled:opacity-50"
                >
                  {processing ? 'অ্যাপ্রুভ হচ্ছে...' : 'অ্যাপ্রুভ & পেড করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
