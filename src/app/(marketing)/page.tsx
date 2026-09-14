import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
  Sparkle,
  SlidersHorizontal,
  ArrowUpRight,
  PlayCircle,
  XCircle,
  Minus,
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

  const logoUrl = settings?.logoUrl || '/images/logo.png';
  const bkashNumber = settings?.bkashNumber || '01625642420';
  const whatsappNumber = settings?.whatsappNumber || '+8801625642420';
  const contactPhone = settings?.contactPhone || '+8801625642420';
  const contactEmail = settings?.contactEmail || 'badhonmondoldeveloper@gmail.com';

  const bannerText = settings?.bannerText || '🚀 প্রফেশনাল ই-কমার্স শপ চালু করুন! ফ্রী সেটআপ, ১-ক্লিক হোয়াটসঅ্যাপ অর্ডার ও ডেলিভারি ইন্টিগ্রেশন!';

  return (
    <div className="min-h-screen bg-[#041d14] text-white flex flex-col font-sans selection:bg-[#55B510] selection:text-white overflow-x-hidden max-w-full">
      
      {/* Dynamic Background Glow Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#55B510]/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-[#063B2A]/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-[#55B510]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Top Announcement Bar */}
      <div className="relative z-10 bg-gradient-to-r from-[#063B2A] via-[#0b4d37] to-[#063B2A] text-white text-[11px] sm:text-xs font-bold py-2.5 px-4 text-center tracking-wide border-b border-[#55B510]/30 shadow-lg flex items-center justify-center flex-wrap gap-2">
        <span className="flex items-center gap-1.5 bg-[#55B510]/20 text-[#55B510] px-2.5 py-0.5 rounded-full border border-[#55B510]/30 text-[10px] uppercase font-black">
          <Sparkles className="w-3 h-3 animate-spin" /> Offer
        </span>
        <span>{bannerText}</span>
        <Link href="/register" className="underline font-black text-[#55B510] hover:text-white transition inline-flex items-center ml-1">
          শুরু করুন <ArrowRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>

      {/* Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#041d14]/85 border-b border-emerald-900/40 shadow-2xl transition-all duration-300">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative p-1 rounded-xl bg-white/95 shadow-md transition-transform group-hover:scale-105">
              <img
                src={logoUrl}
                alt="Nabrijan - Build Your Online Store"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-black uppercase tracking-widest text-emerald-200/70">
            <Link href="#features" className="hover:text-[#55B510] transition duration-200">ফিচারসমূহ</Link>
            <Link href="#how-it-works" className="hover:text-[#55B510] transition duration-200">কিভাবে কাজ করে</Link>
            <Link href="#demo" className="hover:text-[#55B510] transition duration-200">লাইভ ডেমো</Link>
            <Link href="#pricing" className="hover:text-[#55B510] transition duration-200">প্যাকেজসমূহ (৳৫৯৯ থেকে)</Link>
            <Link href="#faq" className="hover:text-[#55B510] transition duration-200">FAQ</Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="text-emerald-100 hover:text-white hover:bg-emerald-900/40 text-xs font-bold px-3.5 sm:px-4 py-2 rounded-xl">
                লগইন
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#55B510] hover:bg-[#479b0d] text-white text-[11px] sm:text-xs font-black shadow-lg shadow-[#55B510]/30 rounded-xl px-4 sm:px-6 py-2.5 transition duration-300 transform hover:scale-105">
                ⚡ ফ্রি দোকান তৈরি করুন
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Ultra-Premium Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-32 z-10 overflow-hidden">
        <div className="container mx-auto px-4 text-center max-w-5xl relative">
          
          {/* Glowing Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/50 border border-[#55B510]/40 text-[#55B510] text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-xl mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#55B510] animate-pulse" />
            <span>বাংলাদেশের অল-ইন-ওয়ান ই-কমার্স SaaS প্ল্যাটফর্ম</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 sm:mb-8 leading-[1.15] text-white">
            কোডিং ছাড়াই ২ মিনিটে খুলুন <br />
            <span className="bg-gradient-to-r from-[#55B510] via-emerald-300 to-[#55B510] bg-clip-text text-transparent underline decoration-[#55B510]/40 underline-offset-8">
              আপনার অনলাইন ই-কমার্স দোকান
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-xl text-emerald-100/80 mb-8 sm:mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            ১-ক্লিক হোয়াটসঅ্যাপ অর্ডার, পণ্য ভ্যারিয়েন্ট (সাইজ/কালার), পাঠাও ও স্টিডফাস্ট অটো বুকিং এবং বিকাশ/নগদ পেমেন্ট ভেরিফিকেশনে আজই আপনার শপ চালু করুন!
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 sm:mb-20 max-w-md sm:max-w-none mx-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-13 sm:h-15 px-8 sm:px-12 bg-[#55B510] hover:bg-[#479b0d] text-white font-black rounded-2xl shadow-2xl shadow-[#55B510]/40 text-sm sm:text-base transition-all duration-300 transform hover:scale-[1.03]">
                🚀 সম্পূর্ণ বিনামূল্যে শপ তৈরি করুন <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/store/nabrijan-official" target="_blank" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-13 sm:h-15 px-7 sm:px-9 border-emerald-700/80 bg-emerald-950/60 text-emerald-100 hover:bg-emerald-900/80 font-bold rounded-2xl text-sm sm:text-base transition-all duration-300 backdrop-blur-md">
                <PlayCircle className="w-5 h-5 mr-2 text-[#55B510]" /> লাইভ ডেমো শপ দেখুন
              </Button>
            </Link>
          </div>

          {/* Real-time Sales Counter Notification Badge */}
          <div className="inline-flex items-center gap-3 bg-emerald-950/80 border border-emerald-800/80 px-4 py-2 rounded-2xl text-xs text-emerald-200 shadow-xl mb-12 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55B510] animate-ping shrink-0"></span>
            <span>🔥 নতুন অর্ডার: <strong>মিরপুর, ঢাকা</strong> থেকে বিকাশ COD অর্ডারের পার্সেল বুকিং করা হয়েছে!</span>
          </div>

          {/* Hero Live Mockup Showcase Box */}
          <div className="relative rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-emerald-900/40 via-emerald-950/60 to-[#041d14] border border-emerald-800/60 shadow-2xl backdrop-blur-xl">
            <div className="rounded-2xl bg-[#06261a] border border-emerald-900/80 overflow-hidden shadow-inner">
              {/* Browser Bar */}
              <div className="bg-[#031710] px-4 py-3 flex items-center justify-between border-b border-emerald-900/60">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="bg-emerald-950/80 text-emerald-300/80 text-[11px] font-mono px-4 py-1 rounded-full border border-emerald-800/50 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#55B510]" /> https://yourbrand.nabrijan.site
                </div>
                <Badge className="bg-[#55B510]/20 text-[#55B510] border border-[#55B510]/40 text-[10px]">LIVE STORE</Badge>
              </div>

              {/* Mockup Store Content */}
              <div className="p-6 sm:p-10 text-left grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-4">
                  <Badge className="bg-[#55B510] text-white font-black text-xs">⚡ Featured Product</Badge>
                  <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                    Premium Handcrafted Panjabi Collection
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                    ১০০% পিওর কটন ফেব্রিক, এক্সক্লুসিভ এম্ব্রয়ডারি ডিজাইন। সমগ্র বাংলাদেশে পাঠাও ও স্টিডফাস্ট কুরিয়ারে ক্যাশ অন ডেলিভারি শিপিং।
                  </p>
                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="text-2xl sm:text-3xl font-black text-[#55B510]">৳২,২৫০</span>
                    <span className="text-sm text-emerald-400/60 line-through">৳২,৮০০</span>
                    <span className="text-xs bg-emerald-900 text-[#55B510] font-bold px-2.5 py-1 rounded-full border border-[#55B510]/30">-20% OFF</span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Select Size</div>
                    <div className="flex gap-2">
                      {['M', 'L', 'XL', 'XXL'].map((sz, idx) => (
                        <button key={sz} className={`px-3.5 py-1.5 text-xs font-extrabold rounded-lg border transition ${idx === 1 ? 'bg-[#55B510] text-white border-[#55B510]' : 'bg-emerald-950 text-emerald-200 border-emerald-800'}`}>
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 bg-[#55B510] hover:bg-[#479b0d] text-white font-black text-xs py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2">
                      <ShoppingBag className="w-4 h-4" /> Order Now (Cash on Delivery)
                    </button>
                    <button className="bg-emerald-900/80 hover:bg-emerald-800 text-white font-bold text-xs py-3.5 px-5 rounded-xl border border-emerald-700 flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#55B510]" /> WhatsApp Order
                    </button>
                  </div>
                </div>

                <div className="md:col-span-5 bg-gradient-to-b from-emerald-900/30 to-emerald-950/60 p-5 rounded-2xl border border-emerald-800/60 text-center space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80"
                    alt="Store Product Mockup"
                    className="w-full h-48 sm:h-56 object-cover rounded-xl shadow-md border border-emerald-800/40"
                  />
                  <div className="text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2">
                    <Truck className="w-4 h-4 text-[#55B510]" /> Pathao & Steadfast Auto Booking Connected
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-emerald-950/60 rounded-3xl border border-emerald-800/60 backdrop-blur-md shadow-2xl">
            <div className="p-3 border-r border-b sm:border-b-0 border-emerald-800/60">
              <div className="text-3xl sm:text-4xl font-black text-[#55B510]">500+</div>
              <div className="text-xs text-emerald-300/80 font-bold uppercase tracking-wider mt-1">সক্রিয় মার্চেন্ট শপ</div>
            </div>
            <div className="p-3 sm:border-r border-b sm:border-b-0 border-emerald-800/60">
              <div className="text-3xl sm:text-4xl font-black text-white">৳১ কোটি+</div>
              <div className="text-xs text-emerald-300/80 font-bold uppercase tracking-wider mt-1">মোট অর্ডার ভলিউম</div>
            </div>
            <div className="p-3 border-r border-emerald-800/60">
              <div className="text-3xl sm:text-4xl font-black text-[#55B510]">৳৫৯৯ / মাস</div>
              <div className="text-xs text-emerald-300/80 font-bold uppercase tracking-wider mt-1">স্টার্টার প্যাকেজ প্রাইস</div>
            </div>
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-white">৯৯.৯%</div>
              <div className="text-xs text-emerald-300/80 font-bold uppercase tracking-wider mt-1">সার্ভার আপটাইম</div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works (৩টি সহজ ধাপে দোকান তৈরি) */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-[#031710] border-y border-emerald-900/60 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge className="bg-[#55B510]/20 text-[#55B510] border border-[#55B510]/40 mb-3 px-4 py-1 rounded-full font-black uppercase text-[11px]">
              🚀 Easy 3-Step Setup
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              ৩টি সহজ ধাপে চালু করুন আপনার অনলাইন শপ
            </h2>
            <p className="text-emerald-200/70 text-sm sm:text-base">
              কোনো টেকনিক্যাল জ্ঞান ছাড়াই ২ মিনিটে আপনার শপ তৈরি করে বিক্রি শুরু করুন।
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-emerald-950/60 p-8 rounded-3xl border border-emerald-800/60 space-y-4 hover:-translate-y-2 transition duration-300 relative overflow-hidden group">
              <div className="text-5xl font-black text-[#55B510]/30 absolute top-4 right-6 group-hover:text-[#55B510]/50 transition">01</div>
              <div className="w-14 h-14 rounded-2xl bg-[#55B510]/20 flex items-center justify-center text-[#55B510] border border-[#55B510]/30 shadow-inner">
                <UserPlus className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">১. ফ্রি একাউন্ট রেজিস্ট্রেশন</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                আপনার নাম, ইমেইল ও পাসওয়ার্ড দিয়ে ১০০% ফ্রীতে আপনার শপ রেজিস্টার করুন। কোনো ক্রেডিট কার্ড লাগে না।
              </p>
            </div>

            <div className="bg-emerald-950/60 p-8 rounded-3xl border border-emerald-800/60 space-y-4 hover:-translate-y-2 transition duration-300 relative overflow-hidden group">
              <div className="text-5xl font-black text-[#55B510]/30 absolute top-4 right-6 group-hover:text-[#55B510]/50 transition">02</div>
              <div className="w-14 h-14 rounded-2xl bg-[#55B510]/20 flex items-center justify-center text-[#55B510] border border-[#55B510]/30 shadow-inner">
                <PackagePlus className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">২. প্রোডাক্ট ও ভ্যারিয়েন্ট যুক্ত করুন</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                আপনার প্রোডাক্টের ছবি, সাইজ, কালার অপশন ও স্টক আপলোড করুন। থিম কালার ও ব্যানার কাস্টমাইজ করুন।
              </p>
            </div>

            <div className="bg-emerald-950/60 p-8 rounded-3xl border border-emerald-800/60 space-y-4 hover:-translate-y-2 transition duration-300 relative overflow-hidden group">
              <div className="text-5xl font-black text-[#55B510]/30 absolute top-4 right-6 group-hover:text-[#55B510]/50 transition">03</div>
              <div className="w-14 h-14 rounded-2xl bg-[#55B510]/20 flex items-center justify-center text-[#55B510] border border-[#55B510]/30 shadow-inner">
                <Rocket className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">৩. শপ অ্যাক্টিভ করে অর্ডার নিন</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                বিকাশ/নগদ থেকে সাবস্ক্রিপশন পেমেন্ট সাবমিট করে শপ লাইভ করুন এবং কাস্টমারদের থেকে অর্ডার নেওয়া শুরু করুন!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-16 sm:py-24 z-10 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge className="bg-[#55B510]/20 text-[#55B510] border border-[#55B510]/40 mb-3 px-4 py-1 rounded-full font-black uppercase text-[11px]">
              ⚡ Platform Features
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              আপনার ব্যবসার প্রয়োজনীয় সব স্মার্ট ফিচার
            </h2>
            <p className="text-emerald-200/70 text-sm sm:text-base">
              বাংলাদেশের সফল অনলাইন মার্চেন্টদের পছন্দের সেরা ই-কমার্স ফিচার ইন্টিগ্রেশন।
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-emerald-950/50 p-7 rounded-3xl border border-emerald-800/50 space-y-3.5 hover:border-[#55B510]/50 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#55B510]/20 flex items-center justify-center text-[#55B510]">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">১-ক্লিক হোয়াটসঅ্যাপ অর্ডার</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                কাস্টমার সিলেক্ট করা সাইজ, কালার ও নাম-ঠিকানা সহ ১-ক্লিকে সরাসরি আপনার হোয়াটসঅ্যাপে কাস্টম অর্ডার পাঠাতে পারবে।
              </p>
            </div>

            <div className="bg-emerald-950/50 p-7 rounded-3xl border border-emerald-800/50 space-y-3.5 hover:border-[#55B510]/50 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#55B510]/20 flex items-center justify-center text-[#55B510]">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">পাঠাও ও স্টিডফাস্ট কুরিয়ার API</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                অর্ডার আসা মাত্র ড্যাশবোর্ড থেকে ১-ক্লিকে পাঠাও ও স্টিডফাস্ট কুরিয়ারে পার্সেল বুক করুন এবং অটো ট্র্যাকিং পান।
              </p>
            </div>

            <div className="bg-emerald-950/50 p-7 rounded-3xl border border-emerald-800/50 space-y-3.5 hover:border-[#55B510]/50 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#55B510]/20 flex items-center justify-center text-[#55B510]">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">বিকাশ / নগদ পেমেন্ট ও COD</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                সহজ বিকাশ ও নগদ (TrxID) পেমেন্ট সাবমিশনে শপ অ্যাক্টিভেশন এবং কাস্টমারদের জন্য ক্যাশ অন ডেলিভারি (COD) চেকআউট।
              </p>
            </div>

            <div className="bg-emerald-950/50 p-7 rounded-3xl border border-emerald-800/50 space-y-3.5 hover:border-[#55B510]/50 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#55B510]/20 flex items-center justify-center text-[#55B510]">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">সাইজ ও কালার ভ্যারিয়েন্ট সাপোর্ট</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                ফ্যাশন ও ক্লথিং প্রোডাক্টের জন্য আলাদা সাইজ (S, M, L, XL, XXL) এবং কালার অপশন যুক্ত করে স্টক নির্ধারণ করুন।
              </p>
            </div>

            <div className="bg-emerald-950/50 p-7 rounded-3xl border border-emerald-800/50 space-y-3.5 hover:border-[#55B510]/50 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#55B510]/20 flex items-center justify-center text-[#55B510]">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">নিখুঁত নিট প্রফিট ক্যালকুলেটর</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                ক্রয় মূল্যের সাথে বিক্রি মূল্য, কুরিয়ার চার্জ ও ডিসকাউন্ট হিসেব করে ড্যাশবোর্ডে প্রতিদিনের আসল নিট প্রফিট লাইভ দেখতে পাবেন।
              </p>
            </div>

            <div className="bg-emerald-950/50 p-7 rounded-3xl border border-emerald-800/50 space-y-3.5 hover:border-[#55B510]/50 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#55B510]/20 flex items-center justify-center text-[#55B510]">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">কাস্টম ডোমেইন কানেক্ট (Pro & Growth)</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Pro এবং Growth প্ল্যানে আপনার নিজস্ব ব্র্যান্ডেড ডোমেইন (`yourbrand.com` বা `.com.bd`) সহজেই কানেক্ট করতে পারবেন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Paid Subscription Pricing Grid (Starter ৳599, Pro ৳1,099, Growth ৳2,499) */}
      <section id="pricing" className="py-16 sm:py-24 bg-[#031710] border-t border-emerald-900/60 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge className="bg-[#55B510]/20 text-[#55B510] border border-[#55B510]/40 mb-3 px-4 py-1 rounded-full font-black uppercase text-[11px]">
              💎 Flexible Pricing Plans
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              আপনার ব্যবসার জন্য বেছে নিন সঠিক প্ল্যান
            </h2>
            <p className="text-emerald-200/70 text-sm sm:text-base">
              কোনো হিডেন ফি নেই। সাশ্রয়ী সাবস্ক্রিপশনে আপনার ব্যবসা পরিচালনা করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            
            {/* 1. Starter Plan (৳599) */}
            <div className="bg-emerald-950/80 rounded-3xl p-7 border border-emerald-800/80 shadow-xl flex flex-col justify-between hover:-translate-y-1.5 transition duration-300">
              <div>
                <h3 className="text-2xl font-bold text-white">Starter</h3>
                <p className="text-xs text-emerald-200/70 mt-1">ছোট ও নতুন মার্চেন্টদের জন্য।</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">৳৫৯৯</span>
                  <span className="text-xs text-emerald-300 font-semibold">/ প্রতি মাস</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-emerald-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>৫০০টি প্রোডাক্ট লিমিট</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>ফ্রি Nabrijan সাবডোমেইন (`name.nabrijan.site`)</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-400/60">
                    <Minus className="w-4 h-4 text-emerald-600 shrink-0 opacity-60" />
                    <span className="line-through">কাস্টম ডোমেইন ম্যাপিং (নট ইনক্লুডেড)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>আনলিমিটেড ফ্রি থিম থিম কাস্টমাইজেশন</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>পাঠাও ও স্টিডফাস্ট কুরিয়ার API</span>
                  </li>
                </ul>
              </div>
              <Link href="/register?plan=starter" className="mt-8 block">
                <Button className="w-full bg-[#55B510] hover:bg-[#479b0d] text-white font-bold text-xs rounded-xl py-3 shadow-md">
                  শুরু করুন →
                </Button>
              </Link>
            </div>

            {/* 2. Pro Plan (৳1,099 - Most Popular) */}
            <div className="bg-gradient-to-b from-[#063B2A] to-[#04281c] text-white rounded-3xl p-7 border-2 border-[#55B510] shadow-2xl flex flex-col justify-between relative md:-translate-y-3">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#55B510] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                ⭐ Most Popular
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mt-1">Pro</h3>
                <p className="text-xs text-emerald-200 mt-1">পাওয়ার সেলার ই-কমার্স ব্র্যান্ডের জন্য।</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#55B510]">৳১,০৯৯</span>
                  <span className="text-xs text-emerald-200 font-semibold">/ প্রতি মাস</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-emerald-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>২,০০০টি প্রোডাক্ট লিমিট</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span className="font-bold text-white">কাস্টম ডোমেইন ম্যাপিং (.com, .bd)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>ভিজ্যুয়াল థিম বিল্ডার</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>১০টি স্টাফ একাউন্ট</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>আনলিমিটেড কুরিয়ার API</span>
                  </li>
                </ul>
              </div>
              <Link href="/register?plan=pro" className="mt-8 block">
                <Button className="w-full bg-[#55B510] hover:bg-[#479b0d] text-white font-black text-xs rounded-xl py-3 shadow-lg">
                  শুরু করুন →
                </Button>
              </Link>
            </div>

            {/* 3. Growth Plan (৳2,499) */}
            <div className="bg-emerald-950/80 rounded-3xl p-7 border border-emerald-800/80 shadow-xl flex flex-col justify-between hover:-translate-y-1.5 transition duration-300">
              <div>
                <h3 className="text-2xl font-bold text-white">Growth</h3>
                <p className="text-xs text-emerald-200/70 mt-1">বড় ও স্কেলিং ব্র্যান্ডের জন্য।</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">৳২,৪৯৯</span>
                  <span className="text-xs text-emerald-300 font-semibold">/ প্রতি মাস</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-emerald-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span>আনলিমিটেড প্রোডাক্ট লিমিট</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510] shrink-0" />
                    <span className="font-bold text-white">কাস্টম ডোমেইন ম্যাপিং (.com, .bd)</span>
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
              <Link href="/register?plan=growth" className="mt-8 block">
                <Button className="w-full bg-[#55B510] hover:bg-[#479b0d] text-white font-bold text-xs rounded-xl py-3 shadow-md">
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
      <section id="faq" className="py-16 sm:py-24 z-10 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <Badge className="bg-[#55B510]/20 text-[#55B510] border border-[#55B510]/40 mb-3 px-4 py-1 rounded-full font-bold">
              <HelpCircle className="w-4 h-4 mr-1.5 inline text-[#55B510]" /> Frequently Asked Questions
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
              সাধারণ জিজ্ঞাসা ও উত্তর
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-950/60 p-5 sm:p-6 rounded-2xl border border-emerald-800/60 space-y-2">
              <h3 className="font-bold text-white text-sm sm:text-base">১. আমি কি ফ্রিতে স্টোর তৈরি করতে পারবো?</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                হ্যাঁ! রেজিস্ট্রেশন করে ১০০% বিনামূল্যে আপনার স্টোর সাজাতে, থিম কাস্টমাইজ করতে ও প্রোডাক্ট আপলোড করতে পারবেন। দোকান লাইভ করার সময় আপনার পছন্দমত প্ল্যান সিলেক্ট করে বিকাশ/নগদ পেমেন্ট করতে পারবেন।
              </p>
            </div>

            <div className="bg-emerald-950/60 p-5 sm:p-6 rounded-2xl border border-emerald-800/60 space-y-2">
              <h3 className="font-bold text-white text-sm sm:text-base">২. স্টোর কিভাবে লাইভ (Active) করবো?</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                মার্চেন্ট ড্যাশবোর্ডের Billing পেজে গিয়ে আমাদের নির্ধারিত বিকাশ বা নগদ নম্বরে সেন্ড মানি করে ট্রানজেকশন ID (TrxID) সাবমিট করলেই অ্যাডমিন দ্রুত ভেরিফাই করে স্টোর লাইভ করে দেবে।
              </p>
            </div>

            <div className="bg-emerald-950/60 p-5 sm:p-6 rounded-2xl border border-emerald-800/60 space-y-2">
              <h3 className="font-bold text-white text-sm sm:text-base">৩. কাস্টম ডোমেইন (`yourbrand.com`) যুক্ত করার নিয়ম কি?</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Pro (৳১,০৯৯) এবং Growth (৳২,৪৯৯) প্ল্যানে আপনার নিজস্ব ডোমেইন (`.com`, `.com.bd` ইত্যাদি) সহজে কানেক্ট করতে পারবেন। Starter (৳৫৯৯) প্ল্যানে ফ্রি সাবডোমেইন (`yourname.nabrijan.site`) ব্যবহার করা যায়।
              </p>
            </div>

            <div className="bg-emerald-950/60 p-5 sm:p-6 rounded-2xl border border-emerald-800/60 space-y-2">
              <h3 className="font-bold text-white text-sm sm:text-base">৪. প্রোডাক্টে সাইজ এবং কালার যুক্ত করা যাবে কি?</h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                হ্যাঁ! মার্চেন্ট ড্যাশবোর্ড থেকে নতুন প্রোডাক্ট যুক্ত করার সময় সিলেক্টেবল সাইজ (S, M, L, XL, XXL) এবং কালার অপশন যুক্ত করে স্টক ও প্রাইসিং নির্ধারণ করতে পারবেন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-emerald-900/60 py-10 sm:py-14 bg-[#031710] text-emerald-100 text-xs z-10 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 sm:gap-10 mb-8 sm:mb-10">
            <div className="space-y-3">
              <Link href="/" className="inline-block">
                <div className="p-1 bg-white/95 rounded-xl inline-block shadow-md">
                  <img
                    src={logoUrl}
                    alt="Nabrijan - Build Your Online Store"
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                </div>
              </Link>
              <p className="text-emerald-200/70 text-xs leading-relaxed max-w-sm">
                বাংলাদেশের ই-কমার্স মার্চেন্টদের জন্য দ্রুততম, নিরাপদ ও আধুনিক ই-কমার্স SaaS বিল্ডার প্ল্যাটফর্ম।
              </p>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="font-bold text-white text-sm font-sans">যোগাযোগ ও সহায়তা</div>
              <p className="flex items-center text-emerald-200">
                <Phone className="w-3.5 h-3.5 mr-2 text-[#55B510]" /> Call: {contactPhone}
              </p>
              <p className="flex items-center text-emerald-200">
                <MessageCircle className="w-3.5 h-3.5 mr-2 text-[#55B510]" /> WhatsApp: {whatsappNumber}
              </p>
              <p className="flex items-center text-emerald-200 font-sans">
                ✉️ Email: {contactEmail}
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white text-sm">গুরুত্বপূর্ণ লিংক</div>
              <p><Link href="/login" className="hover:text-[#55B510] transition">মার্চেন্ট লগইন</Link></p>
              <p><Link href="/register" className="hover:text-[#55B510] transition">ফ্রি একাউন্ট খুলুন</Link></p>
              <p><Link href="/pricing" className="hover:text-[#55B510] transition">প্যাকেজ ডিটেইলস (৳৫৯৯ থেকে)</Link></p>
              <p><Link href="/store/nabrijan-official" target="_blank" className="hover:text-[#55B510] transition">অফিসিয়াল ডেমো শপ</Link></p>
            </div>
          </div>

          <div className="border-t border-emerald-900/60 pt-6 sm:pt-8 text-center text-[11px] text-emerald-400/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>© {new Date().getFullYear()} Nabrijan (Build Your Online Store). All rights reserved.</div>
            <div className="flex items-center space-x-3 text-emerald-400/60">
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
