import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Crown, Sparkles, Shield, Zap } from 'lucide-react';
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

  const packagePrice = settings?.fullPackagePrice !== undefined ? Number(settings.fullPackagePrice) : 500;
  const bkashNumber = settings?.bkashNumber || '01625642420';
  const bkashType = settings?.bkashType || 'Personal';

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

      <main className="container mx-auto px-4 py-12 sm:py-16 max-w-4xl flex-1 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="outline" className="border-[#55B510]/40 text-[#063B2A] bg-[#EAF7DF] px-3.5 py-1 rounded-full text-xs uppercase font-extrabold">
            ⚡ All-in-One E-Commerce Package
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#063B2A]">One Simple Plan for Everyone</h1>
          <p className="text-[#66736C] text-sm sm:text-base">
            No hidden charges or limits. Build your store freely, upload products, setup custom themes, and activate your store live for just ৳{packagePrice}/month!
          </p>
        </div>

        {/* Single ৳500 Full Package Card */}
        <div className="max-w-xl mx-auto">
          <Card className="bg-white border-2 border-[#55B510] text-[#17221D] shadow-2xl relative bg-gradient-to-b from-white to-[#EAF7DF]/30 overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#55B510] text-white text-[11px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-wider shadow-md">
              Full Access Package
            </div>
            
            <CardHeader className="p-8 pb-4 text-center">
              <div className="w-14 h-14 bg-[#EAF7DF] rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#55B510] border border-[#55B510]/30 shadow-inner">
                <Crown className="w-7 h-7" />
              </div>
              <CardTitle className="text-2xl font-black text-[#063B2A]">Full Store Package</CardTitle>
              <CardDescription className="text-[#66736C] text-sm mt-1">Complete online store builder & live activation</CardDescription>
              
              <div className="mt-6 flex items-baseline justify-center gap-1.5">
                <span className="text-5xl font-black text-[#55B510]">৳{packagePrice}</span>
                <span className="text-sm text-[#66736C] font-semibold">/ month</span>
              </div>
            </CardHeader>

            <CardContent className="p-8 pt-4 space-y-4">
              <div className="p-4 bg-[#EAF7DF]/60 border border-[#55B510]/30 rounded-xl text-xs text-[#063B2A] space-y-1">
                <p className="font-bold">✨ Store Creation & Setup is 100% Free!</p>
                <p className="text-[#66736C]">You can build your store, upload unlimited products, and customize your theme. Pay ৳{packagePrice} via bKash only when you're ready to publish live.</p>
              </div>

              <div className="space-y-3 pt-2 text-sm text-[#17221D]">
                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#55B510] mr-3 shrink-0" /> <span className="font-bold">Unlimited Products & Categories</span></div>
                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#55B510] mr-3 shrink-0" /> <span className="font-bold">Custom Theme Customizer & Preset Layouts</span></div>
                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#55B510] mr-3 shrink-0" /> <span className="font-bold">Custom Domain Mapping (.com, .com.bd)</span></div>
                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#55B510] mr-3 shrink-0" /> <span className="font-bold">Pathao & Steadfast Courier API Integration</span></div>
                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#55B510] mr-3 shrink-0" /> <span className="font-bold">bKash, Nagad & Cash on Delivery (COD) Checkout</span></div>
                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#55B510] mr-3 shrink-0" /> <span className="font-bold">1-Click WhatsApp Ordering & Sales Reports</span></div>
                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-[#55B510] mr-3 shrink-0" /> <span className="font-bold">Dedicated Merchant Dashboard & Staff Accounts</span></div>
              </div>

              <div className="pt-6">
                <Link href="/register">
                  <Button className="w-full bg-[#55B510] hover:bg-[#489d0d] text-white font-extrabold text-sm h-12 shadow-lg rounded-xl">
                    Create Your Free Store Now <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
