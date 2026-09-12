import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { getAuthSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || !session.userId) {
      return NextResponse.json({ message: 'UNAUTHORIZED: Please login first' }, { status: 401 });
    }

    const profile = await db.affiliateProfile.findUnique({
      where: { userId: session.userId },
      include: {
        referrals: {
          include: {
            referredUser: {
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                subscriptions: {
                  select: { status: true, planId: true },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        earnings: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        payoutRequests: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ isAffiliate: false }, { status: 200 });
    }

    // Count active paying referred merchants
    const activePaidReferrals = profile.referrals.filter((ref) =>
      ref.referredUser.subscriptions.some((sub) => sub.status === 'ACTIVE')
    ).length;

    const host = req.headers.get('host') || 'nabrijan.site';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const referralLink = `${protocol}://${host}?ref=${profile.code}`;

    return NextResponse.json({
      isAffiliate: true,
      profile: {
        id: profile.id,
        code: profile.code,
        status: profile.status,
        payoutMethod: profile.payoutMethod,
        payoutNumber: profile.payoutNumber,
        totalClicks: profile.totalClicks,
        totalEarnings: Number(profile.totalEarnings),
        availableBalance: Number(profile.availableBalance),
        paidOutAmount: Number(profile.paidOutAmount),
        createdAt: profile.createdAt,
      },
      referralLink,
      metrics: {
        totalClicks: profile.totalClicks,
        totalReferrals: profile.referrals.length,
        activePaidReferrals,
        totalEarnings: Number(profile.totalEarnings),
        availableBalance: Number(profile.availableBalance),
        paidOutAmount: Number(profile.paidOutAmount),
      },
      referrals: profile.referrals.map((ref) => ({
        id: ref.id,
        name: ref.referredUser.name,
        email: ref.referredUser.email,
        registeredAt: ref.createdAt,
        isPaid: ref.referredUser.subscriptions.some((sub) => sub.status === 'ACTIVE'),
      })),
      earnings: profile.earnings.map((e) => ({
        id: e.id,
        subscriptionAmount: Number(e.subscriptionAmount),
        commissionRate: Number(e.commissionRate),
        commissionAmount: Number(e.commissionAmount),
        status: e.status,
        description: e.description,
        createdAt: e.createdAt,
      })),
      payoutRequests: profile.payoutRequests.map((p) => ({
        id: p.id,
        amount: Number(p.amount),
        paymentMethod: p.paymentMethod,
        accountNumber: p.accountNumber,
        status: p.status,
        adminNote: p.adminNote,
        transactionId: p.transactionId,
        processedAt: p.processedAt,
        createdAt: p.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching affiliate stats:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch affiliate statistics' }, { status: 500 });
  }
}
