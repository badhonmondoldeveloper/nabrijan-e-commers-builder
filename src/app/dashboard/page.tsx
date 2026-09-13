import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, Plus, ArrowRight, ExternalLink, Sparkles, User, ShoppingBag } from 'lucide-react';
import ApkDownloadModal from '@/components/apk/ApkDownloadModal';

export default async function MerchantDashboardRootPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const stores = await db.store.findMany({
    where: { ownerId: user.id },
    include: {
      _count: {
        select: { products: true, orders: true, customers: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const subscription = await db.subscription.findFirst({
    where: { userId: user.id },
    include: { plan: true },
  });

  return (
    <div className="min-h-screen bg-[#F6FAF4] text-[#17221D] p-6 md:p-12 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE7DF] pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#063B2A]">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-sm text-[#66736C] mt-1">
            Manage your e-commerce stores, subscriptions, and business growth.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/dashboard/onboarding">
            <Button className="bg-[#55B510] hover:bg-[#489d0d] text-white font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-[#55B510]/30 transition transform hover:scale-[1.02]">
              <Plus className="w-4 h-4 mr-1.5" /> Create New Store
            </Button>
          </Link>
        </div>
      </div>

      {/* Current Subscription Status */}
      <Card className="bg-[#063B2A] border-2 border-[#55B510]/30 text-white shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Badge className="bg-[#55B510] text-white border-0 mb-2 font-bold text-[10px] uppercase">
              <Sparkles className="w-3 h-3 mr-1" /> Active Subscription Plan
            </Badge>
            <CardTitle className="text-2xl font-black text-white">
              {subscription?.plan?.name || 'Free Plan (Active)'}
            </CardTitle>
            <CardDescription className="text-emerald-200/80">
              Status: <span className="text-[#55B510] font-bold uppercase">{subscription?.status || 'ACTIVE'}</span>
            </CardDescription>
          </div>
          <Link href="/dashboard/billing">
            <Button className="bg-[#55B510] hover:bg-[#489d0d] text-white font-bold text-xs rounded-xl shadow-md">
              Upgrade Plan (ZiniPay)
            </Button>
          </Link>
        </CardHeader>
      </Card>

      {/* 15% Recurring Affiliate Program Quick Banner */}
      <Card className="bg-gradient-to-r from-[#EAF7DF] to-white border-2 border-[#55B510] text-[#17221D] shadow-lg rounded-3xl">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge className="bg-[#063B2A] text-white mb-2 font-bold text-[10px] uppercase">
              <Sparkles className="w-3 h-3 mr-1" /> 15% Lifetime Passive Income
            </Badge>
            <CardTitle className="text-xl font-black text-[#063B2A]">
              নাব্রিজান অফিশিয়াল অ্যাফিলিয়েট পার্টনারশিপ
            </CardTitle>
            <CardDescription className="text-[#66736C]">
              মার্চেন্ট রেফার করে আজীবন পান ১৫% রিকারিং কমিশন। বিকাশ ও নগদে সরাসরি উইথড্রয়াল!
            </CardDescription>
          </div>
          <Link href="/dashboard/affiliate">
            <Button className="bg-[#063B2A] hover:bg-[#04281c] text-white font-black text-xs rounded-xl shadow-md px-5">
              অ্যাফিলিয়েট ড্যাশবোর্ড <ArrowRight className="w-4 h-4 ml-1.5 text-[#55B510]" />
            </Button>
          </Link>
        </CardHeader>
      </Card>

      {/* Stores List */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-[#063B2A] flex items-center">
          <Store className="w-5 h-5 mr-2 text-[#55B510]" /> Your Stores ({stores.length})
        </h2>

        {stores.length === 0 ? (
          <Card className="bg-white border-2 border-[#DCE7DF] text-[#17221D] p-8 text-center space-y-4 rounded-3xl shadow-sm">
            <Store className="w-12 h-12 text-[#55B510] mx-auto" />
            <h3 className="text-lg font-bold text-[#063B2A]">No Stores Created Yet</h3>
            <p className="text-xs text-[#66736C] max-w-sm mx-auto">
              Launch your first single-vendor online store in less than 2 minutes.
            </p>
            <Link href="/dashboard/onboarding">
              <Button className="bg-[#55B510] hover:bg-[#489d0d] text-white font-bold text-xs rounded-xl">
                Launch My First Store
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {stores.map((s) => (
              <Card key={s.id} className="bg-white border-2 border-[#DCE7DF] text-[#17221D] flex flex-col justify-between hover:border-[#55B510] transition shadow-md rounded-3xl overflow-hidden">
                <CardHeader className="bg-[#F6FAF4] border-b border-[#DCE7DF]">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-lg text-[#063B2A]">{s.name}</span>
                    <Badge className="bg-[#EAF7DF] text-[#063B2A] border border-[#55B510]/30 font-bold">
                      {s.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-[#66736C] font-mono text-xs">
                    /store/{s.slug}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-[#F6FAF4] p-3 rounded-2xl border border-[#DCE7DF]">
                    <div>
                      <span className="text-[#66736C] block">Products</span>
                      <span className="font-black text-[#063B2A] text-base">{s._count.products}</span>
                    </div>
                    <div>
                      <span className="text-[#66736C] block">Orders</span>
                      <span className="font-black text-[#55B510] text-base">{s._count.orders}</span>
                    </div>
                    <div>
                      <span className="text-[#66736C] block">Customers</span>
                      <span className="font-black text-[#063B2A] text-base">{s._count.customers}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/dashboard/stores/${s.id}`} className="flex-1">
                      <Button className="w-full bg-[#55B510] hover:bg-[#489d0d] text-white font-bold text-xs rounded-xl shadow-md">
                        Manage Store Dashboard &rarr;
                      </Button>
                    </Link>
                    <Link href={`/store/${s.slug}`} target="_blank">
                      <Button variant="outline" size="icon" className="border-[#DCE7DF] bg-white hover:bg-[#EAF7DF] text-[#063B2A] rounded-xl">
                        <ExternalLink className="w-4 h-4 text-[#55B510]" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* APK Download Modal Popup for Merchants */}
      <ApkDownloadModal autoShow={true} />
    </div>
  );
}
