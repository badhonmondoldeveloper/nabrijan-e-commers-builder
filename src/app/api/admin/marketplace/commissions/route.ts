import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifySuperAdmin } from '@/lib/auth/rbac';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    await verifySuperAdmin();

    let settings = await db.platformSettings.findUnique({
      where: { id: 'global-settings' },
    });

    if (!settings) {
      settings = await db.platformSettings.create({
        data: {
          id: 'global-settings',
          defaultCommissionRate: new Prisma.Decimal('0.0200'),
          minWithdrawalLimit: new Prisma.Decimal('500.00'),
          autoApproveProducts: false,
        },
      });
    }

    const categoryCommissions = await db.categoryCommission.findMany({
      orderBy: { categoryName: 'asc' },
    });

    return NextResponse.json({
      success: true,
      settings: {
        ...settings,
        defaultCommissionRate: settings.defaultCommissionRate.toString(),
        minWithdrawalLimit: settings.minWithdrawalLimit.toString(),
      },
      categoryCommissions: categoryCommissions.map((cc) => ({
        ...cc,
        commissionRate: cc.commissionRate.toString(),
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch platform settings' }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    await verifySuperAdmin();

    const body = await req.json();
    const { defaultCommissionRate, minWithdrawalLimit, autoApproveProducts, categoryOverrides } = body;

    const rateDecimal = new Prisma.Decimal(defaultCommissionRate || '0.02');
    if (rateDecimal.lt(0) || rateDecimal.gt(1)) {
      return NextResponse.json({ message: 'Commission rate must be between 0.00 and 1.00 (e.g. 0.02 for 2%)' }, { status: 400 });
    }

    const minLimitDecimal = new Prisma.Decimal(minWithdrawalLimit || '500');
    if (minLimitDecimal.lt(0)) {
      return NextResponse.json({ message: 'Invalid minimum withdrawal limit' }, { status: 400 });
    }

    const settings = await db.platformSettings.upsert({
      where: { id: 'global-settings' },
      update: {
        defaultCommissionRate: rateDecimal,
        minWithdrawalLimit: minLimitDecimal,
        autoApproveProducts: Boolean(autoApproveProducts),
      },
      create: {
        id: 'global-settings',
        defaultCommissionRate: rateDecimal,
        minWithdrawalLimit: minLimitDecimal,
        autoApproveProducts: Boolean(autoApproveProducts),
      },
    });

    // Handle Category Override saves if provided
    if (Array.isArray(categoryOverrides)) {
      for (const override of categoryOverrides) {
        if (override.categoryName && override.commissionRate) {
          await db.categoryCommission.upsert({
            where: { categoryName: override.categoryName },
            update: {
              commissionRate: new Prisma.Decimal(override.commissionRate),
            },
            create: {
              categoryName: override.categoryName,
              commissionRate: new Prisma.Decimal(override.commissionRate),
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Platform commission and financial settings updated successfully!',
      settings: {
        ...settings,
        defaultCommissionRate: settings.defaultCommissionRate.toString(),
        minWithdrawalLimit: settings.minWithdrawalLimit.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update platform settings' }, { status: 400 });
  }
}
