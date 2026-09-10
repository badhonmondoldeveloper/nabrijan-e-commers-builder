import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'products:read');

    const media = await db.media.findMany({
      where: { storeId: params.storeId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, media });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch media assets' },
      { status: 400 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'products:write');

    const body = await req.json();
    const { fileName, fileUrl, fileType, fileSize, mimeType } = body;

    if (!fileName || !fileUrl) {
      return NextResponse.json(
        { message: 'FileName and FileURL are required' },
        { status: 400 }
      );
    }

    const item = await db.media.create({
      data: {
        storeId: params.storeId,
        fileName: fileName.trim(),
        fileUrl: fileUrl.trim(),
        fileType: fileType || 'IMAGE',
        fileSize: Number(fileSize) || 1024,
        mimeType: mimeType || 'image/png',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Media asset uploaded successfully',
      media: item,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to upload media asset' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'products:write');

    const { searchParams } = new URL(req.url);
    const mediaId = searchParams.get('mediaId');

    if (!mediaId) {
      return NextResponse.json({ message: 'Media ID required' }, { status: 400 });
    }

    await db.media.deleteMany({
      where: { id: mediaId, storeId: params.storeId },
    });

    return NextResponse.json({ success: true, message: 'Media asset deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to delete media asset' },
      { status: 400 }
    );
  }
}
