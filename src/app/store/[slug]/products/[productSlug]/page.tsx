import { redirect } from 'next/navigation';

export default function StoreProductsAliasPage({
  params,
}: {
  params: { slug: string; productSlug: string };
}) {
  redirect(`/store/${params.slug}/product/${params.productSlug}`);
}
