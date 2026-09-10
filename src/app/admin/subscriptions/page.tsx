import { db } from '@/lib/db/prisma';
import { verifySuperAdmin } from '@/lib/auth/rbac';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default async function AdminSubscriptionsPage() {
  await verifySuperAdmin();

  const plans = await db.plan.findMany({
    include: {
      _count: { select: { subscriptions: true } },
    },
    orderBy: { price: 'asc' },
  });

  const subscriptions = await db.subscription.findMany({
    include: {
      user: { select: { name: true, email: true } },
      plan: true,
      store: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto p-6 md:p-12 space-y-8 font-sans">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Subscription Plans & Billing Oversight</h1>
        <p className="text-sm text-slate-400 mt-1">Configure platform subscription tiers, plan limits, and ZiniPay payments.</p>
      </div>

      {/* Subscription Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <Card key={p.id} className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">{p.name}</CardTitle>
              <div className="text-2xl font-bold text-white mt-1">৳{p.price} / month</div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-400">
              <p>Store Limit: <strong className="text-white">{p.storeLimit} store</strong></p>
              <p>Product Limit: <strong className="text-white">{p.productLimit} items</strong></p>
              <p>Staff Accounts: <strong className="text-white">{p.staffLimit} users</strong></p>
              <div className="pt-2 border-t border-slate-800 font-bold text-emerald-400">
                Active Subscribers: {p._count.subscriptions} merchants
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Merchant Subscriptions Table */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg">Merchant Subscriptions & ZiniPay Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider">
                <tr>
                  <th className="p-4">Merchant User</th>
                  <th className="p-4">Store</th>
                  <th className="p-4">Plan Tier</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Renewal Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-semibold text-white">{sub.user.name} ({sub.user.email})</td>
                    <td className="p-4 text-slate-300">{sub.store?.name || 'N/A'}</td>
                    <td className="p-4 font-bold text-blue-400">{sub.plan?.name}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-400">{new Date(sub.currentPeriodEnd).toLocaleDateString()}</td>
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
