import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, CheckCircle2, Star } from 'lucide-react';
import AddToCartForm from '@/components/storefront/AddToCartForm';
import ProductReviewsSection from '@/components/storefront/ProductReviewsSection';

export default async function StoreProductDetailPage({
  params,
}: {
  params: { slug: string; productSlug: string };
}) {
  const store = await db.store.findUnique({
    where: { slug: params.slug },
  });

  if (!store) notFound();

  const product = await db.product.findUnique({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: params.productSlug,
      },
    },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
      reviews: { where: { status: 'APPROVED' }, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/store/${store.slug}`}
            className="inline-flex items-center text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Storefront
          </Link>
          <span className="font-bold text-slate-900 text-sm">{store.name}</span>
          <Link href={`/store/${store.slug}/cart`}>
            <Button variant="outline" size="sm" className="border-slate-200 text-slate-700">
              <ShoppingBag className="w-4 h-4 mr-1" /> Cart
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Product Container */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              {product.images[0] ? (
                <img
                  src={product.images[0].url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  No Image Available
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt={product.title}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Purchase Controls */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <Badge variant="outline" className="mb-2 border-emerald-500/30 text-emerald-700 bg-emerald-50">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> In Stock ({product.stock} available)
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{product.title}</h1>
                <p className="text-xs text-slate-500 font-mono mt-1">SKU: {product.sku || 'N/A'}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-blue-600">
                  ৳{product.salePrice || product.regularPrice}
                </span>
                {product.salePrice && (
                  <span className="text-lg text-slate-400 line-through">৳{product.regularPrice}</span>
                )}
              </div>

              {product.shortDescription && (
                <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Interactive Add to Cart Form Component */}
            <AddToCartForm storeSlug={store.slug} product={product} />

            {/* Merchant Guarantee Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-slate-700">Cash on Delivery Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-slate-700">100% Quality Checked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12">
          <ProductReviewsSection
            storeSlug={store.slug}
            productId={product.id}
            reviews={product.reviews || []}
          />
        </div>
      </main>
    </div>
  );
}
