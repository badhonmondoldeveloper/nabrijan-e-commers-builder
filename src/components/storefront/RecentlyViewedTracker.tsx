'use client';

import { useEffect } from 'react';

interface ProductInfo {
  id: string;
  slug: string;
  title: string;
  price: number;
  regularPrice?: number;
  image?: string;
}

export default function RecentlyViewedTracker({ storeSlug, product }: { storeSlug: string; product: ProductInfo }) {
  useEffect(() => {
    try {
      const key = `recently_viewed_${storeSlug}`;
      const raw = localStorage.getItem(key);
      let list: ProductInfo[] = raw ? JSON.parse(raw) : [];

      // Remove existing item if present
      list = list.filter((item) => item.id !== product.id);

      // Prepend current product
      list.unshift(product);

      // Keep max 10
      list = list.slice(0, 10);

      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {}
  }, [storeSlug, product]);

  return null;
}
