import React from 'react';

interface ProductJsonLdProps {
  name: string;
  description?: string;
  images?: string[];
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock';
  brandName?: string;
  sku?: string;
  url: string;
}

export function ProductJsonLd({
  name,
  description,
  images = [],
  price,
  currency = 'BDT',
  availability = 'InStock',
  brandName = 'Nabrijan Merchant',
  sku,
  url,
}: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description || name,
    image: images.length > 0 ? images : ['https://nabrijan.site/og-image.png'],
    sku: sku || name.toLowerCase().replace(/\s+/g, '-'),
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: currency,
      price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: `https://schema.org/${availability}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
