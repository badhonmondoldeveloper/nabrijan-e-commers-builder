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
  HelpCircle
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Global Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white text-xs font-bold py-2 px-4 text-center tracking-wide shadow-md">
        <span>{bannerText}</span>
        <Link href="/register" className="ml-2 underline font-extrabold hover:text-amber-300 transition">
          এখনি অ্যাকাউন্ট খুলুন &rarr;
        </Link>
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/25">
              N
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white leading-none">
                {siteName}
              </span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-0.5">
                Multi-Tenant E-Commerce SaaS
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Link href="#features" className="hover:text-white transition">ফিচারসমূহ</Link>
            <Link href="#demo" className="hover:text-white transition">লাইব ডেমো স্টোর</Link>
            <Link href="#pricing" className="hover:text-white transition">সাবস্ক্রিপশন প্ল্যান</Link>
            <Link href="#faq" className="hover:text-white transition">প্রশ্নোত্তর (FAQ)</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-bold">
                লগইন করুন
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 rounded-xl px-4 py-2">
                {trialDays}-দিন ফ্রি ট্রায়াল <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]"></div>
        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <Badge variant="outline" className="mb-6 border-blue-500/40 text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
            ⚡ Bangladesh's Premium Multi-Tenant E-Commerce SaaS
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-[1.15] text-white">
            আপনার অনলাইন ই-কমার্স বিজনেস চালু করুন <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">মাত্র ৩ মিনিটে</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto font-normal leading-relaxed">
            কোনো কোডিং ছাড়া AliExpress & Daraz স্টাইলের আকর্ষণীয় অনলাইন শপ তৈরি করুন। ক্যাশ অন ডেলিভারি, bKash/Nagad জিপে পেমেন্ট, ১-ক্লিক হোয়াটসঅ্যাপ অর্ডার এবং অটোমেটিক কুরিয়ার বুকিং সুবিধা সহ।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-13 px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-2xl shadow-blue-600/40 text-sm">
                {trialDays} দিনের ফ্রি ট্রায়াল শুরু করুন <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/store/nabrijan-official" target="_blank" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-13 px-8 border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white font-bold rounded-xl text-sm">
                <Store className="w-4 h-4 mr-2 text-emerald-400" /> অফিশিয়াল ডেমো শপ দেখুন
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md">
            <div className="text-center p-3 border-r border-slate-800/80 last:border-none">
              <div className="text-2xl sm:text-3xl font-black text-white">500+</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">সক্রিয় মার্চেন্ট শপ</div>
            </div>
            <div className="text-center p-3 border-r border-slate-800/80 last:border-none">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">৳১ কোটি+</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">মোট অর্ডারের ভলিউম</div>
            </div>
            <div className="text-center p-3 border-r border-slate-800/80 last:border-none">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">{trialDays} দিন</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">১০০% ফ্রি ট্রায়াল</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">৯৯.৯%</div>
              <div className="text-xs text-slate-400 font-semibold mt-1">সার্ভার আপটাইম</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Store Showcase Section */}
      <section id="demo" className="py-20 bg-slate-900/40 border-b border-slate-800/60 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-3">
              <Store className="w-3.5 h-3.5 mr-1" /> Live Demo Showcase
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-3">
              বাস্তব ই-কমার্স শপের চমৎকার অভিজ্ঞতা
            </h2>
            <p className="text-slate-400 text-sm">
              নিচে আপনার মার্চেন্ট শপ কাস্টমারদের কাছে ঠিক কেমন দেখাবে তার ডেমো দেখুন।
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-lg">
                <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" /> Single-Vendor Amazon/Daraz Style
                </div>
                <h3 className="text-2xl font-black text-white leading-tight">
                  Nabrijan Official Demo Store
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ডিভাইস থেকে ডাইরেক্ট প্রোডাক্ট পিকচার আপলোড, ডিসকাউন্ট ট্যাগ (-37% OFF), ১-ক্লিক হোয়াটসঅ্যাপ অর্ডার বাটন এবং ফ্লোটিং হোয়াটসঅ্যাপ চ্যাট সুবিধা।
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-300 pt-1">
                  <span className="bg-slate-800 px-3 py-1 rounded-lg">স্মার্ট ওয়াচ</span>
                  <span className="bg-slate-800 px-3 py-1 rounded-lg">এয়ারপডস প্র</span>
                  <span className="bg-slate-800 px-3 py-1 rounded-lg">লেদার মানিব্যাগ</span>
                </div>
                <div className="pt-2">
                  <Link
                    href="/store/nabrijan-official"
                    target="_blank"
                    className="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition"
                  >
                    লাইভ শপ ভিউ করুন <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Preview Badge Card */}
              <div className="w-full md:w-80 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white">
                    N
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Nabrijan Store</h4>
                    <p className="text-[10px] text-slate-400">Dhaka, Bangladesh</p>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-white">T900 Ultra Smartwatch</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-sm font-black text-emerald-400">৳১,২৫০</span>
                    <span className="text-[10px] text-slate-500 line-through">৳১,৯৯০</span>
                  </div>
                  <div className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-1 rounded text-center">
                    💬 Order on WhatsApp Ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 bg-slate-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-4">
              আপনার ই-কমার্স ব্যবসার জন্য প্রয়োজনীয় সবকিছু
            </h2>
            <p className="text-slate-400 text-sm">
              সর্বোচ্চ গতি, নিরাপত্তা এবং সহজ মার্চেন্ট কন্ট্রোল সহ মোবাইল-ফার্স্ট আর্কিটেকচারে তৈরি।
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-900/60 border-slate-800 text-slate-100 shadow-xl hover:border-blue-500/50 transition">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">১-ক্লিক হোয়াটসঅ্যাপ ডাইরেক্ট অর্ডার</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed">
                  কাস্টমার সরাসরি প্রোডাক্ট পেজ থেকে ১-ক্লিকে হোয়াটসঅ্যাপে অর্ডারের টেক্সট মেসেজ পাঠাতে পারবে।
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 text-slate-100 shadow-xl hover:border-blue-500/50 transition">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <Truck className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">পাঠাও ও স্টিডফাস্ট কুরিয়ার বুকিং</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed">
                  অর্ডার আসার সাথে সাথে অটোমেটিক পাঠাও বা স্টিডফাস্ট কুরিয়ার পার্সেল ট্র্যাকিং কোড জেনারেট।
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 text-slate-100 shadow-xl hover:border-blue-500/50 transition">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">ZiniPay ও ক্যাশ অন ডেলিভারি</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed">
                  কাস্টমারের জন্য ক্যাশ অন ডেলিভারি এবং মার্চেন্টদের SaaS সাবস্ক্রিপশন ফি পরিশোধে ZiniPay অটো পেমেন্ট।
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 text-slate-100 shadow-xl hover:border-blue-500/50 transition">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                  <Palette className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">অন-ক্লিক থিম ও ব্যান্ডিং এডিটর</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed">
                  স্টোরের লোগো, ব্যানার, নোটিশ বার, কাস্টমার ফোন নম্বর ও থিম কালার কাস্টমাইজেশন সুবিধা।
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 text-slate-100 shadow-xl hover:border-blue-500/50 transition">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">রিয়েল-টাইম প্রফিট এনালাইটিক্স</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed">
                  প্রোডাক্টের কেনা দাম ও বিক্রি দামের হিসাব রেখে নিখুঁত নিট প্রফিট ও সেলস রিপোর্ট ট্র্যাক করুন।
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 text-slate-100 shadow-xl hover:border-blue-500/50 transition">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">মাল্টি-টেন্যান্ট সিকিউরিটি</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed">
                  প্রতিটি শপের ডেটাবেস স্টেট আলাদা ও নিরাপদ রাখতে সার্ভার-সাইড রোল বেসড অ্যাক্সেস কন্ট্রোল (RBAC)।
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Summary */}
      <section id="pricing" className="py-20 bg-slate-900/30 border-t border-slate-800/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Transparent Pricing
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-3">
              সাবস্ক্রিপশন প্ল্যানসমূহ
            </h2>
            <p className="text-slate-400 text-sm">
              প্রত্যেকটি প্ল্যানে অন্তর্ভুক্ত রয়েছে {trialDays} দিনের ফ্রি ট্রায়াল সুবিধা।
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="bg-slate-900 border-slate-800 text-white flex flex-col justify-between shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">স্টার্টার (Starter)</CardTitle>
                <CardDescription className="text-slate-400">নতুন উদ্যোক্তা ও ছোট শপের জন্য</CardDescription>
                <div className="mt-4 text-3xl font-black">৳৯৯০ <span className="text-xs text-slate-400 font-normal">/ মাস</span></div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ১টি সক্রিয় ই-কমার্স শপ</div>
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ১০০টি প্রোডাক্ট যুক্ত করার সুযোগ</div>
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ২টি স্টাফ মেম্বার অ্যাকাউন্ট</div>
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ক্যাশ অন ডেলিভারি ইঞ্জিন</div>
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ১-ক্লিক হোয়াটসঅ্যাপ অর্ডার</div>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href="/register?plan=starter">
                  <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs">
                    স্টার্টার নির্বাচন করুন
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Business Plan */}
            <Card className="bg-slate-900 border-blue-500 text-white flex flex-col justify-between relative shadow-2xl shadow-blue-600/20">
              <div className="absolute -top-3.5 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                সবচেয়ে জনপ্রিয়
              </div>
              <CardHeader>
                <CardTitle className="text-xl">বিজনেস (Business)</CardTitle>
                <CardDescription className="text-slate-400">গ্রোইং ই-কমার্স ব্র্যান্ডের জন্য</CardDescription>
                <div className="mt-4 text-3xl font-black text-blue-400">৳২,৪৯০ <span className="text-xs text-slate-400 font-normal">/ মাস</span></div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ৩টি সক্রিয় ই-কমার্স শপ</div>
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> আনলিমিটেড প্রোডাক্ট যুক্ত করার সুবিধা</div>
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ১০টি স্টাফ মেম্বার অ্যাকাউন্ট</div>
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> পাঠাও ও স্টিডফাস্ট কুরিয়ার বুকিং</div>
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> কাস্টম ডোমেইন ম্যাপিং</div>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href="/register?plan=business">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30">
                    বিজনেস নির্বাচন করুন
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-slate-900 border-slate-800 text-white flex flex-col justify-between shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">প্রো এন্টারপ্রাইজ (Pro)</CardTitle>
                <CardDescription className="text-slate-400">বড় মার্চেন্ট ও এজেন্সির জন্য</CardDescription>
                <div className="mt-4 text-3xl font-black">৳৪,৯৯০ <span className="text-xs text-slate-400 font-normal">/ মাস</span></div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ১০টি সক্রিয় ই-কমার্স শপ</div>
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> আনলিমিটেড প্রোডাক্ট ও স্টাফ</div>
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> রিয়েল-টাইম প্রফিট ও সেলস রিপোর্ট</div>
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> প্রিমিয়াম থিম অ্যাক্সেস</div>
                <div className="flex items-center"><Check className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> ড্যাডিকেটেড প্রায়োরিটি সাপোর্ট</div>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href="/register?plan=pro">
                  <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs">
                    প্রো নির্বাচন করুন
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 bg-slate-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-3">
              <HelpCircle className="w-3.5 h-3.5 mr-1" /> FAQ
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              সাধারণ কিছু প্রশ্ন ও উত্তর
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-base">১. আমি কিভাবে ৩ দিনের ফ্রি ট্রায়াল ব্যবহার করবো?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                রেজিস্ট্রেশন বাটনে ক্লিক করে ইমেইল ও পাসওয়ার্ড দিয়ে একাউন্ট খোলার সাথে সাথে ৩ দিনের সম্পূর্ণ ফ্রি ট্রায়াল চালু হয়ে যাবে। কোনো ক্রেডিট কার্ড বা অগ্রিম টাকা লাগবে না।
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-base">২. ৩ দিন পর কিভাবে সাবস্ক্রিপশন ফি পরিশোধ করবো?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ৩ দিন ফ্রি ট্রায়াল শেষে আপনার মার্চেন্ট ড্যাশবোর্ড থেকে ZiniPay গেটওয়ের মাধ্যমে bKash, Nagad বা Rocket দিয়ে মুহূর্তেই সাবস্ক্রিপশন রিনিউ করতে পারবেন।
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-base">৩. আমি কি নিজের পছন্দমতো লোগো ও ফোন নাম্বার যুক্ত করতে পারবো?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                হ্যাঁ! আপনার মার্চেন্ট ড্যাশবোর্ডের Settings পেজ থেকে দোকানের লোগো, ব্যানার, হোয়াটসঅ্যাপ নম্বর এবং ডেলিভারি এড্রেস কাস্টমাইজ করতে পারবেন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-10 bg-slate-950 text-slate-400 text-xs">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-3">
              <div className="font-black text-white text-base">{siteName}</div>
              <p className="text-slate-400 text-xs leading-relaxed">
                বাংলাদেশি মার্চেন্টদের জন্য দ্রুততম ও নির্ভরযোগ্য ই-কমার্স SaaS প্ল্যাটফর্ম।
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white text-sm">যোগাযোগ ও সহায়তা</div>
              <p>📞 Phone: {contactPhone}</p>
              <p>💬 WhatsApp: {whatsappNumber}</p>
              <p>✉️ Email: {contactEmail}</p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white text-sm">গুরুত্বপূর্ণ লিংক</div>
              <p><Link href="/login" className="hover:text-white transition">মার্চেন্ট লগইন</Link></p>
              <p><Link href="/register" className="hover:text-white transition">৩-দিনের ফ্রি ট্রায়াল একাউন্ট</Link></p>
              <p><Link href="/store/nabrijan-official" target="_blank" className="hover:text-white transition">অফিসিয়াল ডেমো শপ</Link></p>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-6 text-center text-[11px] text-slate-500">
            © {new Date().getFullYear()} {siteName}. All rights reserved. Built for scalability & high performance.
          </div>
        </div>
      </footer>
    </div>
  );
}
