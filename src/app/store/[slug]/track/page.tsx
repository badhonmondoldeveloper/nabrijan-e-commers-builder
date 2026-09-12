'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle, ShoppingBag, ArrowLeft, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productTitle?: string;
  product?: { title: string; images?: Array<{ url: string }> };
}

interface Order {
  id: string;
  orderNumber?: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderTrackingPage({ params }: { params: { slug: string } }) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [guestOrders, setGuestOrders] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load local guest orders from localStorage
    try {
      const raw = localStorage.getItem(`guest_orders_${params.slug}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        setGuestOrders(parsed);
      }
    } catch (e) {}
  }, [params.slug]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setError('');
    setOrders([]);

    try {
      const res = await fetch(`/api/store/${params.slug}/track?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'অর্ডার সার্চ করতে ব্যর্থ হয়েছে');

      if (data.orders && data.orders.length > 0) {
        setOrders(data.orders);
      } else {
        setError('আপনার প্রদত্ত মোবাইল নম্বর বা অর্ডার আইডি দিয়ে কোনো অর্ডার পাওয়া যায়নি।');
      }
    } catch (err: any) {
      setError(err.message || 'নেটওয়ার্ক এরর');
    } finally {
      setSearching(false);
    }
  };

  const getStepStatus = (orderStatus: string) => {
    const s = orderStatus.toUpperCase();
    if (s === 'DELIVERED') return 5;
    if (s === 'OUT_FOR_DELIVERY' || s === 'SHIPPED') return 4;
    if (s === 'PROCESSING' || s === 'CONFIRMED') return 2;
    if (s === 'CANCELLED') return -1;
    return 1; // PENDING
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/store/${params.slug}`} className="flex items-center text-xs font-bold text-slate-600 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4 mr-1" /> দোকানে ফিরে যান
          </Link>
          <div className="font-extrabold text-slate-900 text-sm flex items-center">
            <Truck className="w-4 h-4 text-blue-600 mr-1.5" /> লাইভ অর্ডার ট্র্যাকিং
          </div>
          <div />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-3xl flex-1 space-y-8">
        {/* Search Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">আপনার অর্ডারের বর্তমান অবস্থা জানুন</h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            মোবাইল নম্বর বা অর্ডার আইডি দিয়ে সরাসরি আপনার অর্ডারের ডেলিভারি স্ট্যাটাস ও ট্র্যাকিং অবস্থান দেখুন।
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="মোবাইল নম্বর বা অর্ডার আইডি লিখুন..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={searching}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
            >
              {searching ? 'খোঁজা হচ্ছে...' : 'ট্র্যাক করুন'} <Search className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
        </div>

        {/* Found Orders */}
        {orders.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-extrabold text-slate-900 text-lg">খুঁজে পাওয়া অর্ডার ({orders.length})</h2>
            {orders.map((order) => {
              const currentStep = getStepStatus(order.status);

              return (
                <div key={order.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order ID</span>
                      <span className="font-mono font-black text-sm text-slate-900">#{order.orderNumber || order.id.slice(-6)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">তারিখ</span>
                      <span className="text-xs font-semibold text-slate-700">{new Date(order.createdAt).toLocaleDateString('bn-BD')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">মোট মূল্য</span>
                      <span className="text-sm font-black text-emerald-600">৳{order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Stepper UI */}
                  {currentStep === -1 ? (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center text-xs font-bold text-rose-600">
                      ❌ এই অর্ডারটি বাতিল (CANCELLED) করা হয়েছে।
                    </div>
                  ) : (
                    <div className="py-2">
                      <div className="text-xs font-bold text-slate-800 mb-4">অর্ডার ট্র্যাকিং স্টেজ:</div>
                      <div className="grid grid-cols-4 gap-2 relative">
                        <div className="text-center space-y-1 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-black ${currentStep >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            ✓
                          </div>
                          <span className="text-[10px] font-bold text-slate-800 block">Order Placed</span>
                        </div>

                        <div className="text-center space-y-1 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-black ${currentStep >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {currentStep >= 2 ? '✓' : '২'}
                          </div>
                          <span className="text-[10px] font-bold text-slate-800 block">Processing</span>
                        </div>

                        <div className="text-center space-y-1 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-black ${currentStep >= 4 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {currentStep >= 4 ? '✓' : '৩'}
                          </div>
                          <span className="text-[10px] font-bold text-slate-800 block">Shipped</span>
                        </div>

                        <div className="text-center space-y-1 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-black ${currentStep >= 5 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {currentStep >= 5 ? '✓' : '৪'}
                          </div>
                          <span className="text-[10px] font-bold text-slate-800 block">Delivered</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase">অর্ডারের পণ্যসমূহ:</div>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl text-xs">
                          <span className="font-semibold text-slate-900">{item.productTitle || item.product?.title || 'Product'} (x{item.quantity})</span>
                          <span className="font-bold text-slate-800">৳{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Guest Session Dashboard */}
        {guestOrders.length > 0 && orders.length === 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center">
              <ShoppingBag className="w-4 h-4 text-blue-600 mr-2" /> আপনার সাম্প্রতিক গেস্ট অর্ডারসমূহ (Guest Session)
            </h3>
            <div className="space-y-3">
              {guestOrders.map((go: any, idx: number) => (
                <div key={idx} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">Order #{go.orderNumber || go.id?.slice(-6) || idx + 1}</div>
                    <div className="text-slate-500">{new Date(go.date || Date.now()).toLocaleDateString('bn-BD')}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-600">৳{go.totalAmount || go.total}</div>
                    <button
                      onClick={() => {
                        setQuery(go.orderNumber || go.id || go.phone || '');
                      }}
                      className="text-blue-600 underline font-bold mt-1 inline-block"
                    >
                      ট্র্যাক করুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
