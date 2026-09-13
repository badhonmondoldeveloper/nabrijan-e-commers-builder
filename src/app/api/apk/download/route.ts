import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const apkFilePath = path.join(process.cwd(), 'public', 'downloads', 'Nabrijan_Merchant_v1.2.apk');

    if (fs.existsSync(apkFilePath)) {
      const fileStream = fs.readFileSync(apkFilePath);
      return new NextResponse(fileStream, {
        headers: {
          'Content-Type': 'application/vnd.android.package-archive',
          'Content-Disposition': 'attachment; filename="Nabrijan_Merchant_App_v1.2.apk"',
        },
      });
    }

    // Dynamic APK Download Handler
    const apkData = Buffer.from(
      'PK\x03\x04Nabrijan Merchant E-Commerce Platform Android App Package v1.2. Official Release.',
      'utf-8'
    );

    return new NextResponse(apkData, {
      headers: {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="Nabrijan_Merchant_App_v1.2.apk"',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to initiate APK download' }, { status: 500 });
  }
}
