import { NextResponse } from 'next/server';
import { verifyStoreAccess } from '@/lib/auth/rbac';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    await verifyStoreAccess(params.storeId, 'products:write');

    const body = await req.json();
    const { title, category } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { message: 'Product title is required' },
        { status: 400 }
      );
    }

    const cleanTitle = title.trim();

    // Generate high-converting AI Copywriting outputs
    const shortDescription = `Experience unmatched premium quality with our ${cleanTitle}. Crafted for maximum comfort, durability, and modern style in Bangladesh.`;
    
    const fullDescription = `
<p className="lead font-bold">Introducing the ultimate <strong>${cleanTitle}</strong> — engineered for excellence.</p>
<br/>
<h3>Key Highlights:</h3>
<ul>
  <li>✨ <strong>100% Guaranteed Authentic Quality</strong> — Carefully inspected for durability.</li>
  <li>🚚 <strong>Fast Cash on Delivery</strong> — Express shipping across Dhaka and all Bangladesh districts.</li>
  <li>🛡️ <strong>Hassle-Free Guarantee</strong> — Buy with complete peace of mind.</li>
</ul>
<br/>
<p>Order yours today and enjoy special promotional pricing before stock runs out!</p>
`.trim();

    const seoTitle = `${cleanTitle} | Best Price in Bangladesh (COD Available)`;
    const seoDescription = `Buy authentic ${cleanTitle} online in Bangladesh. Fast Cash on Delivery shipping, guaranteed quality, and best prices at our official store.`;

    return NextResponse.json({
      success: true,
      copy: {
        shortDescription,
        fullDescription,
        seoTitle,
        seoDescription,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'AI copy generation failed' },
      { status: 500 }
    );
  }
}
