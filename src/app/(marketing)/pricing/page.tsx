import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { db } from '@/lib/db/prisma';

export const revalidate = 60;

export default async function SaaSMarketingPricingPage() {
  let settings = null;
  try {
    settings = await db.platformSettings.findUnique({ where: { id: 'default' } });
  } catch (e) {
    // fallback
  }

  const starterPrice = settings?.starterPrice !== undefined ? Number(settings.starterPrice) : 990;
  const businessPrice = settings?.businessPrice !== undefined ? Number(settings.businessPrice) : 2490;
  const proPrice = settings?.proPrice !== undefined ? Number(settings.proPrice) : 4990;

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

      <main className="container mx-auto px-4 py-16 max-w-5xl flex-1 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full text-xs uppercase font-semibold">
            Flexible Merchant Plans
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Choose the Perfect Plan for Your Business</h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Transparent pricing with local Cash on Delivery (COD) checkout, ZiniPay billing, and complete store isolation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter */}
          <Card className="bg-slate-900 border-slate-800 text-white flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-xl">Starter Plan</CardTitle>
              <CardDescription className="text-slate-400">For new e-commerce sellers</CardDescription>
              <div className="mt-4 text-3xl font-extrabold">৳{starterPrice.toLocaleString()} <span className="text-sm text-slate-400 font-normal">/ month</span></div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> 1 Active Store</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Up to 100 Products</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> 2 Staff Accounts</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> COD Checkout Engine</div>
            </CardContent>
            <div className="p-6 pt-0">
              <Link href="/register?plan=starter">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">Get Started</Button>
              </Link>
            </div>
          </Card>

          {/* Business */}
          <Card className="bg-slate-900 border-blue-500 text-white flex flex-col justify-between relative shadow-xl shadow-blue-600/10">
            <div className="absolute -top-3 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Popular Choice
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Business Plan</CardTitle>
              <CardDescription className="text-slate-400">For growing retail brands</CardDescription>
              <div className="mt-4 text-3xl font-extrabold">৳{businessPrice.toLocaleString()} <span className="text-sm text-slate-400 font-normal">/ month</span></div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> 3 Active Stores</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Unlimited Products</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> 10 Staff Accounts</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Visual Theme Builder</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Custom Domain Mapping</div>
            </CardContent>
            <div className="p-6 pt-0">
              <Link href="/register?plan=business">
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white">Select Business Plan</Button>
              </Link>
            </div>
          </Card>

          {/* Pro */}
          <Card className="bg-slate-900 border-slate-800 text-white flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-xl">Pro Enterprise</CardTitle>
              <CardDescription className="text-slate-400">High-volume sellers & agencies</CardDescription>
              <div className="mt-4 text-3xl font-extrabold">৳{proPrice.toLocaleString()} <span className="text-sm text-slate-400 font-normal">/ month</span></div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> 10 Active Stores</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Unlimited Products & Staff</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Profit Analytics & Reports</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 text-blue-400 mr-2" /> Premium Theme Access</div>
            </CardContent>
            <div className="p-6 pt-0">
              <Link href="/register?plan=pro">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">Select Pro Enterprise</Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
