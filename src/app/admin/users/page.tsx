import { db } from '@/lib/db/prisma';
import { verifySuperAdmin } from '@/lib/auth/rbac';
import { Card, CardContent } from '@/components/ui/card';
import { UserManagementTable } from '@/components/admin/UserManagementTable';

export default async function AdminUsersPage() {
  await verifySuperAdmin();

  const rawUsers = await db.user.findMany({
    include: {
      _count: { select: { stores: true, subscriptions: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const users = rawUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    isEmailVerified: u.isEmailVerified,
    createdAt: u.createdAt.toISOString(),
    _count: u._count,
  }));

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-12 space-y-8 font-sans">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Platform Users Directory</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Manage registered merchant accounts, toggle roles, and control email verification security.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
        <CardContent className="p-0">
          <UserManagementTable initialUsers={users} />
        </CardContent>
      </Card>
    </div>
  );
}
