import { MetadataRoute } from 'next';
import { db } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nabrijan.site';

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/marketplace`, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${baseUrl}/marketplace/products`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  try {
    // 2. Active Merchant Stores
    const stores = await db.store.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      take: 1000,
    });

    const storeUrls: MetadataRoute.Sitemap = stores.map((s) => ({
      url: `${baseUrl}/store/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    // 3. Central Marketplace Products
    const products = await db.product.findMany({
      where: {
        isMarketplaceListed: true,
        marketplaceStatus: 'APPROVED',
        status: 'ACTIVE',
      },
      select: { slug: true, updatedAt: true },
      take: 5000,
    });

    const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/marketplace/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'daily',
      priority: 0.9,
    }));

    return [...staticPages, ...storeUrls, ...productUrls];
  } catch (e) {
    console.warn('Sitemap dynamic database fetch skipped during build without DB URL:', e);
    return staticPages;
  }
}
