import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, ArrowRight, Sparkles, Zap, Shield, Crown } from 'lucide-react';
import { db } from '@/lib/db/prisma';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>
          <span className="font-bold text-white text-lg">Subscription Pricing</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-6xl flex-1 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 px-3.5 py-1 rounded-full text-xs uppercase font-semibold">
            ⚡ ZatiqEasy Compatible Pricing Engine
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Choose the Right Plan for Your Store</h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Transparent Bangladesh pricing with 0% hidden fees, automatic courier booking, and bKash/Nagad/COD checkout.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Free Plan */}
          <Card className="bg-slate-900 border-slate-800 text-white flex flex-col justify-between hover:border-slate-700 transition">
            <CardHeader className="p-5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-400" /> Free Plan
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">For quick trial & store testing</CardDescription>
              <div className="mt-4 text-3xl font-extrabold text-white">
                ৳{freePrice} <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-slate-400 mr-2 shrink-0" /> Up to 20 Products</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-slate-400 mr-2 shrink-0" /> Preset Themes</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-slate-400 mr-2 shrink-0" /> 1-Click WhatsApp Order</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-slate-400 mr-2 shrink-0" /> COD Checkout Engine</div>
              <div className="text-[11px] text-amber-400/90 pt-1 font-mono">Fee: 5% Physical / 10% Digital</div>
            </CardContent>
            <div className="p-5 pt-0">
              <Link href="/register?plan=free">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold h-10">Start Free</Button>
              </Link>
            </div>
          </Card>

          {/* Starter Plan */}
          <Card className="bg-slate-900 border-slate-800 text-white flex flex-col justify-between hover:border-blue-500/50 transition">
            <CardHeader className="p-5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" /> Starter Plan
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">For small retail businesses</CardDescription>
              <div className="mt-4 text-3xl font-extrabold text-blue-400">
                ৳{starterPrice.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> Up to 500 Products</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> 0% Physical Order Fee</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> Sales Report Exports</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> Courier API Booking</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2 shrink-0" /> 2 Staff Accounts</div>
            </CardContent>
            <div className="p-5 pt-0">
              <Link href="/register?plan=starter">
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold h-10">Select Starter</Button>
              </Link>
            </div>
          </Card>

          {/* Pro Plan - Highlighted */}
          <Card className="bg-slate-900 border-2 border-indigo-500 text-white flex flex-col justify-between relative shadow-xl shadow-indigo-600/20">
            <div className="absolute -top-3 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <CardHeader className="p-5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Pro Plan
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">For growing online brands</CardDescription>
              <div className="mt-4 text-3xl font-extrabold text-indigo-400">
                ৳{proPrice.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2.5 text-xs text-slate-200">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2 shrink-0" /> Up to 2,000 Products</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2 shrink-0" /> Custom Domain Mapping</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2 shrink-0" /> Visual Theme Builder</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2 shrink-0" /> Size & Color Variants</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2 shrink-0" /> Automated Cart Recovery</div>
            </CardContent>
            <div className="p-5 pt-0">
              <Link href="/register?plan=pro">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black h-10 shadow-lg shadow-indigo-500/30">
                  Select Pro Plan
                </Button>
              </Link>
            </div>
          </Card>

          {/* Growth Plan */}
          <Card className="bg-slate-900 border-slate-800 text-white flex flex-col justify-between hover:border-purple-500/50 transition">
            <CardHeader className="p-5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="w-4 h-4 text-purple-400" /> Growth Plan
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">High-volume brands & agencies</CardDescription>
              <div className="mt-4 text-3xl font-extrabold text-purple-400">
                ৳{growthPrice.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2 shrink-0" /> Unlimited Products</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2 shrink-0" /> Unlimited Stores & Staff</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2 shrink-0" /> All Logistics APIs (Pathao/Steadfast)</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2 shrink-0" /> Real-time Net Profit Reports</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-purple-400 mr-2 shrink-0" /> VIP Dedicated Support</div>
            </CardContent>
            <div className="p-5 pt-0">
              <Link href="/register?plan=growth">
                <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold h-10">Select Growth Plan</Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
