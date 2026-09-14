'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, CheckCircle2, Minus, Sparkles } from 'lucide-react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | '6months' | 'yearly'>('monthly');

  const getPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return '0.00';
    if (billingCycle === '6months') {
      return Math.round(monthlyPrice * 0.9).toLocaleString() + '.00';
    }
    if (billingCycle === 'yearly') {
      return Math.round(monthlyPrice * 0.75).toLocaleString() + '.00';
    }
    return monthlyPrice.toLocaleString() + '.00';
  };

  return (
    <div className="min-h-screen bg-blue-50/50 text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/images/logo.png" alt="Nabrijan Logo" className="h-10 sm:h-12 w-auto object-contain" />
          </Link>
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-semibold text-xs sm:text-sm">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-full px-5">
                Create Your Store
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pb-24 pt-10 sm:pt-16">
        {/* Title Header */}
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-4">
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-blue-600">Pricing</p>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Choose The Plan To Grow Your Business
          </h1>
          <p className="text-gray-500 text-sm sm:text-lg max-w-xl mx-auto font-medium">
            No hidden fees. Flexible pricing. Try any plan free for 3 days.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="flex justify-center pt-6">
            <div className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-white/90 p-1.5 shadow-sm backdrop-blur">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('6months')}
                className={`flex items-center gap-1.5 rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                  billingCycle === '6months'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                6 Months
                <span className="hidden sm:inline rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide bg-blue-100 text-blue-700">
                  Save 10%
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`flex items-center gap-1.5 rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="hidden sm:inline rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide bg-blue-100 text-blue-700">
                  Save 25%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="container mx-auto px-4 pt-12 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-6">
            {/* Starter Card */}
            <div className="flex flex-col rounded-3xl p-7 bg-white text-gray-900 border border-gray-200 shadow-xl hover:-translate-y-1.5 transition-all duration-300 justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Starter</h3>
                <p className="text-xs text-gray-500 mt-1">For growing businesses.</p>

                <div className="mt-6">
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-semibold text-gray-400">৳</span>
                    <span className="text-4xl font-black text-gray-900 leading-none">{getPrice(599)}</span>
                    <span className="mb-1 text-xs text-gray-500 font-semibold">/ month</span>
                  </div>
                </div>

                <Link href="/register?plan=starter" className="mt-6 block">
                  <button className="w-full rounded-full py-3 text-sm font-bold transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md">
                    Get started →
                  </button>
                </Link>

                <div className="my-6 h-px w-full bg-gray-100" />

                <ul className="space-y-3 text-xs text-gray-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>500 products</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Unlimited preset themes</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Custom domain</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Nabrijan SecurePay</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>1 free third-party courier</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Report exports</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 rounded-2xl px-4 py-3 bg-blue-50/60 border border-blue-100">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Fees per order</p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <span className="flex items-baseline gap-1"><span className="font-bold text-blue-600">0%</span><span className="text-gray-500">physical</span></span>
                  <span className="flex items-baseline gap-1"><span className="font-bold text-blue-600">6%</span><span className="text-gray-500">digital</span></span>
                  <span className="flex items-baseline gap-1"><span className="font-bold text-blue-600">1.9%</span><span className="text-gray-500">resell</span></span>
                </div>
              </div>
            </div>

            {/* Pro Card (Most Popular) */}
            <div className="flex flex-col rounded-3xl p-7 bg-blue-600 text-white shadow-2xl relative md:-translate-y-3 ring-2 ring-blue-500 justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-4 py-1 text-[11px] font-black uppercase tracking-wider text-blue-600 shadow-md">
                Most Popular
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Pro</h3>
                <p className="text-xs text-blue-100 mt-1">For scaling businesses.</p>

                <div className="mt-6">
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-semibold text-blue-100">৳</span>
                    <span className="text-4xl font-black text-white leading-none">{getPrice(1099)}</span>
                    <span className="mb-1 text-xs text-blue-100 font-semibold">/ month</span>
                  </div>
                </div>

                <Link href="/register?plan=pro" className="mt-6 block">
                  <button className="w-full rounded-full py-3 text-sm font-bold transition-all duration-300 bg-white text-blue-600 hover:bg-blue-50 shadow-md">
                    Get started →
                  </button>
                </Link>

                <div className="my-6 h-px w-full bg-white/20" />

                <ul className="space-y-3 text-xs text-blue-50">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>2,000 products</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>Unlimited preset themes</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>Custom domain</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>Theme builder</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>Nabrijan SecurePay</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>Unlimited free third-party couriers</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 rounded-2xl px-4 py-3 bg-white/10 border border-white/20">
                <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100">Fees per order</p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <span className="flex items-baseline gap-1"><span className="font-bold text-white">0%</span><span className="text-blue-100">physical</span></span>
                  <span className="flex items-baseline gap-1"><span className="font-bold text-white">4%</span><span className="text-blue-100">digital</span></span>
                  <span className="flex items-baseline gap-1"><span className="font-bold text-white">1%</span><span className="text-blue-100">resell</span></span>
                </div>
              </div>
            </div>

            {/* Growth Card */}
            <div className="flex flex-col rounded-3xl p-7 bg-white text-gray-900 border border-gray-200 shadow-xl hover:-translate-y-1.5 transition-all duration-300 justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Growth</h3>
                <p className="text-xs text-gray-500 mt-1">Everything unlocked.</p>

                <div className="mt-6">
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-semibold text-gray-400">৳</span>
                    <span className="text-4xl font-black text-gray-900 leading-none">{getPrice(2499)}</span>
                    <span className="mb-1 text-xs text-gray-500 font-semibold">/ month</span>
                  </div>
                </div>

                <Link href="/register?plan=growth" className="mt-6 block">
                  <button className="w-full rounded-full py-3 text-sm font-bold transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md">
                    Get started →
                  </button>
                </Link>

                <div className="my-6 h-px w-full bg-gray-100" />

                <ul className="space-y-3 text-xs text-gray-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Unlimited products</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Unlimited preset themes</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Custom domain</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Theme builder</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Nabrijan SecurePay</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Unlimited free third-party couriers</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 rounded-2xl px-4 py-3 bg-blue-50/60 border border-blue-100">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Fees per order</p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <span className="flex items-baseline gap-1"><span className="font-bold text-blue-600">0%</span><span className="text-gray-500">physical</span></span>
                  <span className="flex items-baseline gap-1"><span className="font-bold text-blue-600">3%</span><span className="text-gray-500">digital</span></span>
                  <span className="flex items-baseline gap-1"><span className="font-bold text-blue-600">0.75%</span><span className="text-gray-500">resell</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="container mx-auto px-4 pt-20 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-2">Compare Plans</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Compare All Features</h2>
            <p className="mt-3 text-sm text-gray-500">Every feature and per-order fee, side by side — pick the plan that fits how you sell.</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold text-gray-900 w-2/5 text-sm">Features</th>
                  <th className="p-4 font-bold text-center text-gray-900">Starter (৳599)</th>
                  <th className="p-4 font-bold text-center text-blue-600 bg-blue-50">Pro (৳1,099)</th>
                  <th className="p-4 font-bold text-center text-gray-900">Growth (৳2,499)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-blue-50/30 font-bold text-blue-700">
                  <td colSpan={4} className="p-3 text-[11px] uppercase tracking-wider">Fees per order</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-700">Own physical products fee</td>
                  <td className="p-4 text-center font-bold text-gray-900">0%</td>
                  <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/50">0%</td>
                  <td className="p-4 text-center font-bold text-gray-900">0%</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-700">Own digital products fee</td>
                  <td className="p-4 text-center font-bold text-gray-900">6%</td>
                  <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/50">4%</td>
                  <td className="p-4 text-center font-bold text-gray-900">3%</td>
                </tr>

                <tr className="bg-blue-50/30 font-bold text-blue-700">
                  <td colSpan={4} className="p-3 text-[11px] uppercase tracking-wider">Store & Limits</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-700">Own product limit</td>
                  <td className="p-4 text-center font-bold text-gray-900">500</td>
                  <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/50">2,000</td>
                  <td className="p-4 text-center font-bold text-gray-900">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-700">Custom Domain (.com, .bd)</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-blue-600 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/50"><Check className="w-4 h-4 text-blue-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-blue-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-700">Drag & Drop Theme Builder</td>
                  <td className="p-4 text-center text-gray-400"><Minus className="w-4 h-4 mx-auto opacity-40" /></td>
                  <td className="p-4 text-center bg-blue-50/50"><Check className="w-4 h-4 text-blue-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-blue-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-700">Pathao & Steadfast Courier API</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-blue-600 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/50"><Check className="w-4 h-4 text-blue-600 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-blue-600 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
