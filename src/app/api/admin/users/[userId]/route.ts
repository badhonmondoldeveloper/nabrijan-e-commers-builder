import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifySuperAdmin } from '@/lib/auth/rbac';

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const admin = await verifySuperAdmin();
    const { userId } = params;
    const body = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const updateData: any = {};
    if (body.role !== undefined) updateData.role = body.role;
    if (body.isEmailVerified !== undefined) updateData.isEmailVerified = Boolean(body.isEmailVerified);

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'User update failed' },
      { status: 500 }
    );
  }
}
