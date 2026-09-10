import { db } from '@/lib/db';

export interface EntitlementCheckResult {
  allowed: boolean;
  featureKey: string;
  planName: string;
  requiredPlan?: string;
  limitValue?: number | null;
  message?: string;
}

export class EntitlementService {
  /**
   * Plan feature entitlement matrix defining which plans include which advanced features
   */
  static FEATURE_MATRIX: Record<string, { minPlan: string; defaultAllowedPlans: string[] }> = {
    AI_COPILOT: { minPlan: 'GROWTH', defaultAllowedPlans: ['GROWTH', 'PRO', 'BUSINESS', 'ENTERPRISE'] },
    CUSTOM_DOMAIN: { minPlan: 'GROWTH', defaultAllowedPlans: ['GROWTH', 'PRO', 'BUSINESS', 'ENTERPRISE'] },
    COURIER_AUTOMATION: { minPlan: 'STARTER', defaultAllowedPlans: ['STARTER', 'GROWTH', 'PRO', 'BUSINESS', 'ENTERPRISE'] },
    SMS_NOTIFICATIONS: { minPlan: 'GROWTH', defaultAllowedPlans: ['GROWTH', 'PRO', 'BUSINESS', 'ENTERPRISE'] },
    AUTOMATION: { minPlan: 'PRO', defaultAllowedPlans: ['PRO', 'BUSINESS', 'ENTERPRISE'] },
    LOYALTY: { minPlan: 'PRO', defaultAllowedPlans: ['PRO', 'BUSINESS', 'ENTERPRISE'] },
    B2B_WHOLESALE: { minPlan: 'BUSINESS', defaultAllowedPlans: ['BUSINESS', 'ENTERPRISE'] },
    ADVANCED_ANALYTICS: { minPlan: 'PRO', defaultAllowedPlans: ['PRO', 'BUSINESS', 'ENTERPRISE'] }
  };

  /**
   * Checks if store's active subscription plan grants access to a target feature key
   */
  static async checkEntitlement(storeId: string, featureKey: string): Promise<EntitlementCheckResult> {
    // 1. Fetch active subscription and plan details
    const subscription = await db.subscription.findFirst({
      where: {
        storeId,
        status: { in: ['TRIALING', 'ACTIVE', 'GRACE_PERIOD'] }
      },
      include: {
        plan: {
          include: { planFeatures: true }
        }
      }
    });

    const currentPlanSlug = subscription?.plan?.slug?.toUpperCase() || 'STARTER';
    const currentPlanName = subscription?.plan?.name || 'Starter Plan';

    const featureRule = this.FEATURE_MATRIX[featureKey];
    if (!featureRule) {
      return { allowed: true, featureKey, planName: currentPlanName };
    }

    // 2. Check if plan feature override exists in DB
    const dbFeatureOverride = subscription?.plan?.planFeatures?.find(f => f.featureKey === featureKey);
    if (dbFeatureOverride) {
      return {
        allowed: dbFeatureOverride.enabled,
        featureKey,
        planName: currentPlanName,
        requiredPlan: featureRule.minPlan,
        limitValue: dbFeatureOverride.limitValue,
        message: dbFeatureOverride.enabled ? undefined : `Feature ${featureKey} requires ${featureRule.minPlan} Plan`
      };
    }

    // 3. Fallback to default matrix rule
    const allowed = featureRule.defaultAllowedPlans.includes(currentPlanSlug);

    return {
      allowed,
      featureKey,
      planName: currentPlanName,
      requiredPlan: featureRule.minPlan,
      message: allowed ? undefined : `Feature ${featureKey} requires ${featureRule.minPlan} Plan or higher`
    };
  }
}
