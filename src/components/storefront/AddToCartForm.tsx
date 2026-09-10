'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight, Check } from 'lucide-react';

export default function AddToCartForm({
  storeSlug,
  product,
}: {
  storeSlug: string;
  product: any;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (directCheckout = false) => {
    const cartItem = {
      productId: product.id,
      title: product.title,
      price: product.salePrice || product.regularPrice,
      costPrice: product.costPrice || 0,
      quantity,
      image: product.images?.[0]?.url || '',
    };

    // Store in localStorage for store customer session
    const cartKey = `cart_${storeSlug}`;
    const existing = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const existingIndex = existing.findIndex((i: any) => i.productId === product.id);

    if (existingIndex > -1) {
      existing[existingIndex].quantity += quantity;
    } else {
      existing.push(cartItem);
    }

    localStorage.setItem(cartKey, JSON.stringify(existing));

    if (directCheckout) {
      router.push(`/checkout/${storeSlug}`);
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  return (
    <div className="space-y-4 border-t border-slate-100 pt-4">
      <div className="flex items-center space-x-3">
        <span className="text-xs font-semibold text-slate-700">Quantity:</span>
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold"
          >
            -
          </button>
          <span className="px-3 py-1 text-sm font-semibold text-slate-900">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          onClick={() => handleAddToCart(false)}
          variant="outline"
          className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold h-11"
        >
          {added ? (
            <span className="flex items-center text-emerald-600">
              <Check className="w-4 h-4 mr-1.5" /> Added to Cart
            </span>
          ) : (
            <span className="flex items-center">
              <ShoppingBag className="w-4 h-4 mr-1.5" /> Add to Cart
            </span>
          )}
        </Button>

        <Button
          type="button"
          onClick={() => handleAddToCart(true)}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-11 shadow-lg shadow-blue-600/20"
        >
          Buy Now (Order COD) <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
