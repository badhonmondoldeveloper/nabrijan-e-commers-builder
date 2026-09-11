import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/prisma';
import { verifySuperAdmin } from '@/lib/auth/rbac';
import { Store, ShoppingBag, DollarSign, Wallet, ShieldCheck, Flame, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminMarketplaceOverviewPage() {
  await verifySuperAdmin();

  // Metrics
  const totalMarketplaceProducts = await db.product.count({
    where: { isMarketplaceListed: true },
  });

  const pendingApprovalProducts = await db.product.count({
    where: { isMarketplaceListed: true, marketplaceStatus: 'PENDING' },
  });

  const approvedProducts = await db.product.count({
    where: { isMarketplaceListed: true, marketplaceStatus: 'APPROVED' },
  });

  const pendingSettlementsRaw = await db.sellerSettlement.findMany({
    where: { status: 'PENDING' },
    include: {
      wallet: {
        include: { store: { select: { name: true, slug: true } } },
      },
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  const pendingSettlements = pendingSettlementsRaw.map((s) => ({
    ...s,
    amount: s.amount.toString(),
  }));

  const platformSettings = await db.platformSettings.findUnique({
    where: { id: 'global-settings' },
  });

  // Calculate gross marketplace volume & commissions using Decimal aggregation
  const wallets = await db.sellerWallet.aggregate({
    _sum: {
      totalEarned: true,
      totalCommissionPaid: true,
      pendingPayouts: true,
    },
  });

  const grossGmv = wallets._sum.totalEarned ? wallets._sum.totalEarned.toString() : '0.00';
  const commissionPaid = wallets._sum.totalCommissionPaid ? wallets._sum.totalCommissionPaid.toString() : '0.00';
  const pendingPayouts = wallets._sum.pendingPayouts ? wallets._sum.pendingPayouts.toString() : '0.00';
  const currentCommissionRate = platformSettings?.defaultCommissionRate ? (Number(platformSettings.defaultCommissionRate) * 100).toFixed(1) : '2.0';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Store className="w-7 h-7 text-emerald-400" /> Central Marketplace Command Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Platform governance, merchant approvals, commission management, and seller payouts.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/marketplace/products"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            Product Moderation ({pendingApprovalProducts})
          </Link>
          <Link
            href="/admin/marketplace/settlements"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700"
          >
            Settlements ({pendingSettlements.length})
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Platform GMV</div>
          <div className="text-3xl font-black text-white">
            ৳{grossGmv}
          </div>
          <div className="text-[10px] text-slate-500">Gross sales volume across merchants</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Commission Revenue</div>
          <div className="text-3xl font-black text-emerald-400">
            ৳{commissionPaid}
          </div>
          <div className="text-[10px] text-emerald-300">
            Current Rate: {currentCommissionRate}%
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Pending Seller Payouts</div>
          <div className="text-3xl font-black text-amber-400">
            ৳{pendingPayouts}
          </div>
          <div className="text-[10px] text-slate-500">Awaiting Super Admin approval</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Marketplace Products</div>
          <div className="text-3xl font-black text-cyan-400">
            {approvedProducts} / {totalMarketplaceProducts}
          </div>
          <div className="text-[10px] text-slate-500">{pendingApprovalProducts} pending moderation</div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/marketplace/products"
          className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
            Product Moderation Hub
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Review, approve, or reject products submitted by Bangladeshi merchants to the central hub.
          </p>
          <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1">
            Open Moderation Queue →
          </span>
        </Link>

        <Link
          href="/admin/marketplace/commissions"
          className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
            Commission Settings
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Configure default 2% platform commission, minimum withdrawal limit (500 BDT), and auto-approval.
          </p>
          <span className="text-xs font-bold text-cyan-400 inline-flex items-center gap-1">
            Configure Platform Rules →
          </span>
        </Link>

        <Link
          href="/admin/marketplace/settlements"
          className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
            Seller Payout Manager
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Process merchant bKash/Nagad/Bank withdrawal requests and deduct seller wallet balances.
          </p>
          <span className="text-xs font-bold text-amber-400 inline-flex items-center gap-1">
            Manage Payout Requests →
          </span>
        </Link>
      </div>

      {/* Pending Settlements Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-white">Pending Settlement Requests</h3>
          <Link href="/admin/marketplace/settlements" className="text-xs text-emerald-400 font-bold hover:underline">
            View All →
          </Link>
        </div>

        {pendingSettlements.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">
            ✓ No pending payout requests.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Store</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-6">Account Details</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pendingSettlements.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-white">
                      {s.wallet.store.name}
                    </td>
                    <td className="py-4 px-4 font-black text-amber-400">
                      ৳{s.amount}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-300">
                      {s.payoutMethod || 'BKASH'}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-400">
                      {s.payoutAccountDetails}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href="/admin/marketplace/settlements"
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl"
                      >
                        Review Request
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
