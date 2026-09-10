import { notFound } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, ShoppingCart, ArrowUpRight, BarChart3, PieChart } from 'lucide-react';

export default async function StoreAnalyticsPage({ params }: { params: { storeId: string } }) {
  const store = await db.store.findUnique({
    where: { id: params.storeId },
  });

  if (!store) notFound();

  const orders = await db.order.findMany({
    where: { storeId: store.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalEstimatedProfit = orders.reduce((acc, curr) => acc + curr.estimatedProfit, 0);
  const totalShippingCollected = orders.reduce((acc, curr) => acc + curr.shippingFee, 0);
  const totalDiscountsGiven = orders.reduce((acc, curr) => acc + curr.discountAmount, 0);

  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Profit & Sales Analytics</h1>
        <p className="text-sm text-slate-400">
          Financial performance reports, net profit calculations, and average order value breakdown.
        </p>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs text-slate-400">Gross Sales Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">৳{totalRevenue.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 mt-1">Total customer payments</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs text-slate-400">Estimated Net Profit</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">৳{totalEstimatedProfit.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 mt-1">Revenue minus product cost</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs text-slate-400">Avg. Order Value (AOV)</CardTitle>
            <ShoppingCart className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">৳{averageOrderValue.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 mt-1">Per completed order average</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs text-slate-400">Shipping Fees Collected</CardTitle>
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">৳{totalShippingCollected.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 mt-1">Delivery charges</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Formula Explanation Banner */}
      <Card className="bg-slate-900 border-blue-500/30 text-slate-100">
        <CardHeader>
          <CardTitle className="text-base font-bold text-blue-400">
            📊 Profit Calculation Formula
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2 text-slate-300">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-emerald-400">
            Estimated Profit = Revenue (৳{totalRevenue}) - Product Unit Cost - Discounts (৳{totalDiscountsGiven})
          </div>
          <p className="text-[11px] text-slate-500">
            Note: Estimated profit is calculated from product cost price inputs. Always verify with official accounting records.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
