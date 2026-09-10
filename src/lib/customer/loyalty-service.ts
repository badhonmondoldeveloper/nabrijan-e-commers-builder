import { db } from '@/lib/db';

export class LoyaltyService {
  /**
   * Calculates VIP Tier based on cumulative points
   */
  static getTier(totalEarned: number): 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' {
    if (totalEarned >= 3000) return 'PLATINUM';
    if (totalEarned >= 1500) return 'GOLD';
    if (totalEarned >= 500) return 'SILVER';
    return 'BRONZE';
  }

  /**
   * Adds loyalty points for customer actions (purchase, signup, review)
   */
  static async addPoints(
    storeId: string,
    customerPhone: string,
    points: number,
    type: 'SIGNUP' | 'PURCHASE' | 'REVIEW' | 'REFERRAL',
    description: string
  ) {
    let account = await db.loyaltyAccount.findUnique({
      where: { storeId_customerPhone: { storeId, customerPhone } }
    });

    if (!account) {
      account = await db.loyaltyAccount.create({
        data: { storeId, customerPhone, pointsBalance: 0, totalEarned: 0 }
      });
    }

    const newTotalEarned = account.totalEarned + points;
    const newBalance = account.pointsBalance + points;
    const newTier = this.getTier(newTotalEarned);

    return db.$transaction(async (tx) => {
      const updatedAccount = await tx.loyaltyAccount.update({
        where: { id: account!.id },
        data: {
          pointsBalance: newBalance,
          totalEarned: newTotalEarned,
          tier: newTier
        }
      });

      const transaction = await tx.loyaltyTransaction.create({
        data: {
          loyaltyAccountId: account!.id,
          points,
          type,
          description
        }
      });

      return { account: updatedAccount, transaction };
    });
  }

  /**
   * Processes customer referral reward without duplication
   */
  static async processReferral(
    storeId: string,
    referrerPhone: string,
    refereePhone: string,
    rewardAmount: number = 50
  ) {
    if (referrerPhone === refereePhone) {
      throw new Error('Self-referrals are not permitted');
    }

    const existing = await db.referral.findFirst({
      where: { storeId, referrerPhone, refereePhone }
    });

    if (existing) {
      return { success: false, message: 'Referral reward already claimed' };
    }

    const referralCode = `REF-${Math.floor(100000 + Math.random() * 900000)}`;

    const referral = await db.referral.create({
      data: {
        storeId,
        referrerPhone,
        refereePhone,
        referralCode,
        status: 'COMPLETED',
        rewardAmount
      }
    });

    // Add 100 bonus loyalty points to referrer
    await this.addPoints(storeId, referrerPhone, 100, 'REFERRAL', `Referral bonus for inviting ${refereePhone}`);

    return { success: true, referral };
  }
}
