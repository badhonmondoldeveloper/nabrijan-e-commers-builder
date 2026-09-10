import { db } from '@/lib/db/prisma';
import { verifySuperAdmin } from '@/lib/auth/rbac';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, ShieldCheck, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function AdminUsersPage() {
  await verifySuperAdmin();

  const users = await db.user.findMany({
    include: {
      _count: { select: { stores: true, subscriptions: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto p-6 md:p-12 space-y-8 font-sans">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Platform Users Directory</h1>
        <p className="text-sm text-slate-400 mt-1">Manage registered merchant accounts, roles, and security access.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider">
                <tr>
                  <th className="p-4">User Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Owned Stores</th>
                  <th className="p-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-semibold text-white text-sm">{u.name}</td>
                    <td className="p-4 text-slate-300 font-mono">{u.email}</td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={
                          u.role === 'SUPER_ADMIN'
                            ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
                            : 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">{u._count.stores} stores</td>
                    <td className="p-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
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
