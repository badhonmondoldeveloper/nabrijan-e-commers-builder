import { notFound } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Plus, Package } from 'lucide-react';
import CategoryManagerModal from '@/components/dashboard/CategoryManagerModal';

export default async function StoreCategoriesPage({ params }: { params: { storeId: string } }) {
  const store = await db.store.findUnique({
    where: { id: params.storeId },
  });

  if (!store) notFound();

  const categories = await db.category.findMany({
    where: { storeId: store.id },
    include: {
      parent: true,
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Categories Management</h1>
          <p className="text-sm text-slate-400">
            Organize catalog products into hierarchical parent/child categories.
          </p>
        </div>
        <CategoryManagerModal storeId={store.id} existingCategories={categories} />
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
        <CardContent className="p-0">
          {categories.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">No Categories Created Yet</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
                Create categories to group products and display organized collections on your storefront.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Category Name</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Parent Category</th>
                    <th className="p-4">Products Count</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-semibold text-white">{cat.name}</td>
                      <td className="p-4 font-mono text-blue-400">/category/{cat.slug}</td>
                      <td className="p-4 text-slate-400">{cat.parent?.name || 'Top-Level Root'}</td>
                      <td className="p-4 font-bold text-emerald-400">{cat._count.products} products</td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={cat.isActive ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-slate-700 text-slate-400'}
                        >
                          {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
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
