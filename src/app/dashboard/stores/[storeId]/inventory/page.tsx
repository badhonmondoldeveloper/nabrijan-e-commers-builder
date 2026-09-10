import { notFound } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Warehouse, AlertTriangle, ArrowUpRight, History } from 'lucide-react';
import InventoryAdjusterModal from '@/components/dashboard/InventoryAdjusterModal';

export default async function StoreInventoryPage({ params }: { params: { storeId: string } }) {
  const store = await db.store.findUnique({
    where: { id: params.storeId },
  });

  if (!store) notFound();

  const products = await db.product.findMany({
    where: { storeId: store.id },
    select: { id: true, title: true, sku: true, stock: true, lowStockThreshold: true },
    orderBy: { stock: 'asc' },
  });

  const transactions = await db.inventoryTransaction.findMany({
    where: { storeId: store.id },
    include: { product: { select: { title: true, sku: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Inventory Control & Audit</h1>
          <p className="text-sm text-slate-400">
            Real-time available stock levels, low-stock warnings, and transaction logs.
          </p>
        </div>
        <InventoryAdjusterModal storeId={store.id} products={products} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Stock Status Table */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Warehouse className="w-4 h-4 mr-2 text-rose-400" /> Current Product Stock Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 uppercase">
                  <tr>
                    <th className="p-3">Product Title</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Stock Level</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">{p.title}</td>
                      <td className="p-3 font-mono text-slate-400">{p.sku || 'N/A'}</td>
                      <td className="p-3 font-bold text-white">{p.stock} units</td>
                      <td className="p-3">
                        {p.stock <= p.lowStockThreshold ? (
                          <Badge variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/10">
                            Low Stock (&le; {p.lowStockThreshold})
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                            In Stock
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Audit Transaction History */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <History className="w-4 h-4 mr-2 text-blue-400" /> Inventory Audit Transactions Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 uppercase">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Stock Change</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">{t.product?.title}</td>
                      <td className="p-3 font-mono text-blue-400">{t.type}</td>
                      <td className="p-3 font-bold text-emerald-400">
                        {t.type === 'SALE' || t.type === 'DAMAGE' ? `-${t.quantity}` : `+${t.quantity}`}
                      </td>
                      <td className="p-3 text-slate-400 font-mono">
                        {t.previousStock} &rarr; {t.newStock}
                      </td>
                      <td className="p-3 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
