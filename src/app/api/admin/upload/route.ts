import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized. Super Admin access required.' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No image file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ message: 'Only image files (PNG, JPG, WEBP, SVG) are allowed' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileExt = path.extname(file.name) || '.png';
    const safeBaseName = path.basename(file.name, fileExt).toLowerCase().replace(/[^a-z0-9]/g, '-');
    const fileName = `site-logo-${safeBaseName}-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (error: any) {
    console.error('Super admin logo upload error:', error);
    return NextResponse.json({ message: error.message || 'Logo upload failed' }, { status: 400 });
  }
}
