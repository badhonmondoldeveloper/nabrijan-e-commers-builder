'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';

export default function StoreCartPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const cartKey = `cart_${params.slug}`;
    const items = JSON.parse(localStorage.getItem(cartKey) || '[]');
    setCartItems(items);
  }, [params.slug]);

  const updateQuantity = (idx: number, delta: number) => {
    const updated = [...cartItems];
    updated[idx].quantity = Math.max(1, updated[idx].quantity + delta);
    setCartItems(updated);
    localStorage.setItem(`cart_${params.slug}`, JSON.stringify(updated));
  };

  const removeItem = (idx: number) => {
    const updated = cartItems.filter((_, i) => i !== idx);
    setCartItems(updated);
    localStorage.setItem(`cart_${params.slug}`, JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Smart Cart Incentive threshold (Free shipping over ৳1000)
  const freeShippingThreshold = 1000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/store/${params.slug}`}
            className="inline-flex items-center text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Continue Shopping
          </Link>
          <span className="font-bold text-slate-900 text-sm">Shopping Cart</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Your Cart is Currently Empty</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              You haven't added any products to your shopping cart yet.
            </p>
            <Link href={`/store/${params.slug}`}>
              <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                Explore Store Catalog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Cart Items List */}
            <div className="md:col-span-2 space-y-4">
              {/* Smart Cart Banner */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center space-x-2 text-xs text-blue-900 font-medium">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    আর মাত্র <strong className="text-blue-700">৳{remainingForFreeShipping}</strong> টাকার কেনাকাটা করলে Free Shipping!
                  </span>
                ) : (
                  <span className="font-bold text-emerald-700">🎉 Congratulations! You have unlocked Free Shipping!</span>
                )}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-blue-600 font-bold">৳{item.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-slate-200 rounded-md bg-slate-50 text-xs">
                        <button
                          onClick={() => updateQuantity(idx, -1)}
                          className="px-2.5 py-1 font-bold text-slate-600 hover:bg-slate-200"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 font-semibold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(idx, 1)}
                          className="px-2.5 py-1 font-bold text-slate-600 hover:bg-slate-200"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary & Checkout */}
            <div className="space-y-4">
              <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900">৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Fee:</span>
                    <span className="text-xs text-slate-500">Calculated at Checkout</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-900 text-base">
                    <span>Estimated Total:</span>
                    <span className="text-blue-600">৳{subtotal}</span>
                  </div>

                  <Link href={`/checkout/${params.slug}`}>
                    <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-11 shadow-lg shadow-blue-600/20">
                      Proceed to COD Checkout <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
