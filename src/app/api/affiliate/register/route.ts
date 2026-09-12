import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { getAuthSession } from '@/lib/auth/session';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || !session.userId) {
      return NextResponse.json({ message: 'UNAUTHORIZED: Please login first' }, { status: 401 });
    }

    const body = await req.json();
    const { payoutMethod = 'bkash', payoutNumber, customCode } = body;

    if (!payoutNumber || payoutNumber.trim().length < 11) {
      return NextResponse.json({ message: 'Valid bKash or Nagad number (11 digits) is required' }, { status: 400 });
    }

    // Check if affiliate profile already exists
    const existing = await db.affiliateProfile.findUnique({
      where: { userId: session.userId },
    });

    if (existing) {
      // Update existing profile info
      const updated = await db.affiliateProfile.update({
        where: { id: existing.id },
        data: {
          payoutMethod: payoutMethod.toLowerCase(),
          payoutNumber: payoutNumber.trim(),
        },
      });
      return NextResponse.json({ success: true, profile: updated, message: 'Affiliate profile updated successfully' });
    }

    // Generate unique affiliate code
    let code = customCode ? customCode.trim().toUpperCase() : '';
    if (!code || code.length < 3) {
      const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
      code = `NAB-${randomPart}`;
    }

    // Ensure code uniqueness
    const codeCheck = await db.affiliateProfile.findUnique({
      where: { code },
    });

    if (codeCheck) {
      const extraRand = crypto.randomBytes(3).toString('hex').toUpperCase();
      code = `NAB-${extraRand}`;
    }

    // Create new AffiliateProfile
    const profile = await db.affiliateProfile.create({
      data: {
        userId: session.userId,
        code,
        status: 'ACTIVE',
        payoutMethod: payoutMethod.toLowerCase(),
        payoutNumber: payoutNumber.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      profile,
      message: 'Congratulations! You are now an official Nabrijan Affiliate.',
    });
  } catch (error: any) {
    console.error('Error registering affiliate:', error);
    return NextResponse.json({ message: error.message || 'Failed to create affiliate account' }, { status: 500 });
  }
}
