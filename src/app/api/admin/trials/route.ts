import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifySuperAdmin } from '@/lib/auth/rbac';

export async function GET() {
  try {
    await verifySuperAdmin();
    const trials = await db.trial.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        store: { select: { name: true, slug: true } },
        user: { select: { email: true, name: true } }
      }
    });

    return NextResponse.json({ success: true, trials });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch trials' }, { status: 500 });
  }
}
