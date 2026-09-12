import { db } from '@/lib/db/prisma';

/**
 * Record a referral mapping when a new merchant/user registers using an affiliate referral code.
 */
export async function recordReferral(referredUserId: string, referralCode: string, referredUserEmail?: string) {
  try {
    if (!referralCode || !referredUserId) return null;

    const affiliate = await db.affiliateProfile.findUnique({
      where: { code: referralCode },
    });

    if (!affiliate || affiliate.status !== 'ACTIVE') return null;

    // Prevent self-referral
    if (affiliate.userId === referredUserId) return null;

    // Upsert referral mapping
    const mapping = await db.referralMapping.upsert({
      where: { referredUserId },
      update: { affiliateId: affiliate.id },
      create: {
        affiliateId: affiliate.id,
        referredUserId,
        referredUserEmail,
      },
    });

    return mapping;
  } catch (error) {
    console.error('Error recording referral mapping:', error);
    return null;
  }
}

/**
 * Track an affiliate link click by incrementing the click counter.
 */
export async function trackAffiliateClick(code: string) {
  try {
    if (!code) return;
    await db.affiliateProfile.updateMany({
      where: { code, status: 'ACTIVE' },
      data: {
        totalClicks: { increment: 1 },
      },
    });
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
  }
}

/**
 * Calculate and record 15% recurring affiliate commission when a subscription payment is completed.
 */
export async function processAffiliateCommission(
  userId: string,
  subscriptionAmount: number,
  paymentTxnId?: string
) {
  try {
    if (!userId || !subscriptionAmount || subscriptionAmount <= 0) return null;

    // Check if the paying user was referred by an affiliate
    const referral = await db.referralMapping.findUnique({
      where: { referredUserId: userId },
      include: { affiliate: true },
    });

    if (!referral || !referral.affiliate || referral.affiliate.status !== 'ACTIVE') {
      return null;
    }

    const affiliate = referral.affiliate;

    // Prevent self-referral commission safeguard
    if (affiliate.userId === userId) return null;

    // Calculate 15% recurring lifetime commission
    const commissionRate = 15.0; // 15%
    const commissionAmount = Math.round(subscriptionAmount * (commissionRate / 100.0) * 100) / 100;

    if (commissionAmount <= 0) return null;

    // Execute atomic transaction to record earning and increase balance
    const [earning] = await db.$transaction([
      db.affiliateEarning.create({
        data: {
          affiliateId: affiliate.id,
          referredUserId: userId,
          paymentTxnId,
          subscriptionAmount,
          commissionRate,
          commissionAmount,
          status: 'APPROVED',
          description: `15% Recurring Commission on ৳${subscriptionAmount} Subscription Payment`,
        },
      }),
      db.affiliateProfile.update({
        where: { id: affiliate.id },
        data: {
          totalEarnings: { increment: commissionAmount },
          availableBalance: { increment: commissionAmount },
        },
      }),
    ]);

    return earning;
  } catch (error) {
    console.error('Error processing affiliate commission:', error);
    return null;
  }
}
