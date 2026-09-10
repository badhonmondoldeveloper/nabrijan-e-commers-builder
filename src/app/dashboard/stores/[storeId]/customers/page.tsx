import { notFound } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Phone, Mail, ShoppingCart, DollarSign } from 'lucide-react';

export default async function StoreCustomersPage({ params }: { params: { storeId: string } }) {
  const store = await db.store.findUnique({
    where: { id: params.storeId },
  });

  if (!store) notFound();

  const customers = await db.customer.findMany({
    where: { storeId: store.id },
    include: {
      orders: { select: { id: true, totalAmount: true, createdAt: true }, take: 1, orderBy: { createdAt: 'desc' } },
    },
    orderBy: { totalSpent: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Merchant CRM & Customers</h1>
        <p className="text-sm text-slate-400">
          Directory of registered store clients, lifetime value, and order history segmentation.
        </p>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
        <CardContent className="p-0">
          {customers.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">No Customers Registered Yet</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
                When customers place Cash on Delivery orders on your storefront, their contact records will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Phone Number</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Total Orders</th>
                    <th className="p-4">Lifetime Spend</th>
                    <th className="p-4">Segment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-semibold text-white text-sm">{c.name}</td>
                      <td className="p-4 font-mono text-slate-300">{c.phone}</td>
                      <td className="p-4 text-slate-400">{c.email || 'N/A'}</td>
                      <td className="p-4 font-bold text-blue-400">{c.totalOrders} orders</td>
                      <td className="p-4 font-bold text-emerald-400">৳{c.totalSpent.toLocaleString()}</td>
                      <td className="p-4">
                        {c.totalSpent >= 5000 ? (
                          <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30">
                            VIP Client ⭐
                          </Badge>
                        ) : c.totalOrders > 1 ? (
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                            Returning
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-slate-700 text-slate-400">
                            New Client
                          </Badge>
                        )}
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
