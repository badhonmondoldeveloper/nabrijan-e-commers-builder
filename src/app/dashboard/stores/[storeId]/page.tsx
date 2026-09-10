import { notFound } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Package, Users, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default async function StoreDashboardOverview({
  params,
}: {
  params: { storeId: string };
}) {
  const store = await db.store.findUnique({
    where: { id: params.storeId },
  });

  if (!store) notFound();

  // Aggregate KPIs strictly for current store (Tenant isolation)
  const totalProducts = await db.product.count({ where: { storeId: store.id } });
  const lowStockProducts = await db.product.count({
    where: {
      storeId: store.id,
      stock: { lte: 5 },
    },
  });

  const orders = await db.order.findMany({
    where: { storeId: store.id },
    select: {
      id: true,
      totalAmount: true,
      estimatedProfit: true,
      orderStatus: true,
      createdAt: true,
      customerName: true,
      customerPhone: true,
    },
  });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalEstimatedProfit = orders.reduce((acc, curr) => acc + curr.estimatedProfit, 0);

  const totalCustomers = await db.customer.count({ where: { storeId: store.id } });

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Dashboard Overview
        </h1>
        <p className="text-sm text-slate-400">
          Real-time metrics, order status tracking, and estimated profit breakdown for <span className="text-blue-400 font-semibold">{store.name}</span>.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs font-medium text-slate-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-white">৳{totalRevenue.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 mt-1">Gross order sales</p>
          </CardContent>
        </Card>

        {/* Estimated Profit */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs font-medium text-slate-400">Est. Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-blue-400">৳{totalEstimatedProfit.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 mt-1">Revenue minus cost</p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs font-medium text-slate-400">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-white">{totalOrders}</div>
            <p className="text-[10px] text-slate-500 mt-1">All time orders</p>
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs font-medium text-slate-400">Active Products</CardTitle>
            <Package className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-white">{totalProducts}</div>
            <p className="text-[10px] text-slate-500 mt-1">Catalog items</p>
          </CardContent>
        </Card>

        {/* Customers */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs font-medium text-slate-400">Customers</CardTitle>
            <Users className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-white">{totalCustomers}</div>
            <p className="text-[10px] text-slate-500 mt-1">Registered clients</p>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-xs font-medium text-slate-400">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-rose-400">{lowStockProducts}</div>
            <p className="text-[10px] text-slate-500 mt-1">Items stock &le; 5</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
            <p className="text-xs text-slate-400">Latest customer Cash on Delivery orders</p>
          </div>
          <Link
            href={`/dashboard/stores/${store.id}/orders`}
            className="text-xs text-blue-400 hover:underline flex items-center font-medium"
          >
            View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40" />
              Customer order করলে এখানে দেখতে পাবেন (No orders received yet)
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Est. Profit</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">{ord.customerName}</td>
                      <td className="p-3 text-slate-400 font-mono">{ord.customerPhone}</td>
                      <td className="p-3 font-bold text-emerald-400">৳{ord.totalAmount}</td>
                      <td className="p-3 font-bold text-blue-400">৳{ord.estimatedProfit}</td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={
                            ord.orderStatus === 'DELIVERED'
                              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                              : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                          }
                        >
                          {ord.orderStatus}
                        </Badge>
                      </td>
                      <td className="p-3 text-slate-500">
                        {new Date(ord.createdAt).toLocaleDateString()}
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
