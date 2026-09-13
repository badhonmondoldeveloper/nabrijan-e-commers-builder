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
      const attrs = (v.attributes || {}) as Record<string, string>;
      if (attrs.Size) set.add(attrs.Size);
    });
    return Array.from(set);
  }, [variants]);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    variants.forEach((v) => {
      const attrs = (v.attributes || {}) as Record<string, string>;
      if (attrs.Color) set.add(attrs.Color);
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
        const attrs = (v.attributes || {}) as Record<string, string>;
        const matchSize = !selectedSize || attrs.Size === selectedSize;
        const matchColor = !selectedColor || attrs.Color === selectedColor;
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
      {/* Price Display (Matching Screen 2 in Screenshot) */}
      <div className="flex items-center justify-between border-b border-[#DCE7DF] pb-4">
        <div className="flex items-baseline space-x-3">
          <span className="text-3xl font-black text-[#063B2A]">৳{activePrice}</span>
          {activeRegularPrice > activePrice && (
            <span className="text-sm text-[#66736C] line-through font-semibold">৳{activeRegularPrice}</span>
          )}
        </div>

        {/* Stepper Quantity Counter (Matching Screen 2 `- 1 +` Stepper UI) */}
        <div className="flex items-center border border-[#DCE7DF] rounded-full px-3 py-1 bg-[#F6FAF4] space-x-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="text-[#66736C] hover:text-[#063B2A] font-extrabold text-sm"
          >
            -
          </button>
          <span className="text-sm font-black text-[#17221D]">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(activeStock || 99, q + 1))}
            className="w-5 h-5 rounded-full bg-[#EAF7DF] border border-[#55B510] text-[#063B2A] flex items-center justify-center font-bold text-xs hover:bg-[#55B510] hover:text-white transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Color Selector Pills (Matching Screen 2 Color Option Pills) */}
      {availableColors.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#063B2A] uppercase tracking-wider block">
            Color
          </label>
          <div className="flex flex-wrap gap-2.5">
            {availableColors.map((clr) => {
              const isSelected = selectedColor === clr;
              return (
                <button
                  key={clr}
                  type="button"
                  onClick={() => setSelectedColor(clr)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center space-x-2 border ${
                    isSelected
                      ? 'bg-white border-[#55B510] text-[#063B2A] shadow-xs ring-2 ring-[#55B510]/30'
                      : 'bg-[#F6FAF4] border-[#DCE7DF] text-[#17221D] hover:border-[#55B510]'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full border border-black/10 ${isSelected ? 'bg-[#55B510]' : 'bg-[#66736C]'}`}></span>
                  <span>{clr}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Storage / Size Selector Pills (Matching Screen 2 Storage Option Pills) */}
      {availableSizes.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#063B2A] uppercase tracking-wider block">
            Size / Option
          </label>
          <div className="flex flex-wrap gap-2.5">
            {availableSizes.map((sz) => {
              const isSelected = selectedSize === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition border ${
                    isSelected
                      ? 'bg-white border-[#55B510] text-[#063B2A] shadow-xs ring-2 ring-[#55B510]/30'
                      : 'bg-[#F6FAF4] border-[#DCE7DF] text-[#17221D] hover:border-[#55B510]'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Feature Specs - "A Snapshot View" (Matching Screen 2 Feature List) */}
      <div className="space-y-2 pt-2 border-t border-[#DCE7DF]">
        <h4 className="text-xs font-extrabold text-[#063B2A] uppercase tracking-wider">A Snapshot View</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#66736C]">
          <div className="flex items-center space-x-2 bg-[#F6FAF4] p-2.5 rounded-xl border border-[#DCE7DF]">
            <Check className="w-3.5 h-3.5 text-[#55B510]" />
            <span>100% Genuine Quality Product</span>
          </div>
          <div className="flex items-center space-x-2 bg-[#F6FAF4] p-2.5 rounded-xl border border-[#DCE7DF]">
            <Check className="w-3.5 h-3.5 text-[#55B510]" />
            <span>Fast Cash On Delivery in BD</span>
          </div>
        </div>
      </div>

      {/* Dual Action Pill Buttons: "Buy Now" and "Add to Cart" (Matching Screen 2 Buttons) */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="button"
          onClick={() => handleAddToCart(true)}
          variant="outline"
          className="flex-1 rounded-full border-2 border-[#063B2A] text-[#063B2A] hover:bg-[#063B2A] hover:text-white font-extrabold h-12 text-xs sm:text-sm transition duration-300"
        >
          Buy Now
        </Button>

        <Button
          type="button"
          onClick={() => handleAddToCart(false)}
          className="flex-1 rounded-full bg-[#55B510] hover:bg-[#063B2A] text-white font-extrabold h-12 text-xs sm:text-sm shadow-md transition duration-300"
        >
          {added ? (
            <span className="flex items-center">
              <Check className="w-4 h-4 mr-1.5" /> Added to Cart
            </span>
          ) : (
            <span className="flex items-center">
              <ShoppingBag className="w-4 h-4 mr-1.5" /> Add to Cart
            </span>
          )}
        </Button>
      </div>

      {/* Instant WhatsApp Order Option */}
      <button
        type="button"
        onClick={handleWhatsAppOrder}
        className="w-full flex items-center justify-center space-x-2 bg-[#EAF7DF] hover:bg-[#55B510] text-[#063B2A] hover:text-white text-xs font-bold py-2.5 px-4 rounded-full border border-[#55B510]/30 shadow-xs transition"
      >
        <MessageCircle className="w-4 h-4 text-[#55B510]" />
        <span>WhatsApp-এ সরাসরি অর্ডার করুন</span>
      </button>
    </div>
  );
}
