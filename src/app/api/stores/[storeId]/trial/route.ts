import { NextResponse } from 'next/server';
import { TrialService } from '@/lib/tenancy/trial-service';
import { verifyStoreAccess } from '@/lib/auth/rbac';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId);
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure trial is initialized if missing
    let trial = await TrialService.getTrialStatus(params.storeId);
    if (!trial) {
      await TrialService.activateTrial(user.id, params.storeId, 7);
      trial = await TrialService.getTrialStatus(params.storeId);
    }

    return NextResponse.json({ success: true, trial });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch trial' }, { status: 500 });
  }
}
