import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await verifyStoreAccess(params.storeId, 'products:write');

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No image file uploaded' }, { status: 400 });
    }

    // Validate file type (image only)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ message: 'Only image files (JPG, PNG, WEBP, GIF) are allowed' }, { status: 400 });
    }

    // Max 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate safe unique filename
    const fileExt = path.extname(file.name) || '.jpg';
    const safeBaseName = path.basename(file.name, fileExt).toLowerCase().replace(/[^a-z0-9]/g, '-');
    const fileName = `${safeBaseName}-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    // Create media database record
    const media = await db.media.create({
      data: {
        storeId: params.storeId,
        fileName: file.name,
        fileUrl: publicUrl,
        fileType: 'IMAGE',
        fileSize: file.size,
        mimeType: file.type,
      },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      media,
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json({ message: error.message || 'Image upload failed' }, { status: 400 });
  }
}
