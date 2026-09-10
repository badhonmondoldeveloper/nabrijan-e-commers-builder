import { notFound } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, Plus, CheckCircle2 } from 'lucide-react';
import CouponManagerModal from '@/components/dashboard/CouponManagerModal';

export default async function StoreCouponsPage({ params }: { params: { storeId: string } }) {
  const store = await db.store.findUnique({
    where: { id: params.storeId },
  });

  if (!store) notFound();

  const coupons = await db.coupon.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Discounts & Coupons Engine</h1>
          <p className="text-sm text-slate-400">
            Create promotional discount codes (Percentage, Fixed amount, Free shipping) for customer checkout.
          </p>
        </div>
        <CouponManagerModal storeId={store.id} />
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
        <CardContent className="p-0">
          {coupons.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Tag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">No Discount Coupons Created Yet</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
                Boost store conversions by offering first-order or promotional discount codes.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Coupon Code</th>
                    <th className="p-4">Discount Type</th>
                    <th className="p-4">Discount Amount</th>
                    <th className="p-4">Min. Purchase</th>
                    <th className="p-4">Times Used</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-mono font-bold text-blue-400 text-sm">{c.code}</td>
                      <td className="p-4 font-semibold text-slate-300">{c.discountType}</td>
                      <td className="p-4 font-bold text-emerald-400">
                        {c.discountType === 'PERCENTAGE' ? `${c.amount}% OFF` : `৳${c.amount} OFF`}
                      </td>
                      <td className="p-4 text-slate-400">৳{c.minPurchase || 0}</td>
                      <td className="p-4 font-mono text-slate-300">{c.usedCount} uses</td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={c.isActive ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-slate-700 text-slate-400'}
                        >
                          {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
