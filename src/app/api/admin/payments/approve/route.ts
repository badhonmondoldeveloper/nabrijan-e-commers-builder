import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifySuperAdmin } from '@/lib/auth/rbac';

export async function POST(req: Request) {
  try {
    await verifySuperAdmin();

    const { submissionId, action, adminNotes } = await req.json();

    if (!submissionId || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ message: 'Invalid submission ID or action.' }, { status: 400 });
    }

    const submission = await db.manualPaymentSubmission.findUnique({
      where: { id: submissionId },
      include: { store: true, user: true },
    });

    if (!submission) {
      return NextResponse.json({ message: 'Payment submission not found.' }, { status: 404 });
    }

    if (action === 'APPROVE') {
      // 1. Update submission status to APPROVED
      await db.manualPaymentSubmission.update({
        where: { id: submissionId },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
          adminNotes: adminNotes || 'Approved by Super Admin',
        },
      });

      // 2. Make Store LIVE (status = ACTIVE)
      await db.store.update({
        where: { id: submission.storeId },
        data: { status: 'ACTIVE' },
      });

      // 3. Find or Create Plan (Pro / Starter / Growth)
      let plan = null;
      if (submission.planId) {
        plan = await db.plan.findUnique({ where: { id: submission.planId } });
      }
      if (!plan) {
        plan = await db.plan.findFirst({ where: { slug: { in: ['basic', 'pro', 'starter', 'growth', 'full-package'] } } });
      }
      if (!plan) {
        plan = await db.plan.create({
          data: {
            name: 'Pro',
            slug: 'pro',
            price: 1099,
            isPopular: true,
            storeLimit: 3,
            productLimit: 2000,
            staffLimit: 10,
            customDomainAllowed: true,
          },
        });
      }

      // 4. Create/Extend Subscription
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      const existingSub = await db.subscription.findFirst({
        where: { storeId: submission.storeId },
      });

      if (existingSub) {
        await db.subscription.update({
          where: { id: existingSub.id },
          data: {
            status: 'ACTIVE',
            planId: plan.id,
            currentPeriodStart: new Date(),
            currentPeriodEnd: thirtyDaysFromNow,
          },
        });
      } else {
        await db.subscription.create({
          data: {
            userId: submission.userId,
            storeId: submission.storeId,
            planId: plan.id,
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: thirtyDaysFromNow,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: `Payment approved! Store "${submission.store.name}" is now LIVE!`,
      });
    } else {
      // REJECT action
      await db.manualPaymentSubmission.update({
        where: { id: submissionId },
        data: {
          status: 'REJECTED',
          adminNotes: adminNotes || 'Invalid bKash Transaction ID or payment not received',
        },
      });

      // Keep store status as PAYMENT_REQUIRED
      await db.store.update({
        where: { id: submission.storeId },
        data: { status: 'PAYMENT_REQUIRED' },
      });

      return NextResponse.json({
        success: true,
        message: `Payment submission rejected for store "${submission.store.name}".`,
      });
    }
  } catch (error: any) {
    console.error('Admin payment approval error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
