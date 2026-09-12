import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'UNAUTHORIZED: Super Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
      return NextResponse.json({ message: 'Invalid store status. Allowed: ACTIVE, INACTIVE, SUSPENDED' }, { status: 400 });
    }

    const store = await db.store.update({
      where: { id: params.storeId },
      data: { status },
    });

    await db.auditLog.create({
      data: {
        actorId: user.id,
        actorEmail: user.email,
        storeId: store.id,
        action: 'STORE_STATUS_UPDATED',
        resource: 'Store',
        resourceId: store.id,
        details: JSON.stringify({ status }),
      },
    });

    return NextResponse.json({
      success: true,
      store: { id: store.id, name: store.name, status: store.status },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update store status' }, { status: 500 });
  }
}
