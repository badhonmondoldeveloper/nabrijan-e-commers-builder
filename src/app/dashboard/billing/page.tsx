'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, Loader2, PhoneCall, ShieldCheck, Crown, Check, Copy, CheckCircle } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  slug: string;
  status: string;
}

interface Submission {
  id: string;
  storeId: string;
  amount: number | string;
  senderNumber: string;
  trxId: string;
  status: string;
  adminNotes?: string | null;
  createdAt: string;
}

const PLANS = [
  {
    slug: 'starter',
    name: 'Starter',
    monthlyPrice: 599,
    productLimit: '500 products',
    features: ['500 products limit', 'Free Nabrijan subdomain', 'Unlimited preset themes', 'Pathao & Steadfast courier', 'Report exports'],
  },
  {
    slug: 'pro',
    name: 'Pro',
    monthlyPrice: 1099,
    popular: true,
    productLimit: '2,000 products',
    features: ['2,000 products limit', 'Custom Domain (.com/.bd)', 'Visual Theme builder', '10 Staff Accounts', 'All Courier Integrations'],
  },
  {
    slug: 'growth',
    name: 'Growth',
    monthlyPrice: 2499,
    productLimit: 'Unlimited products',
    features: ['Unlimited products', 'Custom Domain (.com/.bd)', 'Visual Theme builder', '50 Staff Accounts', 'VIP Priority Support'],
  },
];

function BkashBillingContent() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<string>('starter');
  const [billingCycle, setBillingCycle] = useState<'monthly' | '6months' | 'yearly'>('monthly');

  const [bkashNumber, setBkashNumber] = useState<string>('01625642420');
  const [bkashType, setBkashType] = useState<string>('Personal');

  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storesRes, settingsRes] = await Promise.all([
          fetch('/api/stores').then((r) => r.json()),
          fetch('/api/admin/settings').then((r) => r.json()).catch(() => null),
        ]);

        if (storesRes.stores && storesRes.stores.length > 0) {
          setStores(storesRes.stores);
          setSelectedStoreId(storesRes.stores[0].id);
        }

        if (settingsRes?.settings) {
          if (settingsRes.settings.bkashNumber) setBkashNumber(settingsRes.settings.bkashNumber);
          if (settingsRes.settings.bkashType) setBkashType(settingsRes.settings.bkashType);
        }
      } catch (err) {
        console.error('Error loading billing data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedStoreId) return;

    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`/api/billing/manual-bkash?storeId=${selectedStoreId}`);
        const data = await res.json();
        if (data.submissions) {
          setSubmissions(data.submissions);
        }
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    };

    fetchSubmissions();
  }, [selectedStoreId]);

  const selectedPlan = PLANS.find((p) => p.slug === selectedPlanSlug) || PLANS[0];

  const getCalculatedPrice = (basePrice: number) => {
    if (basePrice === 0) return 0;
    if (billingCycle === '6months') return Math.round(basePrice * 0.9 * 6);
    if (billingCycle === 'yearly') return Math.round(basePrice * 0.75 * 12);
    return basePrice;
  };

  const currentPayableAmount = getCalculatedPrice(selectedPlan.monthlyPrice);

  const copyToClipboard = (num: string, label: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(label);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const handleSubmitTrx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStoreId || !senderNumber || !trxId) {
      setMessage({ type: 'error', text: 'Please select a store, enter your bKash/Nagad Mobile Number and Transaction ID (TrxID).' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/billing/manual-bkash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: selectedStoreId,
          planSlug: selectedPlanSlug,
          senderNumber,
          trxId,
          amount: currentPayableAmount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      setMessage({ type: 'success', text: data.message });
      setSenderNumber('');
      setTrxId('');

      if (data.submission) {
        setSubmissions((prev) => [data.submission, ...prev]);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error submitting transaction' });
    } finally {
      setLoading(false);
    }
  };

  const selectedStore = stores.find((s) => s.id === selectedStoreId);

  return (
    <div className="space-y-8 font-sans">
      {/* Plan Selection Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white">Select Subscription Plan</h2>
          <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${billingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('6months')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${billingCycle === '6months' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              6 Months (-10%)
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${billingCycle === 'yearly' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              Yearly (-25%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const price = plan.monthlyPrice === 0 ? 0 : billingCycle === '6months' ? Math.round(plan.monthlyPrice * 0.9) : billingCycle === 'yearly' ? Math.round(plan.monthlyPrice * 0.75) : plan.monthlyPrice;
            const isSelected = selectedPlanSlug === plan.slug;

            return (
              <Card
                key={plan.slug}
                onClick={() => setSelectedPlanSlug(plan.slug)}
                className={`cursor-pointer transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-slate-900 border-2 border-blue-500 shadow-xl ring-2 ring-blue-500/30'
                    : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-black uppercase shadow">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg font-bold text-white flex items-center justify-between">
                    {plan.name}
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                  </CardTitle>
                  <div className="text-2xl font-black text-white mt-1">
                    ৳{price.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ mo</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-2 text-xs text-slate-300">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Easy 1-Click Payment Guide & Trx Submission Form */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-pink-500" />
            Easy bKash / Nagad Payment ({selectedPlan.name} Plan - ৳{currentPayableAmount.toLocaleString()})
          </CardTitle>
          <CardDescription className="text-slate-400">
            Send ৳{currentPayableAmount.toLocaleString()} via bKash or Nagad Send Money for instant store activation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Copy Number Box */}
          <div className="p-5 bg-pink-950/20 border border-pink-500/30 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">Payment Receiver Numbers ({bkashType})</span>
              <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/40 text-xs">Send Money</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* bKash Number Box */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-pink-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">bKash (Personal)</div>
                  <div className="text-xl font-mono font-extrabold text-white mt-0.5">{bkashNumber}</div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => copyToClipboard(bkashNumber, 'bKash')}
                  className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-3 py-1.5 h-auto rounded-lg"
                >
                  {copiedNumber === 'bKash' ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" /> Copy Number
                    </>
                  )}
                </Button>
              </div>

              {/* Nagad Number Box */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-orange-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Nagad (Personal)</div>
                  <div className="text-xl font-mono font-extrabold text-white mt-0.5">{bkashNumber}</div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => copyToClipboard(bkashNumber, 'Nagad')}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-3 py-1.5 h-auto rounded-lg"
                >
                  {copiedNumber === 'Nagad' ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" /> Copy Number
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 3 Step Payment Guide */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="font-bold text-white text-sm">3 Easy Steps to Activate Your Store:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 font-medium">
                <li>Copy the number above & open your bKash / Nagad App.</li>
                <li>Select <strong>Send Money</strong> and send exactly <strong>৳{currentPayableAmount.toLocaleString()}</strong>.</li>
                <li>Enter your Sender Mobile Number & <strong>TrxID</strong> below, then click Submit.</li>
              </ol>
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-xl text-sm font-medium border ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submission Form */}
          <form onSubmit={handleSubmitTrx} className="space-y-4">
            {stores.length > 1 && (
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Select Store to Activate</Label>
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-700"
                >
                  {stores.map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                      {s.name} ({s.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedStore && (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Selected Store: <strong className="text-white">{selectedStore.name}</strong></span>
                <Badge className={selectedStore.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}>
                  {selectedStore.status === 'ACTIVE' ? 'LIVE / ACTIVE' : 'PENDING ACTIVATION'}
                </Badge>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Your bKash / Nagad Mobile Number</Label>
                <Input
                  type="text"
                  placeholder="017XXXXXXXX"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white font-mono placeholder:text-slate-600"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Transaction ID (TrxID)</Label>
                <Input
                  type="text"
                  placeholder="BKASH992810X"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-amber-400 font-mono font-bold uppercase placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold h-11 shadow-lg shadow-pink-600/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <ShieldCheck className="w-5 h-5 mr-2" />
              )}
              Submit TrxID for {selectedPlan.name} Plan Activation (৳{currentPayableAmount.toLocaleString()})
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Submissions History */}
      {submissions.length > 0 && (
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl overflow-hidden">
          <CardHeader className="bg-slate-900/80 border-b border-slate-800">
            <CardTitle className="text-lg font-bold text-white">Your Activation Submissions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Sender Number</th>
                    <th className="p-4">TrxID</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Submission Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-mono font-semibold text-white">{sub.senderNumber}</td>
                      <td className="p-4 font-mono text-amber-400 font-bold">{sub.trxId}</td>
                      <td className="p-4 font-bold text-white">৳{Number(sub.amount)}</td>
                      <td className="p-4">
                        <Badge
                          className={
                            sub.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : sub.status === 'REJECTED'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                          }
                        >
                          {sub.status === 'APPROVED'
                            ? 'APPROVED & LIVE'
                            : sub.status === 'REJECTED'
                            ? 'REJECTED'
                            : 'PENDING VERIFICATION'}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-400">{new Date(sub.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function MerchantBillingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 max-w-5xl mx-auto space-y-8 font-sans">
      <Link href="/dashboard" className="inline-flex items-center text-xs text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Store Activation & Billing</h1>
        <p className="text-sm text-slate-400 mt-1">
          Select your subscription plan (Starter ৳599, Pro ৳1,099, Growth ৳2,499) and submit TrxID for instant store activation.
        </p>
      </div>

      <Suspense fallback={<div className="text-slate-400 text-sm">Loading billing details...</div>}>
        <BkashBillingContent />
      </Suspense>
    </div>
  );
}
