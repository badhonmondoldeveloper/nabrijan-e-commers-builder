import { db } from '@/lib/db/prisma';
import { verifySuperAdmin } from '@/lib/auth/rbac';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { StoreStatusToggle } from '@/components/admin/StoreStatusToggle';

export default async function AdminStoresPage() {
  await verifySuperAdmin();

  const stores = await db.store.findMany({
    include: {
      owner: { select: { name: true, email: true } },
      _count: { select: { products: true, orders: true, customers: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-12 space-y-8 font-sans max-w-full overflow-x-hidden">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Platform Merchant Stores</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Oversight and status management of all merchant stores on Nabrijan SaaS.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto select-none">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider">
                <tr>
                  <th className="p-4">Store Name</th>
                  <th className="p-4">Store Address</th>
                  <th className="p-4">Merchant Owner</th>
                  <th className="p-4">Products</th>
                  <th className="p-4">Orders</th>
                  <th className="p-4">Status & Control</th>
                  <th className="p-4 text-right">Storefront</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stores.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-white text-sm">{s.name}</td>
                    <td className="p-4 font-mono text-blue-400">/store/{s.slug}</td>
                    <td className="p-4 text-slate-300">{s.owner.name} ({s.owner.email})</td>
                    <td className="p-4 font-bold text-slate-200">{s._count.products}</td>
                    <td className="p-4 font-bold text-emerald-400">{s._count.orders}</td>
                    <td className="p-4">
                      <StoreStatusToggle storeId={s.id} initialStatus={s.status} />
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/store/${s.slug}`} target="_blank">
                        <span className="text-blue-400 hover:underline inline-flex items-center text-xs">
                          Visit <ExternalLink className="w-3 h-3 ml-1" />
                        </span>
                      </Link>
                    </td>
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
