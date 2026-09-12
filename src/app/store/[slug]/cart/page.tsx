'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trash2, ShoppingBag, ArrowRight, Tag, Truck, Clock, Plus, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function StoreCartPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    const cartKey = `cart_${params.slug}`;
    const items = JSON.parse(localStorage.getItem(cartKey) || '[]');
    setCartItems(items);

    // Countdown Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 600));
    }, 1000);

    return () => clearInterval(timer);
  }, [params.slug]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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

  const addAddOnItem = (title: string, price: number) => {
    const newItem = {
      id: `addon_${Date.now()}`,
      title,
      price,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&q=80',
    };
    const updated = [...cartItems, newItem];
    setCartItems(updated);
    localStorage.setItem(`cart_${params.slug}`, JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 1000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/store/${params.slug}`}
            className="inline-flex items-center text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> কেনাকাটা চালিয়ে যান
          </Link>
          <span className="font-bold text-slate-900 text-sm">শপিং কার্ট</span>
          <Link href={`/store/${params.slug}/track`} className="text-xs text-blue-600 font-bold hover:underline">
            অর্ডার ট্র্যাক করুন
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">আপনার শপিং কার্ট খালি</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              আপনার কার্টে এখনো কোনো পণ্য যুক্ত করা হয়নি।
            </p>
            <Link href={`/store/${params.slug}`}>
              <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold">
                দোকানের পণ্যসমূহ দেখুন
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 1. Cart Reservation Countdown Timer */}
            <div className="p-4 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white rounded-2xl shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-5 h-5 animate-pulse shrink-0" />
                <span className="text-xs sm:text-sm font-extrabold">
                  আপনার কার্টের পণ্যগুলো আগামী <span className="font-mono underline">{formatTime(timeLeft)}</span> মিনিটের জন্য রিজার্ভ করা হয়েছে!
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full shrink-0">
                LIMITED RESERVATION
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Cart Items List */}
              <div className="md:col-span-2 space-y-4">
                {/* Free Shipping Progress */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center space-x-2 text-xs text-blue-900 font-medium">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  {remainingForFreeShipping > 0 ? (
                    <span>
                      আর মাত্র <strong className="text-blue-700 font-black">৳{remainingForFreeShipping}</strong> টাকার কেনাকাটা করলে Free Shipping!
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-700">🎉 ফ্রি শিপিং আনলক হয়েছে!</span>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&q=80'}
                          alt={item.title}
                          className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{item.title}</h4>
                          <p className="text-xs text-blue-600 font-black">৳{item.price}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 text-xs">
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
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. Frequently Bought Together / Cross-Selling Section */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center">
                    <Plus className="w-4 h-4 text-emerald-600 mr-1.5" /> সচরাচর একসাথে কেনা হয় (Frequently Bought Together)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">ফাস্ট চার্জিং ইউএসবি ক্যাবল</div>
                        <div className="text-[11px] font-black text-emerald-600">৳১৯০</div>
                      </div>
                      <button
                        onClick={() => addAddOnItem('ফাস্ট চার্জিং ইউএসবি ক্যাবল', 190)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg shadow"
                      >
                        + যুক্ত করুন
                      </button>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">প্রিমিয়াম গিফট প্যাকেজিং</div>
                        <div className="text-[11px] font-black text-emerald-600">৳৮০</div>
                      </div>
                      <button
                        onClick={() => addAddOnItem('প্রিমিয়াম গিফট প্যাকেজিং', 80)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg shadow"
                      >
                        + যুক্ত করুন
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary & Checkout */}
              <div className="space-y-4">
                <Card className="bg-white border-slate-200 text-slate-900 shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base font-bold">অর্ডার সামারি</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>সাবটোটাল:</span>
                      <span className="font-bold text-slate-900">৳{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>ডেলিভারি চার্জ:</span>
                      <span className="text-[11px] text-slate-500 font-bold">চেকআউটে যুক্ত হবে</span>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between font-black text-slate-900 text-sm">
                      <span>সর্বমোট:</span>
                      <span className="text-blue-600 text-base">৳{subtotal}</span>
                    </div>

                    <Link href={`/checkout/${params.slug}`}>
                      <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black h-12 shadow-lg shadow-blue-600/30 rounded-xl text-xs sm:text-sm">
                        ক্যাশ অন ডেলিভারি চেকআউট <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 space-y-1">
                  <div className="font-bold flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" /> ১০০% নিরাপদ কেনাকাটা
                  </div>
                  <p className="text-slate-600">পণ্য হাতে পেয়ে টাকা শোধ করার নিশ্চিন্ত সুযোগ।</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
