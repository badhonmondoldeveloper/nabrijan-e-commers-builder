import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, ArrowRight, Sparkles, Zap, Shield, Crown } from 'lucide-react';
import { db } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function SaaSMarketingPricingPage() {
  let settings = null;
  try {
    settings = await db.platformSettings.findUnique({ where: { id: 'default' } });
  } catch (e) {
    // fallback
  }

  const freePrice = settings?.freePrice !== undefined ? Number(settings.freePrice) : 0;
  const starterPrice = settings?.starterPrice !== undefined ? Number(settings.starterPrice) : 599;
  const proPrice = settings?.proPrice !== undefined ? Number(settings.proPrice) : 1099;
  const growthPrice = settings?.growthPrice !== undefined ? Number(settings.growthPrice) : 2499;

  return (
    <div className="min-h-screen bg-[#F6FAF4] text-[#17221D] flex flex-col font-sans">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-[#DCE7DF] shadow-sm">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <img src="/images/logo.png" alt="Nabrijan - Build Your Online Store" className="h-10 sm:h-12 w-auto object-contain" />
          </Link>
          <Link href="/" className="inline-flex items-center text-xs font-bold text-[#063B2A] hover:text-[#55B510] transition">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 sm:py-16 max-w-6xl flex-1 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="outline" className="border-[#55B510]/40 text-[#063B2A] bg-[#EAF7DF] px-3.5 py-1 rounded-full text-xs uppercase font-extrabold">
            ⚡ Nabrijan SaaS Subscription Engine
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#063B2A]">Choose the Right Plan for Your Store</h1>
          <p className="text-[#66736C] text-sm sm:text-base">
            Transparent Bangladesh pricing with 0% hidden fees, automatic courier booking, and bKash/Nagad/COD checkout.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Free Plan */}
          <Card className="bg-white border-[#DCE7DF] text-[#17221D] flex flex-col justify-between shadow-md hover:shadow-xl transition">
            <CardHeader className="p-5">
              <CardTitle className="text-lg flex items-center gap-2 text-[#063B2A]">
                <Zap className="w-4 h-4 text-[#55B510]" /> Free Plan
              </CardTitle>
              <CardDescription className="text-[#66736C] text-xs">For testing & initial launch</CardDescription>
              <div className="mt-4 text-3xl font-black text-[#063B2A]">
                ৳{freePrice} <span className="text-xs text-[#66736C] font-normal">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2.5 text-xs text-[#17221D]">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> Up to 20 Products</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> Preset Themes</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> 1-Click WhatsApp Order</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> COD Checkout Engine</div>
            </CardContent>
            <div className="p-5 pt-0">
              <Link href="/register?plan=free">
                <Button className="w-full bg-[#063B2A] hover:bg-[#04281c] text-white text-xs font-bold h-10">Start Free</Button>
              </Link>
            </div>
          </Card>

          {/* Starter Plan */}
          <Card className="bg-white border-[#DCE7DF] text-[#17221D] flex flex-col justify-between shadow-md hover:shadow-xl transition">
            <CardHeader className="p-5">
              <CardTitle className="text-lg flex items-center gap-2 text-[#063B2A]">
                <Shield className="w-4 h-4 text-[#55B510]" /> Starter Plan
              </CardTitle>
              <CardDescription className="text-[#66736C] text-xs">For small retail businesses</CardDescription>
              <div className="mt-4 text-3xl font-black text-[#55B510]">
                ৳{starterPrice.toLocaleString()} <span className="text-xs text-[#66736C] font-normal">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2.5 text-xs text-[#17221D]">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> Up to 500 Products</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> 0% Physical Order Fee</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> Sales Report Exports</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> Courier API Booking</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> 2 Staff Accounts</div>
            </CardContent>
            <div className="p-5 pt-0">
              <Link href="/register?plan=starter">
                <Button className="w-full bg-[#55B510] hover:bg-[#489d0d] text-white text-xs font-bold h-10">Select Starter</Button>
              </Link>
            </div>
          </Card>

          {/* Pro Plan - Highlighted */}
          <Card className="bg-white border-2 border-[#55B510] text-[#17221D] flex flex-col justify-between relative shadow-2xl bg-gradient-to-b from-white to-[#EAF7DF]/30">
            <div className="absolute -top-3.5 right-4 bg-[#55B510] text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              Most Popular
            </div>
            <CardHeader className="p-5">
              <CardTitle className="text-lg flex items-center gap-2 text-[#063B2A]">
                <Sparkles className="w-4 h-4 text-[#55B510]" /> Pro Plan
              </CardTitle>
              <CardDescription className="text-[#66736C] text-xs">For growing online brands</CardDescription>
              <div className="mt-4 text-3xl font-black text-[#55B510]">
                ৳{proPrice.toLocaleString()} <span className="text-xs text-[#66736C] font-normal">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2.5 text-xs text-[#17221D]">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> Up to 2,000 Products</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> Custom Domain Mapping</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> Visual Theme Builder</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> Size & Color Variants</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> Automated Cart Recovery</div>
            </CardContent>
            <div className="p-5 pt-0">
              <Link href="/register?plan=pro">
                <Button className="w-full bg-[#55B510] hover:bg-[#489d0d] text-white text-xs font-black h-10 shadow-md">
                  Select Pro Plan
                </Button>
              </Link>
            </div>
          </Card>

          {/* Growth Plan */}
          <Card className="bg-white border-[#DCE7DF] text-[#17221D] flex flex-col justify-between shadow-md hover:shadow-xl transition">
            <CardHeader className="p-5">
              <CardTitle className="text-lg flex items-center gap-2 text-[#063B2A]">
                <Crown className="w-4 h-4 text-[#55B510]" /> Growth Plan
              </CardTitle>
              <CardDescription className="text-[#66736C] text-xs">High-volume brands & agencies</CardDescription>
              <div className="mt-4 text-3xl font-black text-[#063B2A]">
                ৳{growthPrice.toLocaleString()} <span className="text-xs text-[#66736C] font-normal">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2.5 text-xs text-[#17221D]">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> Unlimited Products</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> Unlimited Stores & Staff</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> All Logistics APIs (Pathao/Steadfast)</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> Real-time Net Profit Reports</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-[#55B510] mr-2 shrink-0" /> VIP Dedicated Support</div>
            </CardContent>
            <div className="p-5 pt-0">
              <Link href="/register?plan=growth">
                <Button className="w-full bg-[#063B2A] hover:bg-[#04281c] text-white text-xs font-bold h-10">Select Growth Plan</Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
