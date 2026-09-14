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
  Crown,
  CreditCard,
  Rocket,
  Shield,
  Clock,
} from 'lucide-react';
import { db } from '@/lib/db/prisma';
import LiveChatWidget from '@/components/chat/LiveChatWidget';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function SaaSMarketingPage() {
  let settings = null;
  try {
    settings = await db.platformSettings.findUnique({ where: { id: 'default' } });
  } catch (e) {
    // Fallback if table not ready
  }

  const siteName = settings?.siteName || 'Nabrijan';
  const logoUrl = settings?.logoUrl || '/images/logo.png';
  const fullPackagePrice = settings?.fullPackagePrice !== undefined ? Number(settings.fullPackagePrice) : 500;
  const bkashNumber = settings?.bkashNumber || '01625642420';
  const whatsappNumber = settings?.whatsappNumber || '+8801625642420';
  const contactPhone = settings?.contactPhone || '+8801625642420';
  const contactEmail = settings?.contactEmail || 'badhonmondoldeveloper@gmail.com';

  const bannerText = settings?.bannerText || '🔥 মাত্র ৳৫০০ টাকায় আপনার ফুল প্রফেশনাল ই-কমার্স দোকান চালু করুন! ১-ক্লিক বিকাশ পেমেন্ট!';

  return (
    <div className="min-h-screen bg-[#F6FAF4] text-[#17221D] flex flex-col font-sans selection:bg-[#55B510] selection:text-white overflow-x-hidden max-w-full">
      {/* Top Premium Announcement Bar */}
      <div className="bg-[#063B2A] text-white text-[11px] sm:text-xs font-semibold py-2.5 px-4 text-center tracking-wide shadow-md flex items-center justify-center flex-wrap gap-1.5 border-b border-[#0b4d37]">
        <Sparkles className="w-3.5 h-3.5 text-[#55B510] animate-pulse hidden sm:inline" />
        <span>{bannerText}</span>
        <Link href="/register" className="underline font-extrabold text-[#55B510] hover:text-white transition inline-flex items-center ml-1">
          বিনামূল্যে শুরু করুন <ArrowRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>

      {/* Glassmorphism Header & Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-[#DCE7DF] shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <img
              src={logoUrl}
              alt="Nabrijan - Build Your Online Store"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-extrabold uppercase tracking-wider text-[#66736C]">
            <Link href="#features" className="hover:text-[#55B510] transition duration-200">ফিচারসমূহ</Link>
            <Link href="#demo" className="hover:text-[#55B510] transition duration-200">লাইভ ডেমো</Link>
            <Link href="#pricing" className="hover:text-[#55B510] transition duration-200">প্যাকেজসমূহ (৳৫০০ থেকে)</Link>
            <Link href="#faq" className="hover:text-[#55B510] transition duration-200">FAQ</Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="text-[#063B2A] hover:text-[#55B510] hover:bg-[#EAF7DF] text-xs font-extrabold px-3.5 sm:px-4 py-2 rounded-xl border border-transparent">
                লগইন
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#55B510] hover:bg-[#489d0d] text-white text-[11px] sm:text-xs font-black shadow-md shadow-[#55B510]/30 rounded-xl px-4 sm:px-6 py-2.5 transition duration-300 transform hover:scale-105">
                ফ্রি দোকান তৈরি করুন
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden border-b border-[#DCE7DF] bg-gradient-to-b from-[#F6FAF4] via-[#EAF7DF]/40 to-[#F6FAF4]">
        <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
          <Badge variant="outline" className="mb-4 sm:mb-6 border-[#55B510]/40 text-[#063B2A] bg-[#EAF7DF] px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-sm inline-flex items-center gap-2 max-w-full">
            <Sparkles className="w-4 h-4 text-[#55B510] shrink-0" /> বাংলাদেশের সেরা ই-কমার্স বিল্ডার প্ল্যাটফর্ম
          </Badge>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 sm:mb-8 leading-[1.15] text-[#063B2A] break-words">
            কোডিং ছাড়াই তৈরি করুন <br className="hidden sm:inline" />
            <span className="text-[#55B510] underline decoration-[#55B510]/30 underline-offset-8">
              আপনার প্রিমিয়াম ই-কমার্স শপ
            </span>
          </h1>

          <p className="text-sm sm:text-xl text-[#66736C] mb-8 sm:mb-10 max-w-3xl mx-auto font-medium leading-relaxed">
            ১-ক্লিক হোয়াটসঅ্যাপ অর্ডার, পণ্য ভ্যারিয়েন্ট, পাঠাও ও স্টিডফাস্ট কুরিয়ার অটো বুকিং, কাস্টম ডোমেইন কানেক্ট এবং বিকাশ/নগদ পেমেন্ট ভেরিফিকেশনে আজই আপনার ব্যবসা শুরু করুন!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-12 sm:mb-16 w-full max-w-md sm:max-w-none mx-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-12 sm:h-14 px-8 sm:px-12 bg-[#55B510] hover:bg-[#489d0d] text-white font-black rounded-2xl shadow-xl shadow-[#55B510]/30 text-sm sm:text-base transition-all duration-300 transform hover:scale-[1.02]">
                🚀 বিনামূল্যে দোকান তৈরি করুন <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#pricing" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-12 sm:h-14 px-7 sm:px-9 border-[#063B2A] bg-white text-[#063B2A] hover:bg-[#EAF7DF] font-bold rounded-2xl text-sm sm:text-base transition-all duration-300">
                <Crown className="w-5 h-5 mr-2 text-[#55B510]" /> প্ল্যানসমূহ দেখুন (৳৫০০ থেকে)
              </Button>
            </Link>
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
              <div className="text-2xl sm:text-4xl font-black text-[#063B2A]">৳৫০০ / মাস</div>
              <div className="text-[11px] sm:text-xs text-[#66736C] font-bold uppercase tracking-wider mt-1">বেসিক শপ প্যাকেজ</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-4xl font-black text-[#55B510]">৯৯.৯%</div>
              <div className="text-[11px] sm:text-xs text-[#66736C] font-bold uppercase tracking-wider mt-1">সার্ভার আপটাইম</div>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Plan Spotlight Banner (৳500) */}
      <section className="py-12 bg-[#063B2A] text-white border-b border-[#0b4d37]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-[#04281c] rounded-3xl p-6 sm:p-10 border border-[#55B510]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <Badge className="bg-[#55B510] text-white px-3.5 py-1 text-xs font-black uppercase tracking-wider">
                👑 Basic Full Store Package
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                মাত্র ৳৫০০ টাকায় ই-কমার্স স্টোরের সব সুবিধা!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
                স্টোর রেজিস্ট্রেশন সম্পূর্ণ ফ্রী। দোকান লাইভ করতে বিকাশ/নগদ থেকে মাত্র ৳৫০০ পেমেন্ট করুন। অ্যাডমিন অনুমোদনের সাথে সাথে আপনার শপ লাইভ হয়ে যাবে।
              </p>
            </div>
            <div className="shrink-0 text-center">
              <div className="text-4xl font-black text-[#55B510] mb-1">৳৫০০</div>
              <div className="text-xs text-emerald-200/80 mb-4 font-bold">প্রতি মাসে / বেসিক প্যাকেজ</div>
              <Link
                href="/register?plan=basic"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#55B510] hover:bg-[#489d0d] text-white font-black text-xs rounded-xl shadow-xl shadow-[#55B510]/30 transition transform hover:scale-105"
              >
                এখনই ফ্রী স্টোর খুলুন <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
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
              আপনার ই-কমার্স ব্যবসার প্রয়োজনীয় সেরা ফিচারসমূহ
            </h2>
            <p className="text-[#66736C] text-xs sm:text-base">
              বাংলাদেশের সেরা অনলাইন মার্চেন্টদের পছন্দের সবচেয়ে কার্যকরী ই-কমার্স ফিচার ইন্টিগ্রেশন।
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 border border-[#DCE7DF] shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7DF] flex items-center justify-center text-[#55B510]">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#063B2A]">১-ক্লিক হোয়াটসঅ্যাপ অর্ডার</h3>
              <p className="text-[#66736C] text-xs leading-relaxed">
                কাস্টমার প্রোডাক্ট পেজ থেকে সিলেক্ট করা সাইজ, কালার ও ঠিকানা সহ ১-ক্লিকে সরাসরি আপনার হোয়াটসঅ্যাপে কাস্টম অর্ডার মেসেজ পাঠাতে পারবে।
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 border border-[#DCE7DF] shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7DF] flex items-center justify-center text-[#55B510]">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#063B2A]">পাঠাও ও স্টিডফাস্ট কুরিয়ার API</h3>
              <p className="text-[#66736C] text-xs leading-relaxed">
                অর্ডার আসা মাত্র মার্চেন্ট ড্যাশবোর্ড থেকে ১-ক্লিকে পাঠাও ও স্টিডফাস্ট কুরিয়ারে পার্সেল বুক করুন এবং কাস্টমারকে অটো ট্র্যাকিং কোড পাঠান।
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 border border-[#DCE7DF] shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7DF] flex items-center justify-center text-[#55B510]">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#063B2A]">ম্যানুয়াল বিকাশ পেমেন্ট ও COD</h3>
              <p className="text-[#66736C] text-xs leading-relaxed">
                স্টোর অ্যাক্টিভ করার জন্য সহজ বিকাশ/নগদ (TrxID) সাবমিশন এবং আপনার স্টোর কাস্টমারদের জন্য ক্যাশ অন ডেলিভারি (COD) চেকআউট।
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 border border-[#DCE7DF] shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7DF] flex items-center justify-center text-[#55B510]">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#063B2A]">সাইজ ও কালার ভ্যারিয়েন্ট সাপোর্ট</h3>
              <p className="text-[#66736C] text-xs leading-relaxed">
                ফ্যাশন ও ক্লথিং প্রোডাক্টের জন্য আলাদা সাইজ (S, M, L, XL, XXL) এবং কালার অপশন যুক্ত করে স্টক ও প্রাইসিং সেট করতে পারবেন।
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 border border-[#DCE7DF] shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7DF] flex items-center justify-center text-[#55B510]">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#063B2A]">নিখুঁত নিট প্রফিট ক্যালকুলেটর</h3>
              <p className="text-[#66736C] text-xs leading-relaxed">
                ক্রয় মূল্যের সাথে বিক্রি মূল্য, কুরিয়ার চার্জ ও ডিসকাউন্ট হিসেব করে ড্যাশবোর্ডে প্রতিদিনের আসল নিট প্রফিট লাইভ দেখতে পাবেন।
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 border border-[#DCE7DF] shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7DF] flex items-center justify-center text-[#55B510]">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#063B2A]">কাস্টম ডোমেইন ম্যাপিং (.com)</h3>
              <p className="text-[#66736C] text-xs leading-relaxed">
                আপনার নিজস্ব ব্র্যান্ডেড ডোমেইন (`yourbrand.com` বা `.com.bd`) সহজেই কানেক্ট করার অল-ইন-ওয়ান ডোমেইন ম্যাপিং সিস্টেম।
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
              বাস্তব ই-কমার্স শপের চমৎকার লেআউট
            </h2>
            <p className="text-[#66736C] text-xs sm:text-base">
              আপনার কাস্টমাররা যেভাবে আপনার শপ থেকে অর্ডার করবেন তার একটি বাস্তবসম্মত ডেমো প্রিভিউ।
            </p>
          </div>

          <div className="bg-[#F6FAF4] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl border border-[#DCE7DF]">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                <div className="inline-flex items-center space-x-2 bg-[#EAF7DF] border border-[#55B510]/30 px-3.5 py-1 rounded-full text-xs font-extrabold text-[#063B2A]">
                  <Sparkles className="w-3.5 h-3.5 text-[#55B510]" /> Premium Storefront Layout
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

      {/* 4 Multi-tier Subscription Pricing Grid */}
      <section id="pricing" className="py-16 sm:py-24 bg-[#F6FAF4] border-t border-[#DCE7DF] relative">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <Badge className="bg-[#EAF7DF] text-[#063B2A] border border-[#55B510]/30 mb-3 px-4 py-1.5 rounded-full font-bold">
              💎 Flexible Subscription Plans
            </Badge>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#063B2A] mb-3 sm:mb-4">
              আপনার ব্যবসার জন্য বেছে নিন সঠিক প্ল্যান
            </h2>
            <p className="text-[#66736C] text-xs sm:text-base">
              কোনো লুকানো চার্জ নেই। সাশ্রয়ী সাবস্ক্রিপশনে আপনার ই-কমার্স ব্যবসা বড় করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* 1. Basic Plan (৳500) */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE7DF] shadow-xl flex flex-col justify-between hover:-translate-y-1.5 transition duration-300">
              <div>
                <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200 mb-2">
                  Full Store Package
                </span>
                <h3 className="text-xl font-bold text-[#063B2A]">Basic</h3>
                <p className="text-xs text-[#66736C] mt-1">নতুন অনলাইন শপের জন্য সহজ প্যাকেজ।</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#063B2A]">৳৫০০</span>
                  <span className="text-xs text-[#66736C] font-semibold">/ প্রতি মাস</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-xs text-[#17221D]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>৫০টি প্রোডাক্ট লিমিট</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>ফ্রি Nabrijan সাবডোমেইন</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>পাঠাও ও স্টিডফাস্ট কুরিয়ার</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>১-ক্লিক বিকাশ/নগদ পেমেন্ট</span>
                  </li>
                </ul>
              </div>
              <Link href="/register?plan=basic" className="mt-6 block">
                <Button className="w-full bg-[#063B2A] hover:bg-[#04281c] text-white font-bold text-xs rounded-xl py-3">
                  শুরু করুন →
                </Button>
              </Link>
            </div>

            {/* 2. Starter Plan (৳599) */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE7DF] shadow-xl flex flex-col justify-between hover:-translate-y-1.5 transition duration-300">
              <div>
                <h3 className="text-xl font-bold text-[#063B2A]">Starter</h3>
                <p className="text-xs text-[#66736C] mt-1">ক্রমবর্ধমান ব্যবসায়ী মার্চেন্টদের জন্য।</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#063B2A]">৳৫৯৯</span>
                  <span className="text-xs text-[#66736C] font-semibold">/ প্রতি মাস</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-xs text-[#17221D]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>৫০০টি প্রোডাক্ট আপলোড</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>কাস্টম ডোমেইন ম্যাপিং</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>আনলিমিটেড ফ্রি থিম</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>সেলস ও অ্যানালিটিক্স রিপোর্ট</span>
                  </li>
                </ul>
              </div>
              <Link href="/register?plan=starter" className="mt-6 block">
                <Button className="w-full bg-[#063B2A] hover:bg-[#04281c] text-white font-bold text-xs rounded-xl py-3">
                  শুরু করুন →
                </Button>
              </Link>
            </div>

            {/* 3. Pro Plan (৳1,099 - Most Popular) */}
            <div className="bg-[#063B2A] text-white rounded-3xl p-6 border-2 border-[#55B510] shadow-2xl flex flex-col justify-between relative lg:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#55B510] text-white px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow">
                ⭐ Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mt-1">Pro</h3>
                <p className="text-xs text-emerald-200 mt-1">পাওয়ার সেলার ই-কমার্স ব্র্যান্ডের জন্য।</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#55B510]">৳১,০৯৯</span>
                  <span className="text-xs text-emerald-200 font-semibold">/ প্রতি মাস</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-xs text-emerald-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>২,০০০টি প্রোডাক্ট আপলোড</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>ভিজ্যুয়াল థিম বিল্ডার</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>কাস্টম ডোমেইন ম্যাপিং</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>১০টি স্টাফ একাউন্ট</span>
                  </li>
                </ul>
              </div>
              <Link href="/register?plan=pro" className="mt-6 block">
                <Button className="w-full bg-[#55B510] hover:bg-[#489d0d] text-white font-black text-xs rounded-xl py-3 shadow-lg">
                  শুরু করুন →
                </Button>
              </Link>
            </div>

            {/* 4. Growth Plan (৳2,499) */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE7DF] shadow-xl flex flex-col justify-between hover:-translate-y-1.5 transition duration-300">
              <div>
                <h3 className="text-xl font-bold text-[#063B2A]">Growth</h3>
                <p className="text-xs text-[#66736C] mt-1">বড় ও স্কেলিং ব্র্যান্ডের জন্য।</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#063B2A]">৳২,৪৯৯</span>
                  <span className="text-xs text-[#66736C] font-semibold">/ প্রতি মাস</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-xs text-[#17221D]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>আনলিমিটেড প্রোডাক্ট আপলোড</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>৫০টি স্টাফ একাউন্ট</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>প্রাইওরিটি ২৪/৭ সাপোর্ট</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>১০টি মাল্টি-স্টোর ম্যানেজার</span>
                  </li>
                </ul>
              </div>
              <Link href="/register?plan=growth" className="mt-6 block">
                <Button className="w-full bg-[#063B2A] hover:bg-[#04281c] text-white font-bold text-xs rounded-xl py-3">
                  শুরু করুন →
                </Button>
              </Link>
            </div>

          </div>

          <div className="text-center mt-12">
            <Link href="/pricing" className="inline-flex items-center text-xs sm:text-sm font-bold text-[#55B510] hover:underline">
              সকল ফিচারের বিস্তারিত তুলনা দেখুন <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-16 sm:py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center max-w-xl mx-auto mb-12">
            <Badge className="bg-[#EAF7DF] text-[#063B2A] border border-[#55B510]/30 mb-3 px-4 py-1 rounded-full font-bold">
              <HelpCircle className="w-4 h-4 mr-1.5 inline text-[#55B510]" /> Frequently Asked Questions
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#063B2A] mb-3">
              সাধারণ জিজ্ঞাসা ও উত্তর
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-[#F6FAF4] p-5 sm:p-6 rounded-2xl border border-[#DCE7DF] space-y-2">
              <h3 className="font-bold text-[#063B2A] text-sm sm:text-base">১. আমি কি ফ্রিতে স্টোর তৈরি করতে পারবো?</h3>
              <p className="text-xs text-[#66736C] leading-relaxed">
                হ্যাঁ! রেজিস্ট্রেশন করে ১০০% বিনামূল্যে আপনার স্টোর সাজাতে, থিম কাস্টমাইজ করতে ও প্রোডাক্ট আপলোড করতে পারবেন। দোকান লাইভ করার সিদ্ধান্ত নিলে পছন্দমত প্ল্যান সিলেক্ট করে বিকাশ/নগদ পেমেন্ট করতে পারবেন।
              </p>
            </div>

            <div className="bg-[#F6FAF4] p-5 sm:p-6 rounded-2xl border border-[#DCE7DF] space-y-2">
              <h3 className="font-bold text-[#063B2A] text-sm sm:text-base">২. স্টোর কিভাবে লাইভ (Active) করবো?</h3>
              <p className="text-xs text-[#66736C] leading-relaxed">
                মার্চেন্ট ড্যাশবোর্ডের Billing পেজে গিয়ে আমাদের নির্ধারিত বিকাশ বা নগদ নম্বরে সেন্ড মানি করে ট্রানজেকশন ID (TrxID) সাবমিট করলেই অ্যাডমিন দ্রুত ভেরিফাই করে স্টোর লাইভ করে দেবে।
              </p>
            </div>

            <div className="bg-[#F6FAF4] p-5 sm:p-6 rounded-2xl border border-[#DCE7DF] space-y-2">
              <h3 className="font-bold text-[#063B2A] text-sm sm:text-base">৩. প্রোডাক্টে সাইজ এবং কালার যুক্ত করা যাবে কি?</h3>
              <p className="text-xs text-[#66736C] leading-relaxed">
                হ্যাঁ! মার্চেন্ট ড্যাশবোর্ড থেকে নতুন প্রোডাক্ট যুক্ত করার সময় সিলেক্টেবল সাইজ (S, M, L, XL, XXL) এবং কালার অপশন যুক্ত করে স্টক ও প্রাইসিং নির্ধারণ করতে পারবেন।
              </p>
            </div>

            <div className="bg-[#F6FAF4] p-5 sm:p-6 rounded-2xl border border-[#DCE7DF] space-y-2">
              <h3 className="font-bold text-[#063B2A] text-sm sm:text-base">৪. কাস্টম ডোমেইন (`yourbrand.com`) যুক্ত করা যাবে?</h3>
              <p className="text-xs text-[#66736C] leading-relaxed">
                হ্যাঁ! Starter, Pro এবং Growth প্ল্যানে আপনার নিজস্ব ডোমেইন (`.com`, `.com.bd` ইত্যাদি) কানেক্ট করার সম্পূর্ণ ব্যবস্থা রয়েছে।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#0b4d37] py-10 sm:py-14 bg-[#063B2A] text-emerald-100 text-xs">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 sm:gap-10 mb-8 sm:mb-10">
            <div className="space-y-3">
              <Link href="/" className="inline-block">
                <img
                  src={logoUrl}
                  alt="Nabrijan - Build Your Online Store"
                  className="h-10 sm:h-12 w-auto object-contain bg-white/95 p-1 rounded-xl shadow-md"
                />
              </Link>
              <p className="text-emerald-200/80 text-xs leading-relaxed max-w-sm">
                বাংলাদেশের ই-কমার্স মার্চেন্টদের জন্য দ্রুততম, নিরাপদ ও আধুনিক ই-কমার্স SaaS বিল্ডার প্ল্যাটফর্ম।
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
              <p><Link href="/register" className="hover:text-[#55B510] transition">ফ্রি একাউন্ট খুলুন</Link></p>
              <p><Link href="/pricing" className="hover:text-[#55B510] transition">প্যাকেজ ডিটেইলস (৳৫০০ থেকে)</Link></p>
              <p><Link href="/store/nabrijan-official" target="_blank" className="hover:text-[#55B510] transition">অফিসিয়াল ডেমো শপ</Link></p>
            </div>
          </div>

          <div className="border-t border-[#0b4d37] pt-6 sm:pt-8 text-center text-[11px] text-emerald-300/70 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>© {new Date().getFullYear()} Nabrijan (Build Your Online Store). All rights reserved.</div>
            <div className="flex items-center space-x-3 text-emerald-300/70">
              <span>Security Audited</span>
              <span>•</span>
              <span>24/7 SaaS Platform</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Realtime Floating Live Support Chat Widget */}
      <LiveChatWidget />
    </div>
  );
}
