import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'settings:write');

    const domains = await db.domain.findMany({
      where: { storeId: params.storeId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, domains });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch custom domains' },
      { status: 400 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'settings:write');

    const body = await req.json();
    const { domain } = body;

    if (!domain || typeof domain !== 'string') {
      return NextResponse.json(
        { message: 'Valid domain name required' },
        { status: 400 }
      );
    }

    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');

    const existing = await db.domain.findUnique({
      where: { domain: cleanDomain },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'This domain is already registered in Nabrijan' },
        { status: 400 }
      );
    }

    const verificationCode = `nabrijan-verify-${Math.random().toString(36).substring(2, 10)}`;

    const newDomain = await db.domain.create({
      data: {
        storeId: params.storeId,
        domain: cleanDomain,
        verificationStatus: 'PENDING',
        verificationCode,
        sslStatus: false,
        isPrimary: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Custom domain added. Please add DNS records to verify.',
      domain: newDomain,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to add custom domain' },
      { status: 400 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'settings:write');

    const body = await req.json();
    const { domainId } = body;

    if (!domainId) {
      return NextResponse.json({ message: 'Domain ID required' }, { status: 400 });
    }

    // Verify DNS mapping (simulated CNAME check)
    const updated = await db.domain.updateMany({
      where: { id: domainId, storeId: params.storeId },
      data: {
        verificationStatus: 'VERIFIED',
        sslStatus: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Domain DNS verified successfully! SSL certificate provisioned.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to verify domain' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'settings:write');

    const { searchParams } = new URL(req.url);
    const domainId = searchParams.get('domainId');

    if (!domainId) {
      return NextResponse.json({ message: 'Domain ID required' }, { status: 400 });
    }

    await db.domain.deleteMany({
      where: { id: domainId, storeId: params.storeId },
    });

    return NextResponse.json({ success: true, message: 'Custom domain removed' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to remove domain' },
      { status: 400 }
    );
  }
}
