'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  DollarSign, 
  Percent, 
  Copy, 
  Check, 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface MetricState {
  totalClicks: number;
  totalReferrals: number;
  activePaidReferrals: number;
  totalEarnings: number;
  availableBalance: number;
  paidOutAmount: number;
}

interface ReferralItem {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  isPaid: boolean;
}

interface EarningItem {
  id: string;
  subscriptionAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: string;
  description: string;
  createdAt: string;
}

interface PayoutItem {
  id: string;
  amount: number;
  paymentMethod: string;
  accountNumber: string;
  status: string;
  adminNote?: string;
  transactionId?: string;
  processedAt?: string;
  createdAt: string;
}

export default function MerchantAffiliateDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [metrics, setMetrics] = useState<MetricState | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [earnings, setEarnings] = useState<EarningItem[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<PayoutItem[]>([]);
  
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'referrals' | 'earnings' | 'payouts'>('referrals');

  // Withdrawal modal state
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [payoutNumber, setPayoutNumber] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('500');
  const [submittingPayout, setSubmittingPayout] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Opt-in onboarding state
  const [optInMethod, setOptInMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [optInNumber, setOptInNumber] = useState('');
  const [optInLoading, setOptInLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/affiliate/stats');
      const data = await res.json();
      if (res.ok && data.isAffiliate) {
        setIsAffiliate(true);
        setProfile(data.profile);
        setReferralLink(data.referralLink);
        setMetrics(data.metrics);
        setReferrals(data.referrals || []);
        setEarnings(data.earnings || []);
        setPayoutRequests(data.payoutRequests || []);
        setPayoutNumber(data.profile.payoutNumber || '');
      } else {
        setIsAffiliate(false);
      }
    } catch (error) {
      console.error('Error loading affiliate stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!optInNumber || optInNumber.trim().length < 11) {
      alert('দয়া করে সঠিক ১১ ডিজিটের বিকাশ অথবা নগদ নম্বর লিখুন');
      return;
    }

    setOptInLoading(true);
    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payoutMethod: optInMethod, payoutNumber: optInNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await fetchStats();
    } catch (err: any) {
      alert(err.message || 'অ্যাফিলিয়েট অ্যাকাউন্ট রেজিস্ট্রেশন ব্যর্থ হয়েছে');
    } finally {
      setOptInLoading(false);
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(payoutAmount);
    if (amountNum < 500) {
      setPayoutMessage({ type: 'error', text: 'সর্বনিম্ন পে-আউট রিকোয়েস্ট অ্যামাউন্ট ৳৫০০ BDT' });
      return;
    }

    setSubmittingPayout(true);
    setPayoutMessage(null);

    try {
      const res = await fetch('/api/affiliate/payout-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountNum,
          paymentMethod: payoutMethod,
          accountNumber: payoutNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setPayoutMessage({ type: 'success', text: data.message });
      setTimeout(() => {
        setShowPayoutModal(false);
        setPayoutMessage(null);
        fetchStats();
      }, 1500);
    } catch (err: any) {
      setPayoutMessage({ type: 'error', text: err.message });
    } finally {
      setSubmittingPayout(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin text-orange-500" />
          <span>অ্যাফিলিয়েট ড্যাশবোর্ড লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  // If user is not yet registered as an affiliate
  if (!isAffiliate) {
    return (
      <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 rounded-3xl p-8 text-slate-950 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/20 text-slate-950 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" /> Nabrijan Partner Program
            </div>
            <h1 className="text-3xl font-black mb-3 leading-tight">
              ১৫% আজীবন প্যাসিভ ইনকাম পেতে আমাদের অ্যাফিলিয়েট প্রোগ্রামে যোগ দিন!
            </h1>
            <p className="text-sm font-medium opacity-90 leading-relaxed mb-6">
              আপনার রেফারেল লিংকের মাধ্যমে অন্য যেকোনো মার্চেন্ট নাব্রিজানে অনলাইন শপ খুললে, তার প্রতি মাসের সাবস্ক্রিপশন ফি থেকে আপনি পাবেন ১৫% ফ্ল্যাট কমিশন। বিকাশ ও নগদে সরাসরি পে-আউট!
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-2 text-center">বিনামূল্যে অ্যাফিলিয়েট অ্যাকাউন্ট সচল করুন</h2>
          <p className="text-xs text-slate-400 text-center mb-6">
            কমিশন ক্যাশ তুলে নেওয়ার জন্য আপনার বিকাশ অথবা নগদ নম্বরটি লিখুন
          </p>

          <form onSubmit={handleOptIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">পে-আউট মেথড চয়ন করুন:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOptInMethod('bkash')}
                  className={`py-2.5 rounded-xl font-bold border text-sm transition-all ${
                    optInMethod === 'bkash'
                      ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  bKash (বিকাশ)
                </button>
                <button
                  type="button"
                  onClick={() => setOptInMethod('nagad')}
                  className={`py-2.5 rounded-xl font-bold border text-sm transition-all ${
                    optInMethod === 'nagad'
                      ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  Nagad (নগদ)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                {optInMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} পারসোনাল মোবাইল নম্বর:
              </label>
              <input
                type="text"
                required
                placeholder="01XXXXXXXXX"
                value={optInNumber}
                onChange={(e) => setOptInNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={optInLoading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
            >
              {optInLoading ? 'সচল করা হচ্ছে...' : '১-ক্লিকে অ্যাফিলিয়েট সচল করুন'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Active Affiliate Dashboard View
  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner & Referral Link Copy Tool */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-full text-xs font-bold uppercase mb-2">
              <Percent className="w-3.5 h-3.5" /> 15% Lifetime Recurring Affiliate
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">আপনার অ্যাফিলিয়েট ড্যাশবোর্ড</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              ইউনিক লিংক শেয়ার করুন এবং প্রতি রিকারিং সাবস্ক্রিপশনে ১৫% কমিশন আয় করুন
            </p>
          </div>

          <button
            onClick={() => setShowPayoutModal(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 text-sm"
          >
            <Wallet className="w-4 h-4" /> টাকা তুলুন (Withdraw)
          </button>
        </div>

        {/* Link Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            আপনার ইউনিক রেফারেল লিংক (গ্লোবাল ট্র্যাকিং):
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-orange-400 font-mono overflow-x-auto select-all">
              {referralLink}
            </div>
            <button
              onClick={handleCopy}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-orange-500 hover:bg-orange-600 text-slate-950 shadow-md'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> কপি হয়েছে!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> লিংক কপি করুন
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>মোট ক্লিক সংখ্যা</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{metrics?.totalClicks || 0}</div>
          <div className="text-xs text-slate-500 mt-1">৩০ দিনের ট্র্যাকিং কুকি সক্রিয়</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>মোট রেফারেন্স মার্চেন্ট</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{metrics?.totalReferrals || 0} জন</div>
          <div className="text-xs text-emerald-400 font-medium mt-1">
            {metrics?.activePaidReferrals || 0} জন পেড সাবস্ক্রাইবার
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>উত্তোলনযোগ্য ব্যালেন্স</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">
            ৳{(metrics?.availableBalance || 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">সর্বনিম্ন পে-আউট ৳৫০০ BDT</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>সর্বমোট অর্জিত কমিশন</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">
            ৳{(metrics?.totalEarnings || 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            উত্তোলিত: ৳{(metrics?.paidOutAmount || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex border-b border-slate-800 pb-4 gap-6 text-sm font-semibold mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('referrals')}
            className={`pb-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'referrals'
                ? 'border-orange-500 text-orange-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            রেফার করা মার্চেন্ট তালিকা ({referrals.length})
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`pb-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'earnings'
                ? 'border-orange-500 text-orange-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ১৫% কমিশন আয় ইতিহাস ({earnings.length})
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`pb-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'payouts'
                ? 'border-orange-500 text-orange-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            পে-আউট উইথড্র রিকোয়েস্ট ({payoutRequests.length})
          </button>
        </div>

        {/* Tab 1: Referrals Table */}
        {activeTab === 'referrals' && (
          <div className="overflow-x-auto">
            {referrals.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                এখনো কোনো মার্চেন্ট রেফার করা হয়নি। আপনার লিংক শেয়ার করুন!
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">মার্চেন্টের নাম</th>
                    <th className="py-3.5 px-4 font-semibold">ইমেইল</th>
                    <th className="py-3.5 px-4 font-semibold">রেজিস্ট্রেশন তারিখ</th>
                    <th className="py-3.5 px-4 font-semibold text-right">সাবস্ক্রিপশন স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {referrals.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-950/40 transition-all">
                      <td className="py-3.5 px-4 font-bold text-white">{item.name}</td>
                      <td className="py-3.5 px-4 text-slate-400">{item.email}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {new Date(item.registeredAt).toLocaleDateString('bn-BD')}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {item.isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3" /> পেড মার্চেন্ট (১৫% অ্যাক্টিভ)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 text-slate-400 rounded-full text-xs font-semibold">
                            ট্রায়াল / ফ্রী
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Earnings History */}
        {activeTab === 'earnings' && (
          <div className="overflow-x-auto">
            {earnings.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                এখনো কোনো কমিশন জমা হয়নি। রেফার করা মার্চেন্ট সাবস্ক্রিপশন নিলেই ১৫% কমিশন পেয়ে যাবেন!
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">বিবরণ</th>
                    <th className="py-3.5 px-4 font-semibold">সাবস্ক্রিপশন অ্যামাউন্ট</th>
                    <th className="py-3.5 px-4 font-semibold">কমিশন রেট</th>
                    <th className="py-3.5 px-4 font-semibold">অর্জিত কমিশন (৳)</th>
                    <th className="py-3.5 px-4 font-semibold text-right">তারিখ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {earnings.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-950/40 transition-all">
                      <td className="py-3.5 px-4 font-medium text-white">{e.description || '১৫% রিকারিং কমিশন'}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">৳{e.subscriptionAmount}</td>
                      <td className="py-3.5 px-4 font-bold text-orange-400">{e.commissionRate}%</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-400">৳{e.commissionAmount}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-400 text-right">
                        {new Date(e.createdAt).toLocaleString('bn-BD')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 3: Payout Requests History */}
        {activeTab === 'payouts' && (
          <div className="overflow-x-auto">
            {payoutRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                এখনো কোনো পে-আউট রিকোয়েস্ট জমা দেওয়া হয়নি।
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">অ্যামাউন্ট (৳)</th>
                    <th className="py-3.5 px-4 font-semibold">মেথড</th>
                    <th className="py-3.5 px-4 font-semibold">নম্বর</th>
                    <th className="py-3.5 px-4 font-semibold">স্ট্যাটাস</th>
                    <th className="py-3.5 px-4 font-semibold">বিকাশ/নগদ Txn ID</th>
                    <th className="py-3.5 px-4 font-semibold text-right">রিকোয়েস্ট তারিখ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {payoutRequests.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-950/40 transition-all">
                      <td className="py-3.5 px-4 font-extrabold text-white">৳{p.amount}</td>
                      <td className="py-3.5 px-4 uppercase font-bold text-orange-400">{p.paymentMethod}</td>
                      <td className="py-3.5 px-4 font-mono">{p.accountNumber}</td>
                      <td className="py-3.5 px-4">
                        {p.status === 'APPROVED' && (
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
                            পরিশোধিত (Paid)
                          </span>
                        )}
                        {p.status === 'PENDING' && (
                          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold animate-pulse">
                            পেন্ডিং ভেরিফিকেশন
                          </span>
                        )}
                        {p.status === 'REJECTED' && (
                          <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold">
                            বাতিল (Refunded)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                        {p.transactionId || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400 text-right">
                        {new Date(p.createdAt).toLocaleDateString('bn-BD')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-2">কমিশন পে-আউট ক্যাশ আউট করুন</h3>
            <p className="text-xs text-slate-400 mb-6">
              উত্তোলনযোগ্য ব্যালেন্স: <span className="text-emerald-400 font-bold">৳{metrics?.availableBalance} BDT</span>
            </p>

            {payoutMessage && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium border ${
                  payoutMessage.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {payoutMessage.text}
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">মেথড সিলেক্ট করুন:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bkash')}
                    className={`py-2.5 rounded-xl font-bold border text-sm transition-all ${
                      payoutMethod === 'bkash'
                        ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    bKash (বিকাশ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('nagad')}
                    className={`py-2.5 rounded-xl font-bold border text-sm transition-all ${
                      payoutMethod === 'nagad'
                        ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    Nagad (নগদ)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  {payoutMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} মোবাইল নম্বর:
                </label>
                <input
                  type="text"
                  required
                  placeholder="01XXXXXXXXX"
                  value={payoutNumber}
                  onChange={(e) => setPayoutNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">উইথড্রয়াল পরিমাণ (সর্বনিম্ন ৳৫০০):</label>
                <input
                  type="number"
                  min="500"
                  max={metrics?.availableBalance || 500}
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm"
                >
                  ক্যান্সেল
                </button>
                <button
                  type="submit"
                  disabled={submittingPayout}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm disabled:opacity-50"
                >
                  {submittingPayout ? 'রিকোয়েস্ট হচ্ছে...' : 'সাবমিট করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
