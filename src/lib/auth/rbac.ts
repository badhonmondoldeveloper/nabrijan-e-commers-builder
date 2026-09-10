import { redirect } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export type Permission =
  | 'products:read'
  | 'products:write'
  | 'products:delete'
  | 'orders:read'
  | 'orders:write'
  | 'customers:read'
  | 'inventory:write'
  | 'marketing:write'
  | 'settings:write'
  | 'staff:write'
  | 'billing:write';

export async function verifyStoreAccess(storeId: string, requiredPermission?: Permission) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // Super Admins have unrestricted access
  if (user.role === 'SUPER_ADMIN') {
    return { user, storeRole: 'SUPER_ADMIN' };
  }

  // Check if store owner
  const store = await db.store.findFirst({
    where: { id: storeId, ownerId: user.id },
  });

  if (store) {
    return { user, storeRole: 'OWNER' };
  }

  // Check if staff member
  const staff = await db.staff.findUnique({
    where: {
      storeId_userId: {
        storeId,
        userId: user.id,
      },
    },
  });

  if (!staff || staff.status !== 'ACTIVE') {
    redirect('/dashboard');
  }

  if (requiredPermission && !staff.permissions.includes(requiredPermission)) {
    redirect('/dashboard');
  }

  return { user, storeRole: staff.role };
}

export async function verifySuperAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard');
  }

  return user;
}
