import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Package, Image as ImageIcon, ExternalLink, AlertCircle, Layers } from 'lucide-react';
import { ProductStatusToggle } from '@/components/dashboard/ProductStatusToggle';

export default async function ProductsListPage({
  params,
}: {
  params: { storeId: string };
}) {
  const store = await db.store.findUnique({
    where: { id: params.storeId },
  });

  if (!store) notFound();

  const products = await db.product.findMany({
    where: { storeId: store.id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      variants: { select: { id: true, title: true, stock: true } },
      attributes: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Products Catalog</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage store items, pricing, inventory stock, and Size/Color variants.
          </p>
        </div>
        <Link href={`/dashboard/stores/${store.id}/products/new`}>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md shadow-blue-600/20 text-xs sm:text-sm">
            <Plus className="w-4 h-4 mr-1.5" /> Add New Product
          </Button>
        </Link>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">আপনার প্রথম Product যোগ করুন</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mb-6 mt-1">
                You haven't added any products to this store yet. Click below to publish your first item with Size & Color variants.
              </p>
              <Link href={`/dashboard/stores/${store.id}/products/new`}>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Product Now
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto select-none">
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">SKU / Variants</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price / Cost</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status & Switch</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                            {p.images[0] ? (
                              <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-white text-sm block">{p.title}</span>
                            <span className="text-slate-500 font-mono text-[11px]">/product/{p.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-slate-400 text-xs">{p.sku || 'N/A'}</div>
                        {p.variants.length > 0 && (
                          <div className="mt-1">
                            <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
                              <Layers className="w-3 h-3 mr-1" /> {p.variants.length} Variants
                            </Badge>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-slate-300">{p.category?.name || 'Uncategorized'}</td>
                      <td className="p-4">
                        <div className="font-bold text-emerald-400">৳{Number(p.salePrice || p.regularPrice)}</div>
                        <div className="text-[10px] text-slate-500">Cost: ৳{Number(p.costPrice)}</div>
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold ${p.stock <= p.lowStockThreshold ? 'text-rose-400 flex items-center' : 'text-slate-300'}`}>
                          {p.stock <= p.lowStockThreshold && <AlertCircle className="w-3 h-3 mr-1 inline" />}
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <ProductStatusToggle storeId={store.id} productId={p.id} initialStatus={p.status} />
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/store/${store.slug}/product/${p.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-400 hover:text-white">
                            View Live <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
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
