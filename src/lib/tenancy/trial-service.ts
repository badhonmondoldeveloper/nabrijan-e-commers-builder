import { db } from '@/lib/db';

export interface TrialStatus {
  id: string;
  status: 'TRIAL_ACTIVE' | 'TRIAL_WARNING' | 'TRIAL_EXPIRED' | 'TRIAL_EXTENDED' | 'CONVERTED' | 'CANCELLED';
  startedAt: Date;
  endsAt: Date;
  daysLeft: number;
  hoursLeft: number;
  isExpired: boolean;
  extensionDays: number;
  checklistProgress: number; // 0 - 100%
}

export class TrialService {
  /**
   * Initializes 3-Day Trial for a newly created store idempotently
   */
  static async activateTrial(userId: string, storeId: string, customDurationDays: number = 3): Promise<any> {
    const existing = await db.trial.findUnique({ where: { storeId } });
    if (existing) return existing;

    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + customDurationDays * 24 * 60 * 60 * 1000);

    return db.trial.create({
      data: {
        userId,
        storeId,
        startedAt,
        endsAt,
        status: 'TRIAL_ACTIVE',
        extensionDays: 0
      }
    });
  }

  /**
   * Calculates real server-side UTC trial status and countdown
   */
  static async getTrialStatus(storeId: string): Promise<TrialStatus | null> {
    const trial = await db.trial.findUnique({ where: { storeId } });
    if (!trial) return null;

    const now = new Date().getTime();
    const end = new Date(trial.endsAt).getTime();
    const diffMs = end - now;

    let isExpired = diffMs <= 0;
    let daysLeft = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    let hoursLeft = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

    let status = trial.status as TrialStatus['status'];
    if (isExpired && status !== 'CONVERTED' && status !== 'CANCELLED') {
      status = 'TRIAL_EXPIRED';
      if (trial.status !== 'TRIAL_EXPIRED') {
        // Update trial status in DB
        await db.trial.update({ where: { id: trial.id }, data: { status: 'TRIAL_EXPIRED', expiredAt: new Date() } });
      }
    } else if (!isExpired && daysLeft <= 2 && status === 'TRIAL_ACTIVE') {
      status = 'TRIAL_WARNING';
    }

    const checklistProgress = await this.calculateChecklistProgress(storeId);

    return {
      id: trial.id,
      status,
      startedAt: trial.startedAt,
      endsAt: trial.endsAt,
      daysLeft,
      hoursLeft,
      isExpired,
      extensionDays: trial.extensionDays,
      checklistProgress
    };
  }

  /**
   * Admin extension of a trial with audit log
   */
  static async extendTrial(trialId: string, adminUserId: string, daysAdded: number, reason: string): Promise<any> {
    const trial = await db.trial.findUnique({ where: { id: trialId } });
    if (!trial) throw new Error('Trial not found');

    const oldEndsAt = new Date(trial.endsAt);
    const newEndsAt = new Date(oldEndsAt.getTime() + daysAdded * 24 * 60 * 60 * 1000);

    const updated = await db.trial.update({
      where: { id: trialId },
      data: {
        endsAt: newEndsAt,
        extensionDays: trial.extensionDays + daysAdded,
        extensionReason: reason,
        status: 'TRIAL_EXTENDED',
        updatedAt: new Date()
      }
    });

    await db.trialExtension.create({
      data: {
        trialId,
        adminUserId,
        daysAdded,
        reason,
        oldEndsAt,
        newEndsAt
      }
    });

    await db.auditLog.create({
      data: {
        actorId: adminUserId,
        actorEmail: 'admin@nabrijan.com',
        action: 'TRIAL_EXTENDED',
        resource: 'Trial',
        resourceId: trialId,
        details: JSON.stringify({ daysAdded, reason, oldEndsAt, newEndsAt })
      }
    });

    return updated;
  }

  /**
   * Store Launch Checklist progress calculator (0 - 100%)
   */
  static async calculateChecklistProgress(storeId: string): Promise<number> {
    let completed = 0;
    const total = 7;

    const store = await db.store.findUnique({
      where: { id: storeId },
      include: {
        _count: {
          select: {
            products: true,
            orders: true,
            domains: true
          }
        },
        courierIntegration: true,
        notificationTemplates: true
      }
    });

    if (!store) return 0;

    // Item 1: Store Created
    if (store) completed++;
    // Item 2: First Product Added
    if (store._count.products > 0) completed++;
    // Item 3: Theme Selected / Custom Domain setup
    if (store._count.domains > 0 || store.category) completed++;
    // Item 4: Courier Configured
    if (store.courierIntegration && store.courierIntegration.status === 'CONNECTED') completed++;
    // Item 5: Notification Template Customized
    if (store.notificationTemplates.length > 0) completed++;
    // Item 6: Store Published / Active
    if (store.status === 'ACTIVE') completed++;
    // Item 7: First Order Received
    if (store._count.orders > 0) completed++;

    return Math.round((completed / total) * 100);
  }
}
