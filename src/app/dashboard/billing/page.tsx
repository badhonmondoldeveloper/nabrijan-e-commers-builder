'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, Loader2, PhoneCall, ShieldCheck } from 'lucide-react';

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

function BkashBillingContent() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [bkashNumber, setBkashNumber] = useState<string>('01625642420');
  const [bkashType, setBkashType] = useState<string>('Personal');
  const [packagePrice, setPackagePrice] = useState<number>(500);

  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Fetch user's stores & platform settings
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
          if (settingsRes.settings.fullPackagePrice) setPackagePrice(Number(settingsRes.settings.fullPackagePrice));
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

  const handleSubmitTrx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStoreId || !senderNumber || !trxId) {
      setMessage({ type: 'error', text: 'Please select a store, enter your bKash Mobile Number and Transaction ID (TrxID).' });
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
          senderNumber,
          trxId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      setMessage({ type: 'success', text: data.message });
      setSenderNumber('');
      setTrxId('');

      // Refresh submissions
      if (data.submission) {
        setSubmissions((prev) => [data.submission, ...prev]);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error submitting bKash transaction' });
    } finally {
      setLoading(false);
    }
  };

  const selectedStore = stores.find((s) => s.id === selectedStoreId);

  return (
    <div className="space-y-8 font-sans">
      {/* Plan Features Card */}
      <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-slate-800 text-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 mb-2 font-semibold">
                Single Subscription Plan
              </Badge>
              <CardTitle className="text-2xl font-extrabold text-white">Full Package Plan</CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                Everything you need to launch and scale your e-commerce store with zero limits.
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-emerald-400">৳{packagePrice}</span>
              <span className="text-xs text-slate-400 block font-normal">/ month</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
          <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" /> Full Store Setup & Custom Domain</div>
          <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" /> Unlimited Products & Inventory</div>
          <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" /> Visual Drag & Drop Theme Customizer</div>
          <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" /> Steadfast & Pathao Courier API Integration</div>
        </CardContent>
      </Card>

      {/* Manual bKash Payment Form */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-pink-500" />
            Manual bKash Payment Submission
          </CardTitle>
          <CardDescription className="text-slate-400">
            Send ৳{packagePrice} via bKash Send Money to make your store LIVE.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* bKash Receiver Instructions Box */}
          <div className="p-5 bg-pink-950/20 border border-pink-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">bKash Receiver Number ({bkashType})</span>
              <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/40 text-xs">bKash Send Money</Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-mono font-extrabold text-white tracking-widest bg-slate-950 px-4 py-2 rounded-lg border border-pink-500/30">
                {bkashNumber}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Instructions:</strong> Open your bKash App or dial *247# → Select <strong>Send Money</strong> → Enter Receiver Number <strong>{bkashNumber}</strong> → Enter Amount <strong>৳{packagePrice}</strong> → Confirm Payment and copy the <strong>Transaction ID (TrxID)</strong>.
            </p>
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
                <Label className="text-xs text-slate-300">Your bKash Mobile Number</Label>
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
                <Label className="text-xs text-slate-300">bKash Transaction ID (TrxID)</Label>
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
              Submit TrxID for Store Activation
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Submissions History */}
      {submissions.length > 0 && (
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl overflow-hidden">
          <CardHeader className="bg-slate-900/80 border-b border-slate-800">
            <CardTitle className="text-lg font-bold text-white">Your bKash Activation Submissions</CardTitle>
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 max-w-4xl mx-auto space-y-8 font-sans">
      <Link href="/dashboard" className="inline-flex items-center text-xs text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Store Activation & bKash Billing</h1>
        <p className="text-sm text-slate-400 mt-1">
          Activate your store live with our single ৳500/month Full Package Plan via manual bKash verification.
        </p>
      </div>

      <Suspense fallback={<div className="text-slate-400 text-sm">Loading billing details...</div>}>
        <BkashBillingContent />
      </Suspense>
    </div>
  );
}
