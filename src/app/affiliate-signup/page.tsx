'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  DollarSign, 
  Percent, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Wallet, 
  TrendingUp, 
  HelpCircle,
  Clock
} from 'lucide-react';

export default function AffiliateSignupPage() {
  const router = useRouter();
  const [payoutMethod, setPayoutMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [payoutNumber, setPayoutNumber] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [referredMerchantsCount, setReferredMerchantsCount] = useState(15);
  const [selectedPlanPrice, setSelectedPlanPrice] = useState(1099); // Pro plan
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estimator calculation: 15% of total subscription value recurring monthly
  const monthlyEarnings = Math.round(referredMerchantsCount * selectedPlanPrice * 0.15);
  const yearlyEarnings = monthlyEarnings * 12;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutNumber || payoutNumber.trim().length < 11) {
      setMessage({ type: 'error', text: 'দয়া করে সঠিক ১১ ডিজিটের বিকাশ অথবা নগদ নম্বর প্রদান করুন' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payoutMethod, payoutNumber, customCode }),
      });

      const data = await res.json();
      if (res.status === 401) {
        // Redirect to login with callback
        router.push('/login?redirect=/affiliate-signup');
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
      }

      setMessage({ type: 'success', text: data.message || 'অ্যাফিলিয়েট অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' });
      setTimeout(() => {
        router.push('/dashboard/affiliate');
      }, 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* Dynamic Header Badge */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 py-2.5 px-4 text-center text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 text-slate-950">
        <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
        <span>নাব্রিজান অফিশিয়াল ১৫% আজীবন রিকারিং কমিশন প্রোগ্রাম — বিকাশ ও নগদে সরাসরি পে-আউট!</span>
      </div>

      {/* Hero Section */}
      <header className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-amber-500/5 to-transparent blur-3xl" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Award className="w-4 h-4" /> Lifetime Recurring Affiliate Partner
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            প্রতিটি সফল মার্চেন্ট রেফারেন্সে <br className="hidden sm:inline" />
            পান <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">১৫% আজীবন প্যাসিভ ইনকাম!</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-10">
            আপনার রেফারেল লিংকে ক্লিক করে নতুন কোনো অনলাইন শপ মার্চেন্ট সাবস্ক্রিপশন নিলে, প্রতি মাসের পেমেন্ট থেকে আজীবন পাবেন ১৫% ফ্ল্যাট কমিশন। বিকাশ ও নগদে সর্বনিম্ম ৳৫০০ হলেই তুলে নিতে পারবেন।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#signup-form"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
            >
              এখনই বিনামূল্যে যোগ দিন <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold rounded-xl transition-all text-base"
            >
              প্যাকেজ ও প্রাইজ দেখুন
            </Link>
          </div>
        </div>
      </header>

      {/* Interactive Income Calculator */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-orange-400 font-bold text-sm uppercase tracking-wider">Passive Earnings Estimator</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">আপনার আনুমানিক মাসিক আয় হিসাব করুন</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex justify-between">
                  <span>রেফার করা অ্যাক্টিভ মার্চেন্ট সংখ্যা:</span>
                  <span className="text-orange-400 font-bold text-lg">{referredMerchantsCount} জন মার্চেন্ট</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={referredMerchantsCount}
                  onChange={(e) => setReferredMerchantsCount(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">মার্চেন্টদের পছন্দের সাবস্ক্রিপশন প্ল্যান:</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'স্টার্টার', price: 599 },
                    { name: 'প্রো (জনপ্রিয়)', price: 1099 },
                    { name: 'গ্রোথ', price: 2499 },
                  ].map((plan) => (
                    <button
                      key={plan.price}
                      type="button"
                      onClick={() => setSelectedPlanPrice(plan.price)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedPlanPrice === plan.price
                          ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-bold shadow-md'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs">{plan.name}</div>
                      <div className="text-sm font-extrabold mt-0.5">৳{plan.price}/মাস</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-1">
                <p>✓ প্রতি মাসে মার্চেন্টদের রিনিউ পেমেন্ট থেকে ১৫% রেকারিং অটোমেটিক যোগ হবে।</p>
                <p>✓ বিকাশ ও নগদ ওয়ালেটে ফ্ল্যাট পে-আউট দেওয়া হয়।</p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-slate-950 border border-orange-500/30 rounded-2xl p-6 text-center">
              <div className="text-xs uppercase tracking-widest font-bold text-orange-400 mb-1">আপনার আনুমানিক আয়</div>
              <div className="text-4xl sm:text-5xl font-black text-white my-3">
                ৳{monthlyEarnings.toLocaleString()} <span className="text-base font-medium text-slate-400">/মাস</span>
              </div>
              <div className="text-sm text-slate-300 mb-4">
                বছরে আনুমানিক: <span className="text-amber-400 font-bold">৳{yearlyEarnings.toLocaleString()} BDT</span>
              </div>
              <a
                href="#signup-form"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl block transition-all shadow-md text-sm"
              >
                এই আয় শুরু করুন
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Program Benefits Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-orange-400 font-bold text-sm uppercase tracking-wider">Why Join Nabrijan Affiliate</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">নাব্রিজান অ্যাফিলিয়েট প্রোগ্রামের বিশেষ সুবিধাসমূহ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Percent,
                title: '১৫% আজীবন রেকারিং কমিশন',
                desc: 'শুধুমাত্র একবার রেফার করবেন, আর মার্চেন্ট যতদিন নাব্রিজানে বিজনেস করবেন ততদিন প্রতি মাসের পেমেন্ট থেকে পান ১৫% রিকারিং ইনকাম।',
              },
              {
                icon: Wallet,
                title: 'বিকাশ ও নগদে সরাসরি পে-আউট',
                desc: 'কোনো জটিল ব্যাংক ট্রান্সফারের ঝামেলা নেই! সর্বনিম্ন ৳৫০০ ব্যালেন্স হলেই আপনার বিকাশ বা নগদ ওয়ালেটে ক্যাশ তুলে নিন।',
              },
              {
                icon: Clock,
                title: '৩০ দিনের কুকি ট্র্যাকিং',
                desc: 'আপনার লিংকে ক্লিক করার ৩০ দিনের মধ্যে ভিজিটর যেকোনো সময় অ্যাকাউন্ট খুললে সেটি সরাসরি আপনার রেফারে কাউন্ট হবে।',
              },
              {
                icon: TrendingUp,
                title: 'লাইভ রিয়েলটাইম ড্যাশবোর্ড',
                desc: 'কতটি ক্লিক আসলো, কতজন নতুন শপ খুলল এবং কত কমিশন জমা হলো — সবকিছু রিয়েলটাইমে পর্যবেক্ষণ করুন।',
              },
              {
                icon: ShieldCheck,
                title: 'স্বচ্ছ ও নিরাপদ পে-আউট সিস্টেম',
                desc: 'নাব্রিজান অ্যাডমিন টিমের মাধ্যমে সব পে-আউট সরাসরি ভেরিফাই ও দ্রুত ডিসপ্যাচ করা হয়।',
              },
              {
                icon: Zap,
                title: '১-ক্লিক সোশ্যাল শেয়ার লিংক',
                desc: 'আপনার ইউনিক রেফারেল লিংক খুব সহজেই ফেসবুক গ্রুপ, ওয়াটসঅ্যাপ, কিংবা ইউটিউবে শেয়ার করে আয় শুরু করুন।',
              },
            ].map((b, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl transition-all">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 mb-4 border border-orange-500/20">
                  <b.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="signup-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold uppercase mb-3">
                Instant Registration
              </div>
              <h2 className="text-2xl font-bold text-white">অ্যাফিলিয়েট পার্টনারশিপ শুরু করুন</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                আপনার বিকাশ বা নগদ ওয়ালেট নম্বরটি দিয়ে নিচে ১-ক্লিকে রেজিস্ট্রেশন সম্পন্ন করুন
              </p>
            </div>

            {message && (
              <div
                className={`p-4 rounded-xl mb-6 text-sm font-medium border ${
                  message.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  পেমেন্ট তুলে নেওয়ার ওয়ালেট মেথড:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bkash')}
                    className={`py-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 text-sm ${
                      payoutMethod === 'bkash'
                        ? 'border-pink-500 bg-pink-500/10 text-pink-400 shadow-md'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <span>bKash (বিকাশ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('nagad')}
                    className={`py-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 text-sm ${
                      payoutMethod === 'nagad'
                        ? 'border-orange-500 bg-orange-500/10 text-orange-400 shadow-md'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <span>Nagad (নগদ)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {payoutMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} পারসোনাল মোবাইল নম্বর:
                </label>
                <input
                  type="text"
                  required
                  placeholder="01XXXXXXXXX"
                  value={payoutNumber}
                  onChange={(e) => setPayoutNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  কাস্টম রেফারেল কোড (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  placeholder="যেমন: SHOPPING15 (খালি রাখলে অটো জেনারেট হবে)"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all text-base disabled:opacity-50"
              >
                {loading ? 'প্রসেসিং হচ্ছে...' : 'অ্যাফিলিয়েট পার্টনারশিপ শুরু করুন'}
              </button>

              <p className="text-center text-xs text-slate-500 mt-4">
                রেজিস্ট্রেশন সম্পূর্ণ করার মাধ্যমে আপনি আমাদের অ্যাফিলিয়েট নীতিমালা ও পে-আউট শর্তাবলীতে সম্মত হচ্ছেন।
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 Nabrijan SaaS Platform. All Rights Reserved. Contact: +8801625642420</p>
      </footer>
    </div>
  );
}
