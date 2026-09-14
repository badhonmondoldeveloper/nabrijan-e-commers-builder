import { db } from '@/lib/db/prisma';
import { verifySuperAdmin } from '@/lib/auth/rbac';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BkashApprovalsClient from './BkashApprovalsClient';

export default async function AdminSubscriptionsPage() {
  await verifySuperAdmin();

  const plansRaw = await db.plan.findMany({
    include: {
      _count: { select: { subscriptions: true } },
    },
    orderBy: { price: 'asc' },
  });

  const plans = plansRaw.map((p) => ({
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const submissionsRaw = await db.manualPaymentSubmission.findMany({
    include: {
      store: { select: { name: true, slug: true, status: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const submissions = submissionsRaw.map((s) => ({
    ...s,
    amount: Number(s.amount),
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    approvedAt: s.approvedAt ? s.approvedAt.toISOString() : null,
  }));

  const activeSubscriptionsRaw = await db.subscription.findMany({
    include: {
      user: { select: { name: true, email: true } },
      plan: true,
      store: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const activeSubscriptions = activeSubscriptionsRaw.map((sub) => ({
    ...sub,
    currentPeriodStart: sub.currentPeriodStart.toISOString(),
    currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
    createdAt: sub.createdAt.toISOString(),
    updatedAt: sub.updatedAt.toISOString(),
    plan: sub.plan
      ? {
          ...sub.plan,
          price: Number(sub.plan.price),
          createdAt: sub.plan.createdAt.toISOString(),
          updatedAt: sub.plan.updatedAt.toISOString(),
        }
      : null,
  }));

  return (
    <div className="container mx-auto p-6 md:p-12 space-y-8 font-sans">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Store Activations & Billing Oversight</h1>
        <p className="text-sm text-slate-400 mt-1">
          Verify merchant bKash ৳500 payment submissions to activate stores and make them LIVE.
        </p>
      </div>

      {/* Manual bKash Store Activations */}
      <BkashApprovalsClient initialSubmissions={submissions} />

      {/* Subscription Plans Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <Card key={p.id} className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">{p.name}</CardTitle>
              <div className="text-2xl font-bold text-emerald-400 mt-1">৳{p.price} / month</div>
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

      {/* Active Subscriptions Table */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white">Active Store Subscriptions</CardTitle>
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
                {activeSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-semibold text-white">{sub.user.name} ({sub.user.email})</td>
                    <td className="p-4 text-slate-300">{sub.store?.name || 'N/A'}</td>
                    <td className="p-4 font-bold text-emerald-400">{sub.plan?.name}</td>
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

