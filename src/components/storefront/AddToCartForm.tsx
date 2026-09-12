'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight, Check, MessageCircle } from 'lucide-react';

interface Variant {
  id: string;
  title: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  attributes: string | Record<string, string>;
}

export default function AddToCartForm({
  storeSlug,
  product,
  storePhone,
}: {
  storeSlug: string;
  product: any;
  storePhone?: string;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Extract variants & parsed attributes
  const variants: Variant[] = useMemo(() => {
    if (!product.variants || !Array.isArray(product.variants)) return [];
    return product.variants.map((v: any) => {
      let attrs: Record<string, string> = {};
      if (typeof v.attributes === 'string') {
        try {
          attrs = JSON.parse(v.attributes);
        } catch {
          attrs = {};
        }
      } else if (typeof v.attributes === 'object' && v.attributes !== null) {
        attrs = v.attributes;
      }
      return { ...v, attributes: attrs };
    });
  }, [product.variants]);

  // Extract distinct Size and Color options from variants
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    variants.forEach((v) => {
      if (v.attributes.Size) set.add(v.attributes.Size);
    });
    return Array.from(set);
  }, [variants]);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    variants.forEach((v) => {
      if (v.attributes.Color) set.add(v.attributes.Color);
    });
    return Array.from(set);
  }, [variants]);

  // Selected Size & Color state
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0] || '');

  // Find currently matched variant
  const matchedVariant = useMemo(() => {
    if (variants.length === 0) return null;
    return (
      variants.find((v) => {
        const matchSize = !selectedSize || v.attributes.Size === selectedSize;
        const matchColor = !selectedColor || v.attributes.Color === selectedColor;
        return matchSize && matchColor;
      }) || variants[0]
    );
  }, [variants, selectedSize, selectedColor]);

  // Active price & stock
  const activePrice = matchedVariant
    ? Number(matchedVariant.salePrice || matchedVariant.price)
    : Number(product.salePrice || product.regularPrice);

  const activeRegularPrice = matchedVariant
    ? Number(matchedVariant.price)
    : Number(product.regularPrice);

  const activeStock = matchedVariant ? matchedVariant.stock : product.stock;

  const handleAddToCart = (directCheckout = false) => {
    const cartItem = {
      productId: product.id,
      variantId: matchedVariant?.id || null,
      title: product.title + (matchedVariant ? ` (${matchedVariant.title})` : ''),
      price: activePrice,
      costPrice: Number(product.costPrice) || 0,
      quantity,
      image: product.images?.[0]?.url || '',
      attributes: matchedVariant ? matchedVariant.attributes : null,
    };

    const cartKey = `cart_${storeSlug}`;
    const existing = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const existingIndex = existing.findIndex(
      (i: any) => i.productId === product.id && i.variantId === (matchedVariant?.id || null)
    );

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

  const handleWhatsAppOrder = () => {
    const phone = storePhone || '8801700000000';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const variantText = matchedVariant ? ` (Size: ${selectedSize || 'N/A'}, Color: ${selectedColor || 'N/A'})` : '';
    const message = `Hello! I would like to buy "${product.title}"${variantText}.\nPrice: ৳${activePrice}\nQuantity: ${quantity}\nURL: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-5 border-t border-slate-100 pt-4 font-sans">
      {/* Price Display */}
      <div className="flex items-baseline space-x-3">
        <span className="text-3xl font-black text-blue-600">৳{activePrice}</span>
        {activeRegularPrice > activePrice && (
          <span className="text-lg text-slate-400 line-through">৳{activeRegularPrice}</span>
        )}
      </div>

      {/* Size Selector */}
      {availableSizes.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Select Size: <span className="text-blue-600">{selectedSize}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((sz) => {
              const isSelected = selectedSize === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {availableColors.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Select Color: <span className="text-blue-600">{selectedColor}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((clr) => {
              const isSelected = selectedColor === clr;
              return (
                <button
                  key={clr}
                  type="button"
                  onClick={() => setSelectedColor(clr)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {clr}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity & Stock Selector */}
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
            onClick={() => setQuantity((q) => Math.min(activeStock || 99, q + 1))}
            className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold"
          >
            +
          </button>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          ({activeStock} units available)
        </span>
      </div>

      {/* Cart & Checkout Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="button"
          onClick={() => handleAddToCart(false)}
          variant="outline"
          className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold h-11 text-xs sm:text-sm"
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
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-11 text-xs sm:text-sm shadow-lg shadow-blue-600/20"
        >
          Order Cash on Delivery <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>

      {/* Instant WhatsApp Order Option */}
      <button
        type="button"
        onClick={handleWhatsAppOrder}
        className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition"
      >
        <MessageCircle className="w-4 h-4" />
        <span>WhatsApp-এ সরাসরি অর্ডার করুন</span>
      </button>
    </div>
  );
}
