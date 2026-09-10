import Link from 'next/link';
import { db } from '@/lib/db/prisma';
import { verifySuperAdmin } from '@/lib/auth/rbac';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Store, DollarSign, Sparkles, ShieldCheck, Activity } from 'lucide-react';

export default async function SuperAdminDashboardPage() {
  await verifySuperAdmin();

  const totalUsers = await db.user.count();
  const totalStores = await db.store.count();
  const activeSubscriptions = await db.subscription.count({ where: { status: 'ACTIVE' } });
  
  const subscriptions = await db.subscription.findMany({
    include: { plan: true },
  });

  const mrr = subscriptions.reduce((acc, sub) => acc + (sub.plan?.price || 0), 0);

  const recentStores = await db.store.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { owner: { select: { name: true, email: true } } },
  });

  return (
    <div className="container mx-auto p-6 md:p-12 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 mb-2">
            <ShieldCheck className="w-3 h-3 mr-1" /> Super Admin Operations Panel
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Platform Control System</h1>
          <p className="text-sm text-slate-400">Manage stores, users, ZiniPay billing, and SaaS subscriptions.</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/dashboard">
            <span className="text-xs text-blue-400 hover:underline">Merchant Dashboard &rarr;</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs text-slate-400">Platform MRR</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">৳{mrr.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 mt-1">Monthly Recurring SaaS Revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs text-slate-400">Total Stores</CardTitle>
            <Store className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalStores}</div>
            <p className="text-[10px] text-slate-500 mt-1">Created merchant stores</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs text-slate-400">Active Subscriptions</CardTitle>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeSubscriptions}</div>
            <p className="text-[10px] text-slate-500 mt-1">Paying subscribers</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs text-slate-400">Registered Users</CardTitle>
            <Users className="w-4 h-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalUsers}</div>
            <p className="text-[10px] text-slate-500 mt-1">Merchant user accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Stores Table */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader>
          <CardTitle className="text-lg">Recent Stores Created</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-medium uppercase">
                <tr>
                  <th className="p-3">Store Name</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentStores.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">{s.name}</td>
                    <td className="p-3 font-mono text-blue-400">/store/{s.slug}</td>
                    <td className="p-3 text-slate-300">{s.owner.name} ({s.owner.email})</td>
                    <td className="p-3">
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                        {s.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
