import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, Plus, ArrowRight, ExternalLink, Sparkles, User, ShoppingBag } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your e-commerce stores, subscriptions, and business growth.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/dashboard/onboarding">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-600/20">
              <Plus className="w-4 h-4 mr-1.5" /> Create New Store
            </Button>
          </Link>
        </div>
      </div>

      {/* Current Subscription Status */}
      <Card className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 border-slate-800 text-slate-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 mb-2">
              <Sparkles className="w-3 h-3 mr-1" /> Active Subscription Plan
            </Badge>
            <CardTitle className="text-xl font-bold">
              {subscription?.plan?.name || 'Starter Plan (Trial)'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Status: <span className="text-emerald-400 font-semibold uppercase">{subscription?.status || 'TRIALING'}</span>
            </CardDescription>
          </div>
          <Link href="/dashboard/billing">
            <Button variant="outline" className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800">
              Upgrade Plan (ZiniPay)
            </Button>
          </Link>
        </CardHeader>
      </Card>

      {/* 15% Recurring Affiliate Program Quick Banner */}
      <Card className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-orange-950/40 border-amber-500/30 text-slate-100">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40 mb-2">
              <Sparkles className="w-3 h-3 mr-1" /> 15% Lifetime Passive Income
            </Badge>
            <CardTitle className="text-xl font-bold text-white">
              নাব্রিজান অফিশিয়াল অ্যাফিলিয়েট পার্টনারশিপ
            </CardTitle>
            <CardDescription className="text-slate-300">
              মার্চেন্ট রেফার করে আজীবন পান ১৫% রিকারিং কমিশন। বিকাশ ও নগদে সরাসরি উইথড্রয়াল!
            </CardDescription>
          </div>
          <Link href="/dashboard/affiliate">
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold border-0 shadow-lg">
              অ্যাফিলিয়েট ড্যাশবোর্ড <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
      </Card>

      {/* Stores List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Store className="w-5 h-5 mr-2 text-blue-400" /> Your Stores ({stores.length})
        </h2>

        {stores.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800 text-slate-100 p-8 text-center space-y-4">
            <Store className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-semibold text-white">No Stores Created Yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Launch your first single-vendor online store in less than 2 minutes.
            </p>
            <Link href="/dashboard/onboarding">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white">
                Launch My First Store
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {stores.map((s) => (
              <Card key={s.id} className="bg-slate-900 border-slate-800 text-slate-100 flex flex-col justify-between hover:border-slate-700 transition shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-white">{s.name}</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                      {s.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-400 font-mono text-xs">
                    /store/{s.slug}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400 block">Products</span>
                      <span className="font-bold text-white text-base">{s._count.products}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Orders</span>
                      <span className="font-bold text-blue-400 text-base">{s._count.orders}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Customers</span>
                      <span className="font-bold text-emerald-400 text-base">{s._count.customers}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/dashboard/stores/${s.id}`} className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs">
                        Manage Store Dashboard &rarr;
                      </Button>
                    </Link>
                    <Link href={`/store/${s.slug}`} target="_blank">
                      <Button variant="outline" size="icon" className="border-slate-800 text-slate-400 hover:text-white">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
