'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Loader2, Sparkles, ShieldCheck, CreditCard } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter Plan',
    slug: 'starter',
    price: 990,
    storeLimit: 1,
    productLimit: 100,
    features: ['1 Active Store', 'Up to 100 Products', '2 Staff Members', 'COD Checkout Engine'],
  },
  {
    name: 'Business Plan',
    slug: 'business',
    price: 2490,
    popular: true,
    storeLimit: 3,
    productLimit: 'Unlimited',
    features: ['3 Active Stores', 'Unlimited Products', '10 Staff Accounts', 'Visual Theme Customizer', 'Custom Domain Mapping'],
  },
  {
    name: 'Pro Enterprise',
    slug: 'pro',
    price: 4990,
    storeLimit: 10,
    productLimit: 'Unlimited',
    features: ['10 Active Stores', 'Unlimited Products & Staff', 'Profit Analytics & Reports', 'Premium Theme Access', 'Priority Support'],
  },
];

function BillingContent() {
  const searchParams = useSearchParams();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState('');

  const isSuccess = searchParams.get('success') === 'true';

  const handleSelectPlan = async (planSlug: string) => {
    setLoadingSlug(planSlug);
    setError('');

    try {
      const res = await fetch('/api/billing/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planSlug }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Payment initiation failed');
      }

      // Redirect to ZiniPay Payment Gateway URL
      window.location.href = data.paymentUrl;
    } catch (err: any) {
      setError(err.message || 'Payment failed to initialize');
      setLoadingSlug(null);
    }
  };

  return (
    <div className="space-y-8">
      {isSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" />
          <span>Payment verified server-side! Your subscription plan has been successfully activated.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card
            key={plan.slug}
            className={`bg-slate-900 border-slate-800 text-slate-100 flex flex-col justify-between relative shadow-xl ${
              plan.popular ? 'border-blue-500 ring-1 ring-blue-500' : ''
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Popular Choice
              </span>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-2 text-3xl font-extrabold text-white">
                ৳{plan.price} <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-300">
              {plan.features.map((feat, i) => (
                <div key={i} className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> {feat}
                </div>
              ))}
            </CardContent>
            <div className="p-6 pt-0">
              <Button
                onClick={() => handleSelectPlan(plan.slug)}
                disabled={loadingSlug === plan.slug}
                className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-800 hover:bg-slate-700'} text-white font-semibold`}
              >
                {loadingSlug === plan.slug ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CreditCard className="w-4 h-4 mr-1.5" />
                )}
                Pay with ZiniPay
              </Button>
            </div>
          </Card>
        ))}
      </div>
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
        <h1 className="text-3xl font-extrabold tracking-tight text-white">SaaS Subscriptions & Billing</h1>
        <p className="text-sm text-slate-400 mt-1">
          Powered by ZiniPay payment gateway abstraction. Manage your subscription plan and billing history.
        </p>
      </div>

      <Suspense fallback={<div className="text-slate-400 text-sm">Loading billing options...</div>}>
        <BillingContent />
      </Suspense>
    </div>
  );
}
