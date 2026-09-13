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
  CheckCircle,
  Phone,
  UserPlus,
  PackagePlus,
  TrendingUp,
  Award,
  Download,
} from 'lucide-react';
import { db } from '@/lib/db/prisma';
import LiveChatWidget from '@/components/chat/LiveChatWidget';
import ApkDownloadModal from '@/components/apk/ApkDownloadModal';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function SaaSMarketingPage() {
  let settings = null;
  try {
    settings = await db.platformSettings.findUnique({ where: { id: 'default' } });
  } catch (e) {
    // Fallback if table not ready
  }

  const siteName = 'Nabrijan';
  const siteTagline = 'Build Your Online Store';
  const logoUrl = '/images/logo.png';

  const defaultBanner = '🔥 সম্পূর্ণ ফ্রি প্ল্যানে আজই আপনার প্রফেশনাল ই-কমার্স দোকান তৈরি করুন!';
  const rawBanner = settings?.bannerText || defaultBanner;
  const bannerText = (rawBanner.includes('৩ দিন') || rawBanner.includes('3 day') || rawBanner.includes('ট্রায়াল')) 
    ? defaultBanner 
    : rawBanner;

  const freePrice = settings?.freePrice !== undefined ? Number(settings.freePrice) : 0;
  const starterPrice = settings?.starterPrice !== undefined ? Number(settings.starterPrice) : 599;
  const proPrice = settings?.proPrice !== undefined ? Number(settings.proPrice) : 1099;
  const growthPrice = settings?.growthPrice !== undefined ? Number(settings.growthPrice) : 2499;
  const whatsappNumber = settings?.whatsappNumber || '+8801625642420';
  const contactPhone = settings?.contactPhone || '+8801625642420';
  const contactEmail = settings?.contactEmail || 'badhonmondoldeveloper@gmail.com';

  return (
    <div className="min-h-screen bg-[#F6FAF4] text-[#17221D] flex flex-col font-sans selection:bg-[#55B510] selection:text-white overflow-x-hidden max-w-full">
      {/* Top Announcement Bar - Dark Green & Brand Accent */}
      <div className="bg-[#063B2A] text-white text-[11px] sm:text-xs font-semibold py-2.5 px-4 text-center tracking-wide shadow-md flex items-center justify-center flex-wrap gap-1 border-b border-[#0b4d37]">
        <Sparkles className="w-3.5 h-3.5 text-[#55B510] animate-pulse hidden sm:inline" />
        <span>{bannerText}</span>
        <Link href="/register" className="underline font-bold text-[#55B510] hover:text-white transition inline-flex items-center ml-1">
          বিনামূল্যে শুরু করুন <ArrowRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>

      {/* Clean White & Premium Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-[#DCE7DF] shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <img
              src={logoUrl}
              alt="Nabrijan - Build Your Online Store"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider text-[#66736C]">
            <Link href="#features" className="hover:text-[#55B510] transition duration-200">ফিচারসমূহ</Link>
            <Link href="#app-download" className="hover:text-[#55B510] transition duration-200">মোবাইল অ্যাপ</Link>
            <Link href="#demo" className="hover:text-[#55B510] transition duration-200">লাইভ ডেমো</Link>
            <Link href="#pricing" className="hover:text-[#55B510] transition duration-200">সাবস্ক্রিপশন</Link>
            <Link href="#faq" className="hover:text-[#55B510] transition duration-200">FAQ</Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="text-[#063B2A] hover:text-[#55B510] hover:bg-[#EAF7DF] text-xs font-bold px-3 sm:px-4 py-2 rounded-xl border border-transparent">
                লগইন
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#55B510] hover:bg-[#489d0d] text-white text-[11px] sm:text-xs font-extrabold shadow-md shadow-[#55B510]/30 rounded-xl px-4 sm:px-6 py-2.5 transition duration-300 transform hover:scale-105">
                ফ্রি শুরু করুন
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Clean Light Background with Dark Green & Brand Green Accents */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden border-b border-[#DCE7DF] bg-gradient-to-b from-[#F6FAF4] via-[#EAF7DF]/30 to-[#F6FAF4]">
        <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
          <Badge variant="outline" className="mb-4 sm:mb-6 border-[#55B510]/40 text-[#063B2A] bg-[#EAF7DF] px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold tracking-wider uppercase shadow-sm inline-flex items-center gap-2 max-w-full break-words">
            <Sparkles className="w-4 h-4 text-[#55B510] shrink-0" /> বাংলাদেশের সেরা অল-ইন-ওয়ান ই-কমার্স SaaS ইঞ্জিন
          </Badge>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 sm:mb-8 leading-[1.18] text-[#063B2A] break-words">
            কোনো ডেভেলপার ছাড়াই তৈরি করুন <br className="hidden sm:inline" />
            <span className="text-[#55B510] underline decoration-[#55B510]/30 underline-offset-8">
              আপনার নিজস্ব ই-কমার্স শপ
            </span>
          </h1>

          <p className="text-sm sm:text-xl text-[#66736C] mb-8 sm:mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            ১-ক্লিক হোয়াটসঅ্যাপ অর্ডার, সাইজ ও কালার ভ্যারিয়েন্ট, পাঠাও ও স্টিডফাস্ট কুরিয়ার অটো বুকিং, bKash/Nagad পেমেন্ট এবং অ্যান্ড্রয়েড APK মোবাইল অ্যাপ সহ এখনই আপনার দোকান ইন্টারনেটে লাইভ করুন।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-12 sm:mb-16 w-full max-w-md sm:max-w-none mx-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-12 sm:h-14 px-7 sm:px-10 bg-[#55B510] hover:bg-[#489d0d] text-white font-black rounded-2xl shadow-lg shadow-[#55B510]/30 text-sm sm:text-base transition-all duration-300 transform hover:scale-[1.02]">
                🚀 বিনামূল্যে দোকান তৈরি করুন <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="/api/apk/download" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-12 sm:h-14 px-7 sm:px-9 border-[#063B2A] bg-white text-[#063B2A] hover:bg-[#EAF7DF] font-bold rounded-2xl text-sm sm:text-base transition-all duration-300">
                <Smartphone className="w-5 h-5 mr-2 text-[#55B510]" /> অ্যান্ড্রয়েড অ্যাপ ডাউনলোড (APK)
              </Button>
            </a>
          </div>

          {/* Dynamic Platform Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-[#DCE7DF] shadow-xl">
            <div className="text-center p-3 border-r border-b sm:border-b-0 border-[#DCE7DF]">
              <div className="text-2xl sm:text-4xl font-black text-[#063B2A]">500+</div>
              <div className="text-[11px] sm:text-xs text-[#66736C] font-bold uppercase tracking-wider mt-1">সক্রিয় মার্চেন্ট শপ</div>
            </div>
            <div className="text-center p-3 sm:border-r border-b sm:border-b-0 border-[#DCE7DF]">
              <div className="text-2xl sm:text-4xl font-black text-[#55B510]">৳১ কোটি+</div>
              <div className="text-[11px] sm:text-xs text-[#66736C] font-bold uppercase tracking-wider mt-1">মোট অর্ডারের ভলিউম</div>
            </div>
            <div className="text-center p-3 border-r border-[#DCE7DF]">
              <div className="text-2xl sm:text-4xl font-black text-[#063B2A]">ফ্রি প্ল্যান</div>
              <div className="text-[11px] sm:text-xs text-[#66736C] font-bold uppercase tracking-wider mt-1">১০০% বিনামূল্যে শুরু</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-4xl font-black text-[#55B510]">৯৯.৯%</div>
              <div className="text-[11px] sm:text-xs text-[#66736C] font-bold uppercase tracking-wider mt-1">সার্ভার আপটাইম</div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Merchant Android App Showcase Section */}
      <section id="app-download" className="py-12 sm:py-16 bg-[#063B2A] text-white border-b border-[#0b4d37] relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-[#04281c] rounded-3xl p-6 sm:p-10 border border-[#55B510]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <Badge className="bg-[#55B510]/20 text-[#55B510] border border-[#55B510]/40 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                📱 Official Merchant Android App (APK v1.2)
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                আপনার মোবাইল থেকেই পরিচালনা করুন পুরো ব্যবসা!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
                নতুন অর্ডার আসা মাত্র মোবাইলে রিয়েল-টাইম সাউন্ড নোটিফিকেশন পান, ১-ক্লিকে পাঠাও ও স্টিডফাস্ট কুরিয়ার পার্সেল বুক করুন এবং প্রতিদিনের আসল লাভ-ক্ষতি লাইভ হিসাব রাখুন।
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-white justify-center md:justify-start">
                <span className="bg-[#063B2A] px-3.5 py-1.5 rounded-xl border border-[#55B510]/30 flex items-center gap-1.5">⚡ সাউন্ড নোটিফিকেশন</span>
                <span className="bg-[#063B2A] px-3.5 py-1.5 rounded-xl border border-[#55B510]/30 flex items-center gap-1.5">🚚 ১-ক্লিক কুরিয়ার</span>
                <span className="bg-[#063B2A] px-3.5 py-1.5 rounded-xl border border-[#55B510]/30 flex items-center gap-1.5">📊 প্রফিট ট্র্যাকার</span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center space-y-3">
              <a
                href="/api/apk/download"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#55B510] hover:bg-[#489d0d] text-white font-black text-sm rounded-2xl shadow-xl shadow-[#55B510]/40 transition transform hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" /> ডাউনলোড অ্যান্ড্রয়েড অ্যাপ (APK)
              </a>
              <span className="text-[11px] text-emerald-200/70 font-mono">100% Virus Free Direct Installer (.apk)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-16 sm:py-24 bg-[#F6FAF4] relative">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <Badge className="bg-[#EAF7DF] text-[#063B2A] border border-[#55B510]/30 mb-3 px-4 py-1 rounded-full font-bold">
              ⚡ Platform Features
            </Badge>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#063B2A] mb-3 sm:mb-4">
              আপনার ই-কমার্স ব্যবসার জন্য সেরা ফিচারসমূহ
            </h2>
            <p className="text-[#66736C] text-xs sm:text-base">
              বাংলাদেশের সকল সফল মার্চেন্টদের প্রয়োজনীয় রিয়েল ই-কমার্স ফিচার ইন্টিগ্রেশন।
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 border border-[#DCE7DF] shadow-md hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7DF] flex items-center justify-center text-[#55B510]">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#063B2A]">১-ক্লিক হোয়াটসঅ্যাপ অর্ডার</h3>
              <p className="text-[#66736C] text-xs leading-relaxed">
                কাস্টমার প্রোডাক্ট পেজ থেকে সিলেক্ট করা সাইজ, কালার ও ঠিকানা সহ ১-ক্লিকে সরাসরি আপনার হোয়াটসঅ্যাপে অর্ডার কনফার্ম মেসেজ পাঠাতে পারবে।
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 border border-[#DCE7DF] shadow-md hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7DF] flex items-center justify-center text-[#55B510]">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#063B2A]">পাঠাও ও স্টিডফাস্ট কুরিয়ার API</h3>
              <p className="text-[#66736C] text-xs leading-relaxed">
                অর্ডার আসা মাত্র মার্চেন্ট ড্যাশবোর্ড থেকে ১-ক্লিকে পাঠাও ও স্টিডফাস্ট কুরিয়ার পার্সেল বুক করুন এবং কাস্টমারকে অটো ট্র্যাকিং কোড পাঠান।
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 border border-[#DCE7DF] shadow-md hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7DF] flex items-center justify-center text-[#55B510]">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#063B2A]">bKash/Nagad ZiniPay ও COD</h3>
              <p className="text-[#66736C] text-xs leading-relaxed">
                কাস্টমারের জন্য সুবিধাজনক ক্যাশ অন ডেলিভারি (COD) এবং মার্চেন্ট সাবস্ক্রিপশন রিনিউ করার জন্য অটোমেটিক ZiniPay (bKash, Nagad, Rocket) পেমেন্ট।
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 border border-[#DCE7DF] shadow-md hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7DF] flex items-center justify-center text-[#55B510]">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#063B2A]">সাইজ ও কালার ভ্যারিয়েন্ট সাপোর্ট</h3>
              <p className="text-[#66736C] text-xs leading-relaxed">
                কাপড়, জুতা বা ফ্যাশন আইটেমের জন্য আলাদা সাইজ (S, M, L, XL, XXL) এবং কালার অপশন যুক্ত করে আলাদা স্টক ও প্রাইসিং সেট করতে পারবেন।
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 border border-[#DCE7DF] shadow-md hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7DF] flex items-center justify-center text-[#55B510]">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#063B2A]">নিখুঁত নিট প্রফিট ক্যালকুলেটর</h3>
              <p className="text-[#66736C] text-xs leading-relaxed">
                ক্রয় মূল্যের সাথে বিক্রি মূল্য, কুরিয়ার চার্জ ও ডিসকাউন্ট হিসেব করে ড্যাশবোর্ডে প্রতিদিনের আসল নিট প্রফিট লাইভ দেখতে পাবেন।
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 border border-[#DCE7DF] shadow-md hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7DF] flex items-center justify-center text-[#55B510]">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#063B2A]">কাস্টম ডোমেইন ও এফিলিয়েট সিস্টেম</h3>
              <p className="text-[#66736C] text-xs leading-relaxed">
                আপনার নিজস্ব ডোমেইন (`yourdomain.com`) কানেক্ট করার সুবিধা এবং রেফার করে এফিলিয়েট কমিশন পাওয়ার অনন্য সুযোগ।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Store Showcase Section */}
      <section id="demo" className="py-16 sm:py-24 bg-white border-y border-[#DCE7DF] relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <Badge className="bg-[#EAF7DF] text-[#063B2A] border border-[#55B510]/30 mb-3 px-4 py-1.5 rounded-full font-bold">
              <Store className="w-4 h-4 mr-1.5 inline text-[#55B510]" /> Live Store Showcase
            </Badge>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#063B2A] mb-3 sm:mb-4">
              বাস্তব ই-কমার্স শপের চমৎকার অভিজ্ঞতা
            </h2>
            <p className="text-[#66736C] text-xs sm:text-base">
              আপনার কাস্টমাররা যেভাবে আপনার স্টোর থেকে পণ্য ক্রয় করবেন তার একটি বাস্তবসম্মত ডেমো প্রিভিউ।
            </p>
          </div>

          <div className="bg-[#F6FAF4] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl border border-[#DCE7DF]">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                <div className="inline-flex items-center space-x-2 bg-[#EAF7DF] border border-[#55B510]/30 px-3.5 py-1 rounded-full text-xs font-extrabold text-[#063B2A]">
                  <Sparkles className="w-3.5 h-3.5 text-[#55B510]" /> Single-Vendor Premium Storefront
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-[#063B2A] leading-tight">
                  Nabrijan Official Store
                </h3>
                <p className="text-xs sm:text-sm text-[#66736C] leading-relaxed">
                  সাইজ ও কালার ভ্যারিয়েন্ট সিলেকশন, রিয়েল-টাইম অটো স্টক আপডেট, ডিসকাউন্ট ব্যাজ, ১-ক্লিক হোয়াটসঅ্যাপ অর্ডার এবং পারফেক্ট মোবাইল রেসপন্সিভ লেআউট।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#063B2A] bg-white p-3 rounded-xl border border-[#DCE7DF] shadow-sm">
                    <CheckCircle className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>সাইজ ও কালার অপশন</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#063B2A] bg-white p-3 rounded-xl border border-[#DCE7DF] shadow-sm">
                    <CheckCircle className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>১-ক্লিক হোয়াটসঅ্যাপ</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#063B2A] bg-white p-3 rounded-xl border border-[#DCE7DF] shadow-sm">
                    <CheckCircle className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>ক্যাশ অন ডেলিভারি</span>
                  </div>
                </div>

                <div className="pt-2 sm:pt-4">
                  <Link
                    href="/store/nabrijan-official"
                    target="_blank"
                    className="inline-flex items-center justify-center w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 bg-[#55B510] hover:bg-[#489d0d] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#55B510]/30 transition transform hover:scale-105"
                  >
                    লাইভ শপ ভিউ করুন <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Interactive Mock Store Preview Card */}
              <div className="lg:col-span-5 bg-white border border-[#DCE7DF] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#DCE7DF]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#063B2A] flex items-center justify-center font-black text-white text-base">
                      N
                    </div>
                    <div>
                      <h4 className="font-bold text-[#063B2A] text-xs sm:text-sm">Nabrijan Official</h4>
                      <p className="text-[10px] text-[#66736C]">Verified Merchant Store</p>
                    </div>
                  </div>
                  <Badge className="bg-[#EAF7DF] text-[#55B510] border border-[#55B510]/30 text-[9px] sm:text-[10px]">
                    ● ONLINE
                  </Badge>
                </div>

                <div className="bg-[#F6FAF4] p-4 rounded-2xl border border-[#DCE7DF] space-y-3">
                  <div className="text-xs sm:text-sm font-bold text-[#063B2A]">Auravia Brightening Serum</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg sm:text-xl font-black text-[#55B510]">৳১,২৫০</span>
                    <span className="text-xs text-[#66736C] line-through">৳১,৯৯০</span>
                    <span className="text-[10px] font-black bg-[#EAF7DF] text-[#063B2A] px-2 py-0.5 rounded-full">-37% OFF</span>
                  </div>
                  
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] text-[#66736C] font-bold uppercase">Size Choice</div>
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 bg-[#55B510] text-white rounded-lg text-xs font-bold shadow">30ml</span>
                      <span className="px-3 py-1 bg-white text-[#66736C] border border-[#DCE7DF] rounded-lg text-xs font-bold">50ml</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="w-full bg-[#063B2A] hover:bg-[#04281c] text-white font-bold text-xs py-2.5 rounded-xl text-center shadow-md cursor-pointer flex items-center justify-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-[#55B510]" /> Order via WhatsApp ( Instant )
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Grid */}
      <section id="pricing" className="py-16 sm:py-24 bg-[#F6FAF4] border-t border-[#DCE7DF] relative">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <Badge className="bg-[#EAF7DF] text-[#063B2A] border border-[#55B510]/30 mb-3 px-4 py-1 rounded-full font-bold">
              💎 Transparent Pricing
            </Badge>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#063B2A] mb-3 sm:mb-4">
              সশ্রদ্ধ সাবস্ক্রিপশন প্ল্যানসমূহ
            </h2>
            <p className="text-[#66736C] text-xs sm:text-base">
              আমাদের রয়েছে সম্পূর্ণ ফ্রি প্ল্যান যা ব্যবহার করে আপনি যেকোনো সময় আপনার দোকান চালাতে ও ট্রাই করতে পারবেন।
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between border border-[#DCE7DF] shadow-md hover:shadow-xl transition">
              <div>
                <h3 className="text-xl font-black text-[#063B2A]">ফ্রি (Free Plan)</h3>
                <p className="text-xs text-[#66736C] mt-1">দোকান টেস্ট ও ফ্রী শুরু করার জন্য</p>
                <div className="mt-4 text-3xl font-black text-[#063B2A]">
                  ৳{freePrice} <span className="text-xs text-[#66736C] font-normal">/ মাস</span>
                </div>
                <div className="my-5 border-b border-[#DCE7DF]" />
                <ul className="space-y-2 text-xs text-[#17221D]">
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> ২০টি প্রোডাক্ট আপলোড</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> প্রিসেট থিম লেআউট</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> ১-ক্লিক হোয়াটসঅ্যাপ অর্ডার</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> ক্যাশ অন ডেলিভারি ইঞ্জিন</li>
                </ul>
              </div>
              <div className="pt-6">
                <Link href="/register?plan=free">
                  <Button className="w-full h-11 bg-[#063B2A] hover:bg-[#04281c] text-white font-bold text-xs rounded-xl transition">
                    ফ্রি প্ল্যান শুরু করুন
                  </Button>
                </Link>
              </div>
            </div>

            {/* Starter Plan */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between border border-[#DCE7DF] shadow-md hover:shadow-xl transition">
              <div>
                <h3 className="text-xl font-black text-[#063B2A]">স্টার্টার (Starter)</h3>
                <p className="text-xs text-[#66736C] mt-1">নতুন উদ্যোক্তাদের জন্য</p>
                <div className="mt-4 text-3xl font-black text-[#55B510]">
                  ৳{starterPrice.toLocaleString()} <span className="text-xs text-[#66736C] font-normal">/ মাস</span>
                </div>
                <div className="my-5 border-b border-[#DCE7DF]" />
                <ul className="space-y-2 text-xs text-[#17221D]">
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> ৫০০টি প্রোডাক্ট আপলোড</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> 0% ফিজিক্যাল অর্ডার ফি</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> ২ জন স্টাফ মেম্বার</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> সেলস রিপোর্ট এক্সপোর্ট</li>
                </ul>
              </div>
              <div className="pt-6">
                <Link href="/register?plan=starter">
                  <Button className="w-full h-11 bg-[#55B510] hover:bg-[#489d0d] text-white font-bold text-xs rounded-xl transition">
                    স্টার্টার প্ল্যান শুরু করুন
                  </Button>
                </Link>
              </div>
            </div>

            {/* Pro Plan - Highlighted */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between border-2 border-[#55B510] relative shadow-2xl bg-gradient-to-b from-white to-[#EAF7DF]/30">
              <div className="absolute -top-3.5 right-4 bg-[#55B510] text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                সবচেয়ে জনপ্রিয়
              </div>
              <div>
                <h3 className="text-xl font-black text-[#063B2A]">প্রো (Pro Plan)</h3>
                <p className="text-xs text-[#66736C] mt-1">গ্রোইং ই-কমার্স ব্র্যান্ডের জন্য</p>
                <div className="mt-4 text-3xl font-black text-[#55B510]">
                  ৳{proPrice.toLocaleString()} <span className="text-xs text-[#66736C] font-normal">/ মাস</span>
                </div>
                <div className="my-5 border-b border-[#DCE7DF]" />
                <ul className="space-y-2 text-xs text-[#17221D]">
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> ২,০০০টি প্রোডাক্ট আপলোড</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> কাস্টম ডোমেইন ম্যাপিং</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> ভিজ্যুয়াল থিম বিল্ডার</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> অটোমেটেড কার্ট রিকভারি</li>
                </ul>
              </div>
              <div className="pt-6">
                <Link href="/register?plan=pro">
                  <Button className="w-full h-11 bg-[#55B510] hover:bg-[#489d0d] text-white font-black text-xs rounded-xl shadow-lg shadow-[#55B510]/30 transition">
                    প্রো প্ল্যান শুরু করুন
                  </Button>
                </Link>
              </div>
            </div>

            {/* Growth Plan */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between border border-[#DCE7DF] shadow-md hover:shadow-xl transition">
              <div>
                <h3 className="text-xl font-black text-[#063B2A]">গ্রোথ (Growth)</h3>
                <p className="text-xs text-[#66736C] mt-1">বড় মার্চেন্ট ও এজেন্সির জন্য</p>
                <div className="mt-4 text-3xl font-black text-[#063B2A]">
                  ৳{growthPrice.toLocaleString()} <span className="text-xs text-[#66736C] font-normal">/ মাস</span>
                </div>
                <div className="my-5 border-b border-[#DCE7DF]" />
                <ul className="space-y-2 text-xs text-[#17221D]">
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> আনলিমিটেড প্রোডাক্ট ও স্টাফ</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> পাঠাও ও স্টিডফাস্ট কুরিয়ার API</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> নিট প্রফিট ও সেলস রিপোর্ট</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> ড্যাডিকেটেড প্রায়োরিটি সাপোর্ট</li>
                </ul>
              </div>
              <div className="pt-6">
                <Link href="/register?plan=growth">
                  <Button className="w-full h-11 bg-[#063B2A] hover:bg-[#04281c] text-white font-bold text-xs rounded-xl transition">
                    গ্রোথ প্ল্যান শুরু করুন
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-16 sm:py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center max-w-xl mx-auto mb-12">
            <Badge className="bg-[#EAF7DF] text-[#063B2A] border border-[#55B510]/30 mb-3 px-4 py-1 rounded-full font-bold">
              <HelpCircle className="w-4 h-4 mr-1.5 inline text-[#55B510]" /> Got Questions?
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#063B2A] mb-3">
              সাধারণ জিজ্ঞাসা ও উত্তর
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-[#F6FAF4] p-5 sm:p-6 rounded-2xl border border-[#DCE7DF] space-y-2">
              <h3 className="font-bold text-[#063B2A] text-sm sm:text-base">১. আমি কিভাবে ফ্রি প্ল্যান ব্যবহার করবো?</h3>
              <p className="text-xs text-[#66736C] leading-relaxed">
                রেজিস্ট্রেশন বাটনে ক্লিক করে ইমেইল ও পাসওয়ার্ড দিয়ে ফ্রিতে একাউন্ট খোলার সাথে সাথে যেকোনো সময় আপনার অনলাইন স্টোর চালু করতে পারবেন। কোনো ক্রেডিট কার্ড বা অগ্রিম টাকা লাগবে না।
              </p>
            </div>

            <div className="bg-[#F6FAF4] p-5 sm:p-6 rounded-2xl border border-[#DCE7DF] space-y-2">
              <h3 className="font-bold text-[#063B2A] text-sm sm:text-base">২. পেইড প্ল্যানে কিভাবে আপগ্রেড করবো?</h3>
              <p className="text-xs text-[#66736C] leading-relaxed">
                আপনার মার্চেন্ট ড্যাশবোর্ড থেকে ZiniPay গেটওয়ের মাধ্যমে bKash, Nagad বা Rocket দিয়ে মুহূর্তেই পছন্দ অনুযায়ী পেইড প্ল্যানে আপগ্রেড করতে পারবেন।
              </p>
            </div>

            <div className="bg-[#F6FAF4] p-5 sm:p-6 rounded-2xl border border-[#DCE7DF] space-y-2">
              <h3 className="font-bold text-[#063B2A] text-sm sm:text-base">৩. প্রোডাক্টে সাইজ এবং কালার যুক্ত করা যাবে কি?</h3>
              <p className="text-xs text-[#66736C] leading-relaxed">
                হ্যাঁ! মার্চেন্ট ড্যাশবোর্ড থেকে নতুন প্রোডাক্ট যুক্ত করার সময় সিলেক্টেবল সাইজ (S, M, L, XL, XXL) এবং কালার ভ্যারিয়েন্ট এবং সেগুলোর আলাদা মূল্য ও স্টক নির্ধারণ করতে পারবেন।
              </p>
            </div>

            <div className="bg-[#F6FAF4] p-5 sm:p-6 rounded-2xl border border-[#DCE7DF] space-y-2">
              <h3 className="font-bold text-[#063B2A] text-sm sm:text-base">৪. দোকান কি সাময়িকভাবে অফ করা সম্ভব?</h3>
              <p className="text-xs text-[#66736C] leading-relaxed">
                হ্যাঁ! অ্যাডমিন ও মার্চেন্ট কাস্টম কন্ট্রোল প্যানেল থেকে যেকোনো সময় যেকোনো দোকান বা নির্দিষ্ট প্রোডাক্ট ON/OFF/SUSPEND করতে পারবেন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Dark Green & Clean Brand Green Accents */}
      <footer className="mt-auto border-t border-[#0b4d37] py-10 sm:py-14 bg-[#063B2A] text-emerald-100 text-xs">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-10">
            <div className="space-y-3">
              <Link href="/" className="inline-block">
                <img
                  src={logoUrl}
                  alt="Nabrijan - Build Your Online Store"
                  className="h-10 sm:h-12 w-auto object-contain bg-white/95 p-1 rounded-xl shadow-md"
                />
              </Link>
              <p className="text-emerald-200/80 text-xs leading-relaxed max-w-sm">
                বাংলাদেশের ই-কমার্স মার্চেন্টদের জন্য দ্রুততম, নিরাপদ ও আধুনিক SaaS প্ল্যাটফর্ম।
              </p>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="font-bold text-white text-sm font-sans">যোগাযোগ ও সহায়তা</div>
              <p className="flex items-center text-emerald-100">
                <Phone className="w-3.5 h-3.5 mr-2 text-[#55B510]" /> Call: {contactPhone}
              </p>
              <p className="flex items-center text-emerald-100">
                <MessageCircle className="w-3.5 h-3.5 mr-2 text-[#55B510]" /> WhatsApp: {whatsappNumber}
              </p>
              <p className="flex items-center text-emerald-100 font-sans">
                ✉️ Email: {contactEmail}
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white text-sm">গুরুত্বপূর্ণ লিংক</div>
              <p><Link href="/login" className="hover:text-[#55B510] transition">মার্চেন্ট লগইন</Link></p>
              <p><Link href="/register" className="hover:text-[#55B510] transition">ফ্রি অ্যাকাউন্ট খুলুন</Link></p>
              <p><Link href="/store/nabrijan-official" target="_blank" className="hover:text-[#55B510] transition">অফিসিয়াল ডেমো শপ</Link></p>
            </div>

            {/* Android APK Download Section in Footer */}
            <div className="space-y-3 bg-[#04281c] border border-[#55B510]/40 p-4 rounded-2xl shadow-xl">
              <div className="font-bold text-white text-sm flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-[#55B510] shrink-0" />
                <span>অ্যান্ড্রয়েড অ্যাপ (APK Download)</span>
              </div>
              <p className="text-emerald-200/70 text-xs leading-relaxed">
                আপনার মোবাইল ফোনে ইনস্টল করে নোটিফিকেশন পান এবং সহজেই অর্ডার বুক করুন।
              </p>
              <a
                href="/api/apk/download"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#55B510] hover:bg-[#489d0d] text-white font-black text-xs rounded-xl shadow-lg shadow-[#55B510]/30 transition transform hover:scale-[1.02]"
              >
                <Smartphone className="w-3.5 h-3.5 mr-1.5 text-white" /> 📥 Android APK ডাউনলোড
              </a>
            </div>
          </div>

          <div className="border-t border-[#0b4d37] pt-6 sm:pt-8 text-center text-[11px] text-emerald-300/70 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>© {new Date().getFullYear()} Nabrijan (Build Your Online Store). All rights reserved.</div>
            <div className="flex items-center space-x-3 text-emerald-300/70">
              <span>Security Audited</span>
              <span>•</span>
              <span>24/7 Online SaaS Hosting</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Realtime Floating Live Support Chat Widget */}
      <LiveChatWidget />
    </div>
  );
}
