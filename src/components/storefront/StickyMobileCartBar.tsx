'use client';

import React from 'react';
import { ShoppingBag, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StickyMobileCartBarProps {
  productTitle: string;
  price: number;
  salePrice?: number | null;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export default function StickyMobileCartBar({
  productTitle,
  price,
  salePrice,
  onAddToCart,
  onBuyNow,
}: StickyMobileCartBarProps) {
  const currentPrice = salePrice || price;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-3 md:hidden shadow-2xl flex items-center justify-between space-x-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-white truncate">{productTitle}</p>
        <div className="flex items-baseline space-x-1.5 mt-0.5">
          <span className="text-sm font-black text-emerald-400">৳{currentPrice}</span>
          {salePrice && price > salePrice && (
            <span className="text-[10px] text-slate-500 line-through">৳{price}</span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <Button
          onClick={onAddToCart}
          variant="outline"
          size="sm"
          className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 h-10 px-3 text-xs"
        >
          <ShoppingBag className="w-4 h-4 mr-1 text-blue-400" /> Cart
        </Button>
        <Button
          onClick={onBuyNow}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-4 text-xs shadow-lg"
        >
          <Zap className="w-4 h-4 mr-1 text-amber-300 fill-amber-300" /> Buy Now (COD)
        </Button>
      </div>
    </div>
  );
}
