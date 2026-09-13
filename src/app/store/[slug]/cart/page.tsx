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
    <div className="min-h-screen bg-[#F6FAF4] text-[#17221D] font-sans pb-12">
      {/* Header (Matching Screen 3 Header UI) */}
      <header className="bg-white border-b border-[#DCE7DF] sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/store/${params.slug}`}
            className="w-9 h-9 rounded-full bg-[#F6FAF4] border border-[#DCE7DF] flex items-center justify-center text-[#063B2A] hover:bg-[#EAF7DF] transition"
          >
            <ArrowLeft className="w-4 h-4 text-[#063B2A]" />
          </Link>
          <span className="font-black text-[#063B2A] text-base">Cart</span>
          <button
            onClick={() => {
              localStorage.removeItem(`cart_${params.slug}`);
              setCartItems([]);
            }}
            className="w-9 h-9 rounded-full bg-[#F6FAF4] border border-[#DCE7DF] flex items-center justify-center text-[#66736C] hover:text-rose-600 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#DCE7DF] p-12 text-center space-y-4 shadow-xs">
            <ShoppingBag className="w-12 h-12 text-[#66736C] mx-auto" />
            <h2 className="text-xl font-black text-[#063B2A]">আপনার কার্ট খালি</h2>
            <p className="text-xs text-[#66736C] max-w-sm mx-auto">
              আপনার কার্টে এখনো কোনো পণ্য যুক্ত করা হয়নি।
            </p>
            <Link href={`/store/${params.slug}`}>
              <Button className="bg-[#55B510] hover:bg-[#063B2A] text-white font-bold rounded-full px-6 py-2.5 text-xs shadow-sm">
                কেনাকাটা করুন
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Cart Reservation Bar */}
            <div className="p-3.5 bg-[#063B2A] text-white rounded-2xl shadow-xs flex items-center justify-between gap-3 border border-[#55B510]/30">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#55B510] animate-pulse shrink-0" />
                <span className="text-xs font-bold">
                  কার্ট রিজার্ভেশন সময়: <span className="font-mono text-[#55B510]">{formatTime(timeLeft)}</span> মিনিট বাকি
                </span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider bg-[#55B510] px-2 py-0.5 rounded-full text-white">
                RESERVED
              </span>
            </div>

            {/* Cart Items List (Matching Screen 3 Cards) */}
            <div className="space-y-3">
              {cartItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-4 border border-[#DCE7DF] shadow-xs flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&q=80'}
                      alt={item.title}
                      className="w-16 h-16 rounded-2xl object-cover bg-[#F6FAF4] border border-[#DCE7DF] shrink-0"
                    />
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#063B2A] text-xs sm:text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-[#66736C] font-semibold">In Stock • Verified</p>
                      <p className="text-sm font-black text-[#063B2A]">৳{item.price}</p>
                    </div>
                  </div>

                  {/* Actions & Quantity Stepper */}
                  <div className="flex flex-col items-end space-y-2">
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-[#66736C] hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center border border-[#DCE7DF] rounded-full px-2.5 py-0.5 bg-[#F6FAF4] space-x-2.5">
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className="text-[#66736C] font-bold text-xs hover:text-[#063B2A]"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-[#17221D]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className="w-4 h-4 rounded-full bg-[#EAF7DF] border border-[#55B510] text-[#063B2A] flex items-center justify-center font-bold text-[10px]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Card (Matching Screen 3 Promo Field UI) */}
            <div className="bg-white rounded-2xl p-3 border border-[#DCE7DF] flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2.5 text-xs text-[#66736C] flex-1">
                <Tag className="w-4 h-4 text-[#55B510] shrink-0" />
                <input
                  type="text"
                  placeholder="Enter Promo Code"
                  className="w-full bg-transparent focus:outline-none text-xs text-[#17221D] placeholder-[#66736C]"
                />
              </div>
              <button className="w-8 h-8 rounded-xl bg-[#F6FAF4] hover:bg-[#EAF7DF] text-[#063B2A] flex items-center justify-center transition border border-[#DCE7DF]">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Order Summary & Checkout Breakdown (Matching Screen 3) */}
            <div className="bg-white rounded-3xl border border-[#DCE7DF] p-6 shadow-xs space-y-3 text-xs">
              <h3 className="font-extrabold text-[#063B2A] text-sm border-b border-[#DCE7DF] pb-3">Order Summary</h3>
              <div className="flex justify-between text-[#66736C]">
                <span>Sub Total</span>
                <span className="font-bold text-[#17221D]">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-[#66736C]">
                <span>Shipping & Delivery</span>
                <span className="font-bold text-[#55B510]">Free / COD</span>
              </div>
              <div className="border-t border-[#DCE7DF] pt-3 flex justify-between font-black text-[#063B2A] text-base">
                <span>Total</span>
                <span className="text-[#063B2A]">৳{subtotal}</span>
              </div>

              {/* Full Width Checkout Pill Button (Matching Screen 3 Checkout Button) */}
              <Link href={`/checkout/${params.slug}`} className="block pt-2">
                <Button className="w-full rounded-full bg-[#55B510] hover:bg-[#063B2A] text-white font-black h-12 text-sm shadow-md transition duration-300">
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
