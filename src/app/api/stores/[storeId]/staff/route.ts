import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'settings:write');

    const staff = await db.staff.findMany({
      where: { storeId: params.storeId },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, staff });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch staff members' },
      { status: 400 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'settings:write');

    const body = await req.json();
    const { email, role, permissions } = body;

    if (!email || !role) {
      return NextResponse.json(
        { message: 'Email and Role are required' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User with this email does not exist in Nabrijan' },
        { status: 404 }
      );
    }

    const existingStaff = await db.staff.findUnique({
      where: {
        storeId_userId: {
          storeId: params.storeId,
          userId: user.id,
        },
      },
    });

    if (existingStaff) {
      return NextResponse.json(
        { message: 'User is already a staff member of this store' },
        { status: 400 }
      );
    }

    const staffMember = await db.staff.create({
      data: {
        storeId: params.storeId,
        userId: user.id,
        role: role || 'MANAGER',
        status: 'ACTIVE',
        permissions: JSON.stringify(permissions || []),
      },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Staff member added successfully',
      staff: staffMember,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to add staff member' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'settings:write');

    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get('staffId');

    if (!staffId) {
      return NextResponse.json({ message: 'Staff ID required' }, { status: 400 });
    }

    await db.staff.deleteMany({
      where: { id: staffId, storeId: params.storeId },
    });

    return NextResponse.json({ success: true, message: 'Staff member removed successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to remove staff member' },
      { status: 400 }
    );
  }
}
