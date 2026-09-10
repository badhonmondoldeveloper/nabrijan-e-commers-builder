import { NextResponse } from 'next/server';
import { TrialService } from '@/lib/tenancy/trial-service';
import { verifySuperAdmin } from '@/lib/auth/rbac';

export async function POST(req: Request) {
  try {
    const admin = await verifySuperAdmin();
    const body = await req.json();
    const { trialId, days, reason } = body;

    if (!trialId || !days || !reason) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const updated = await TrialService.extendTrial(trialId, admin.id, Number(days), reason);
    return NextResponse.json({ success: true, trial: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Trial extension failed' }, { status: 500 });
  }
}
