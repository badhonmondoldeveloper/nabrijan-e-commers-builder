import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { getAuthSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'UNAUTHORIZED: Super Admin access required' }, { status: 403 });
    }

    const affiliates = await db.affiliateProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            referrals: true,
            earnings: true,
            payoutRequests: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate system-wide totals
    const totalAffiliates = affiliates.length;
    const totalEarningsAll = affiliates.reduce((sum, a) => sum + Number(a.totalEarnings), 0);
    const totalPaidOutAll = affiliates.reduce((sum, a) => sum + Number(a.paidOutAmount), 0);
    const totalPendingBalance = affiliates.reduce((sum, a) => sum + Number(a.availableBalance), 0);

    return NextResponse.json({
      success: true,
      metrics: {
        totalAffiliates,
        totalEarningsAll,
        totalPaidOutAll,
        totalPendingBalance,
      },
      affiliates: affiliates.map((a) => ({
        id: a.id,
        userId: a.userId,
        name: a.user.name,
        email: a.user.email,
        phone: a.user.phone || a.payoutNumber,
        code: a.code,
        status: a.status,
        payoutMethod: a.payoutMethod,
        payoutNumber: a.payoutNumber,
        totalClicks: a.totalClicks,
        totalEarnings: Number(a.totalEarnings),
        availableBalance: Number(a.availableBalance),
        paidOutAmount: Number(a.paidOutAmount),
        referralCount: a._count.referrals,
        createdAt: a.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching admin affiliates list:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch affiliates list' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'UNAUTHORIZED: Super Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { affiliateId, status } = body;

    if (!affiliateId || !status || !['ACTIVE', 'SUSPENDED', 'PENDING_REVIEW'].includes(status)) {
      return NextResponse.json({ message: 'Valid affiliateId and status are required' }, { status: 400 });
    }

    const updated = await db.affiliateProfile.update({
      where: { id: affiliateId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      profile: updated,
      message: `Affiliate status updated to ${status}`,
    });
  } catch (error: any) {
    console.error('Error updating affiliate status:', error);
    return NextResponse.json({ message: error.message || 'Failed to update affiliate status' }, { status: 500 });
  }
}
