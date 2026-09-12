import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Palette,
  BarChart3,
  Globe,
  ArrowRight,
  CheckCircle2,
  Store,
  MessageCircle,
  Truck,
  Sparkles,
  ChevronRight,
  Headphones,
  Check,
  HelpCircle,
  Lock,
  Smartphone,
  Layers,
  Star,
  CheckCircle
} from 'lucide-react';
import { db } from '@/lib/db/prisma';

export const revalidate = 60; // Refresh dynamic platform settings every 60 seconds

export default async function SaaSMarketingPage() {
  // Fetch dynamic platform settings if available
  let settings = null;
  try {
    settings = await db.platformSettings.findUnique({ where: { id: 'default' } });
  } catch (e) {
    // Fallback if table not ready
  }

  const siteName = settings?.siteName || 'Nabrijan E-Commerce';
  const bannerText = settings?.bannerText || '🔥 ৩ দিনের সম্পূর্ণ ফ্রি ট্রায়াল সুবিধা পেতে আজই রেজিস্ট্রেশন করুন!';
  const trialDays = settings?.trialDays || 3;
  const whatsappNumber = settings?.whatsappNumber || '01700000000';
  const contactPhone = settings?.contactPhone || '01700000000';
  const contactEmail = settings?.contactEmail || 'badhonmondoldeveloper@gmail.com';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden max-w-full">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white text-xs font-bold py-2.5 px-4 text-center tracking-wide shadow-lg flex items-center justify-center space-x-2">
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse hidden sm:inline" />
        <span>{bannerText}</span>
        <Link href="/register" className="ml-2 underline font-extrabold text-amber-300 hover:text-white transition inline-flex items-center">
          এখনি অ্যাকাউন্ট খুলুন <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>

      {/* Glassmorphic Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/80 border-b border-slate-800/80 transition-all duration-300">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-rose-500 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
              N
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white leading-none">
                {siteName}
              </span>
              <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest mt-1">
                Multi-Tenant SaaS
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Link href="#features" className="hover:text-white hover:scale-105 transition duration-200">ফিচারসমূহ</Link>
            <Link href="#demo" className="hover:text-white hover:scale-105 transition duration-200">লাইভ ডেমো</Link>
            <Link href="#pricing" className="hover:text-white hover:scale-105 transition duration-200">সাবস্ক্রিপশন</Link>
            <Link href="#faq" className="hover:text-white hover:scale-105 transition duration-200">FAQ</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-bold px-4 py-2 rounded-xl">
                লগইন
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-black shadow-xl shadow-blue-600/30 rounded-xl px-5 py-2.5 transition duration-300">
                {trialDays}-দিন ফ্রি ট্রায়াল <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with 3D Glass Atmosphere */}
      <section className="relative pt-24 pb-28 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950">
        {/* Glow Orbs */}
        <div className="glow-orb-blue -top-20 -left-20" />
        <div className="glow-orb-purple top-40 -right-20" />
        <div className="glow-orb-emerald bottom-10 left-1/3" />

        <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
          <Badge variant="outline" className="mb-6 border-blue-500/40 text-blue-400 bg-blue-500/10 px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-inner inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 animate-spin" /> Bangladesh's #1 E-Commerce SaaS Engine
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.12] text-white">
            আপনার ই-কমার্স বিজনেস চালু করুন <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              মাত্র ৩ মিনিটে
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 mb-10 max-w-3xl mx-auto font-normal leading-relaxed">
            কোনো কোডিং ছাড়াই দারাজ ও অ্যামাজন স্টাইলের সম্পূর্ণ কাস্টমাইজড ই-কমার্স শপ তৈরি করুন। ক্যাশ অন ডেলিভারি, bKash/Nagad পেমেন্ট গেটওয়ে, ১-ক্লিক হোয়াটসঅ্যাপ অর্ডার ও অটো কুরিয়ার ট্র্যাকিং সহ।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 px-9 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-2xl shadow-blue-600/50 text-base transition-all duration-300 transform hover:-translate-y-1">
                {trialDays} দিনের ফ্রি ট্রায়াল শুরু করুন <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/store/nabrijan-official" target="_blank" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-14 px-9 border-slate-700 bg-slate-900/90 backdrop-blur-lg text-slate-100 hover:bg-slate-800 hover:border-slate-500 font-bold rounded-2xl text-base transition-all duration-300">
                <Store className="w-5 h-5 mr-2 text-emerald-400" /> অফিশিয়াল ডেমো শপ
              </Button>
            </Link>
          </div>

          {/* 3D Dynamic Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 glass-card rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="text-center p-4 border-r border-slate-800/80 last:border-none">
              <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200">500+</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">সক্রিয় মার্চেন্ট শপ</div>
            </div>
            <div className="text-center p-4 border-r border-slate-800/80 last:border-none">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">৳১ কোটি+</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">মোট অর্ডারের ভলিউম</div>
            </div>
            <div className="text-center p-4 border-r border-slate-800/80 last:border-none">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">{trialDays} দিন</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">১০০% ফ্রি ট্রায়াল</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-black text-indigo-400">৯৯.৯%</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">সার্ভার আপটাইম</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Store Showcase Section */}
      <section id="demo" className="py-24 bg-slate-900/50 border-b border-slate-800/80 relative overflow-hidden">
        <div className="glow-orb-purple -top-10 right-10" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 mb-3 px-4 py-1.5 rounded-full font-bold">
              <Store className="w-4 h-4 mr-1.5 inline" /> Live Demo Showcase
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
              বাস্তব ই-কমার্স শপের প্রিমিয়াম এক্সপেরিয়েন্স
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              আপনার কাস্টমাররা যেভাবে আপনার স্টোর থেকে পণ্য ক্রয় করবেন তার একটি বাস্তবসম্মত ডেমো প্রিভিউ।
            </p>
          </div>

          <div className="glass-card glass-card-hover rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden border border-white/10">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-xs font-black text-blue-400">
                  <Sparkles className="w-4 h-4" /> Single-Vendor Premium Theme
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  Nabrijan Official Store
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  সাইজ ও কালার ভ্যারিয়েন্ট সিলেকশন, রিয়েল-টাইম অটো স্টক আপডেট, ডিসকাউন্ট ব্যাজ, ১-ক্লিক হোয়াটসঅ্যাপ অর্ডার এবং পারফেক্ট মোবাইল রেসপন্সিভ লেআউট।
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>সাইজ ও কালার অপশন</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>১-ক্লিক হোয়াটসঅ্যাপ</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ক্যাশ অন ডেলিভারি</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/store/nabrijan-official"
                    target="_blank"
                    className="inline-flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transition transform hover:scale-105"
                  >
                    লাইভ শপ ভিউ করুন <ChevronRight className="w-5 h-5 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Interactive Mock Store Preview Card */}
              <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl relative">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white">
                      N
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Nabrijan Official</h4>
                      <p className="text-[10px] text-slate-400">Verified Merchant Store</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                    ● ONLINE
                  </Badge>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-sm font-bold text-white">Auravia Brightening Serum</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xl font-black text-emerald-400">৳১,২৫০</span>
                    <span className="text-xs text-slate-500 line-through">৳১,৯৯০</span>
                    <span className="text-[10px] font-black bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full">-37% OFF</span>
                  </div>
                  
                  {/* Mock Variant Pills */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Size Choice</div>
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow">30ml</span>
                      <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold">50ml</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl text-center shadow-lg cursor-pointer">
                      💬 Order via WhatsApp ( Instant )
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights 3D Cards */}
      <section id="features" className="py-24 bg-slate-950 relative">
        <div className="glow-orb-blue top-1/3 -left-30" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-3 px-4 py-1 rounded-full font-bold">
              ⚡ Cutting-Edge Features
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
              আপনার ই-কমার্স ব্যবসার জন্য প্রয়োজনীয় সব ফিচার
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              সর্বোচ্চ পারফরম্যান্স, মাল্টি-টেন্যান্ট সিকিউরিটি এবং মার্চেন্ট ফ্রেন্ডলি কন্ট্রোল প্যানেল।
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card glass-card-hover rounded-3xl p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">১-ক্লিক হোয়াটসঅ্যাপ অর্ডার</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                কাস্টমার সরাসরি প্রোডাক্ট পেজ থেকে ১-ক্লিকে হোয়াটসঅ্যাপে অর্ডারের টেক্সট মেসেজ ও প্রোডাক্ট লিংক পাঠাতে পারবে।
              </p>
            </div>

            <div className="glass-card glass-card-hover rounded-3xl p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">পাঠাও ও স্টিডফাস্ট কুরিয়ার</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                অর্ডার আসার সাথে সাথে অটোমেটিক পাঠাও বা স্টিডফাস্ট কুরিয়ার পার্সেল ট্র্যাকিং কোড জেনারেট করুন।
              </p>
            </div>

            <div className="glass-card glass-card-hover rounded-3xl p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">ZiniPay ও ক্যাশ অন ডেলিভারি</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                কাস্টমারের জন্য ক্যাশ অন ডেলিভারি এবং মার্চেন্টদের SaaS সাবস্ক্রিপশন ফি রিনিউ করতে ZiniPay পেমেন্ট।
              </p>
            </div>

            <div className="glass-card glass-card-hover rounded-3xl p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
                <Palette className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">সাইজ ও কালার ভ্যারিয়েন্ট</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                প্রোডাক্ট তৈরি করার সময় সাইজ (S, M, L, XL) এবং কালার অপশন যুক্ত করার পূর্ণ সুবিধা।
              </p>
            </div>

            <div className="glass-card glass-card-hover rounded-3xl p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">নিখুঁত নিট প্রফিট এনালাইটিক্স</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                প্রোডাক্টের ক্রয় মূল্য ও বিক্রি মূল্যের পার্থক্য হিসাব করে মার্চেন্ট ড্যাশবোর্ডে লাইভ নিট প্রফিট ট্র্যাক করুন।
              </p>
            </div>

            <div className="glass-card glass-card-hover rounded-3xl p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">সাইবার সিকিউরিটি ও ব্যাকআপ</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                সার্ভার-সাইড Multi-Tenant RBAC ও এন্টারপ্রাইজ গ্রেড এনক্রিপশন সিস্টেম সহ সুরক্ষিত ডেটাবেস।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Grid */}
      <section id="pricing" className="py-24 bg-slate-900/40 border-t border-slate-800/80 relative">
        <div className="glow-orb-purple bottom-10 left-10" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 mb-3 px-4 py-1 rounded-full font-bold">
              💎 Transparent Pricing
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
              সশ্রদ্ধ সাবস্ক্রিপশন প্ল্যানসমূহ
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              সকল প্ল্যানেই পাচ্ছেন {trialDays} দিনের ১-ক্লিক ফ্রি ট্রায়াল সুবিধা।
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="glass-card glass-card-hover rounded-3xl p-8 flex flex-col justify-between border border-slate-800">
              <div>
                <h3 className="text-2xl font-black text-white">স্টার্টার (Starter)</h3>
                <p className="text-xs text-slate-400 mt-1">নতুন উদ্যোক্তা ও ছোট শপের জন্য</p>
                <div className="mt-6 text-4xl font-black text-white">
                  ৳৯৯০ <span className="text-xs text-slate-400 font-normal">/ মাস</span>
                </div>
                <div className="my-6 border-b border-slate-800" />
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ১টি সক্রিয় ই-কমার্স শপ</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ১০০টি প্রোডাক্ট আপলোড</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ২টি স্টাফ মেম্বার অ্যাকাউন্ট</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ক্যাশ অন ডেলিভারি ইঞ্জিন</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ১-ক্লিক হোয়াটসঅ্যাপ অর্ডার</li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/register?plan=starter">
                  <Button className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition">
                    স্টার্টার প্ল্যান শুরু করুন
                  </Button>
                </Link>
              </div>
            </div>

            {/* Business Plan - Highlighted */}
            <div className="glass-card rounded-3xl p-8 flex flex-col justify-between border-2 border-indigo-500/80 relative shadow-2xl shadow-indigo-600/30 scale-105 bg-slate-900/90">
              <div className="absolute -top-4 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                সবচেয়ে জনপ্রিয়
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">বিজনেস (Business)</h3>
                <p className="text-xs text-slate-300 mt-1">গ্রোইং ই-কমার্স ব্র্যান্ডের জন্য</p>
                <div className="mt-6 text-4xl font-black text-blue-400">
                  ৳২,৪৯০ <span className="text-xs text-slate-400 font-normal">/ মাস</span>
                </div>
                <div className="my-6 border-b border-slate-800" />
                <ul className="space-y-3 text-xs text-slate-200">
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ৩টি সক্রিয় ই-কমার্স শপ</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> আনলিমিটেড প্রোডাক্ট আপলোড</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ১০টি স্টাফ মেম্বার অ্যাকাউন্ট</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> পাঠাও ও স্টিডফাস্ট কুরিয়ার বুকিং</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> সাইজ ও কালার ভ্যারিয়েন্ট অপশন</li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/register?plan=business">
                  <Button className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-500/40 transition">
                    বিজনেস প্ল্যান শুরু করুন
                  </Button>
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="glass-card glass-card-hover rounded-3xl p-8 flex flex-col justify-between border border-slate-800">
              <div>
                <h3 className="text-2xl font-black text-white">প্রো (Pro Enterprise)</h3>
                <p className="text-xs text-slate-400 mt-1">বড় মার্চেন্ট ও এজেন্সির জন্য</p>
                <div className="mt-6 text-4xl font-black text-white">
                  ৳৪,৯৯০ <span className="text-xs text-slate-400 font-normal">/ মাস</span>
                </div>
                <div className="my-6 border-b border-slate-800" />
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ১০টি সক্রিয় ই-কমার্স শপ</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> আনলিমিটেড প্রোডাক্ট ও স্টাফ</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> রিয়েল-টাইম নিট প্রফিট এনালাইটিক্স</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> প্রিমিয়াম থিম অ্যাক্সেস</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> প্রায়োরিটি ভিআইপি সাপোর্ট</li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/register?plan=pro">
                  <Button className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition">
                    প্রো প্ল্যান শুরু করুন
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-24 bg-slate-950 relative">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center max-w-xl mx-auto mb-16">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-3 px-4 py-1 rounded-full font-bold">
              <HelpCircle className="w-4 h-4 mr-1.5 inline" /> Got Questions?
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
              সাধারণ জিজ্ঞাসা ও উত্তর
            </h2>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-base">১. আমি কিভাবে ৩ দিনের ফ্রি ট্রায়াল ব্যবহার করবো?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                রেজিস্ট্রেশন বাটনে ক্লিক করে ইমেইল ও পাসওয়ার্ড দিয়ে একাউন্ট খোলার সাথে সাথে ৩ দিনের সম্পূর্ণ ফ্রি ট্রায়াল চালু হয়ে যাবে। কোনো ক্রেডিট কার্ড বা অগ্রিম টাকা প্রদান করতে হবে না।
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-base">২. ৩ দিন পর কিভাবে সাবস্ক্রিপশন ফি পরিশোধ করবো?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ফ্রি ট্রায়াল শেষে আপনার মার্চেন্ট ড্যাশবোর্ড থেকে ZiniPay গেটওয়ের মাধ্যমে bKash, Nagad বা Rocket দিয়ে মুহূর্তেই সাবস্ক্রিপশন ফি পরিশোধ করতে পারবেন।
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-base">৩. প্রোডাক্টে সাইজ এবং কালার যুক্ত করা যাবে কি?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                হ্যাঁ! মার্চেন্ট ড্যাশবোর্ড থেকে নতুন প্রোডাক্ট যুক্ত করার সময় সিলেক্টেবল সাইজ (S, M, L, XL) এবং কালার ভ্যারিয়েন্ট এবং সেগুলোর আলাদা মূল্য ও স্টক নির্ধারণ করতে পারবেন।
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-base">৪. দোকান কি সাময়িকভাবে অফ করা সম্ভব?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                হ্যাঁ! অ্যাডমিন ও মার্চেন্ট কাস্টম কন্ট্রোল প্যানেল থেকে যেকোনো সময় যেকোনো দোকান বা নির্দিষ্ট প্রোডাক্ট ON/OFF/SUSPEND করতে পারবেন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-12 bg-slate-950 text-slate-400 text-xs">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div className="space-y-4">
              <div className="font-black text-white text-lg flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm">N</div>
                <span>{siteName}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                বাংলাদেশের ই-কমার্স মার্চেন্টদের জন্য দ্রুততম, নিরাপদ ও আধুনিক SaaS প্ল্যাটফর্ম।
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="font-bold text-white text-sm">যোগাযোগ ও সহায়তা</div>
              <p>📞 Phone: {contactPhone}</p>
              <p>💬 WhatsApp: {whatsappNumber}</p>
              <p>✉️ Email: {contactEmail}</p>
            </div>

            <div className="space-y-2.5">
              <div className="font-bold text-white text-sm">গুরুত্বপূর্ণ লিংক</div>
              <p><Link href="/login" className="hover:text-white transition">মার্চেন্ট লগইন</Link></p>
              <p><Link href="/register" className="hover:text-white transition">৩-দিনের ফ্রি ট্রায়াল</Link></p>
              <p><Link href="/store/nabrijan-official" target="_blank" className="hover:text-white transition">অফিসিয়াল ডেমো শপ</Link></p>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} {siteName}. All rights reserved.</div>
            <div className="flex items-center space-x-4">
              <span>Security Audited</span>
              <span>•</span>
              <span>Multi-Tenant Enterprise</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
