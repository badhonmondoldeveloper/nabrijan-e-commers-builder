import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyStoreAccess } from '@/lib/auth/rbac';

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { user } = await verifyStoreAccess(params.storeId, 'settings:write');
    const { primaryColor, sections } = await req.json();

    const themeSettings = await db.storeThemeSettings.findUnique({
      where: { storeId: params.storeId },
    });

    if (!themeSettings) {
      return NextResponse.json({ message: 'Store theme settings not found' }, { status: 404 });
    }

    // Update primary brand color & publish configuration
    const updated = await db.storeThemeSettings.update({
      where: { id: themeSettings.id },
      data: {
        colorsConfig: JSON.stringify({ primary: primaryColor || '#2563eb', secondary: '#4f46e5' }),
        updatedAt: new Date(),
      },
    });

    // Update section hierarchy & visibility
    if (sections && Array.isArray(sections)) {
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        if (sec.id && !sec.id.startsWith('sec_')) {
          await db.themeSection.update({
            where: { id: sec.id },
            data: {
              sortOrder: i,
              title: sec.title,
              subtitle: sec.subtitle,
            },
          });
        }
      }
    }

    // Audit log
    await db.auditLog.create({
      data: {
        actorId: user.id,
        actorEmail: user.email,
        storeId: params.storeId,
        action: 'THEME_PUBLISH',
        resource: 'StoreThemeSettings',
        resourceId: themeSettings.id,
        details: JSON.stringify({ primaryColor, sectionCount: sections?.length || 0 }),
      },
    });

    return NextResponse.json({ success: true, themeSettings: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to publish theme' }, { status: 400 });
  }
}
