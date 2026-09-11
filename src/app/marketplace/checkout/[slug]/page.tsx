'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { ShieldCheck, Truck, CheckCircle2, Lock, ArrowLeft, Loader2 } from 'lucide-react';

export default function MarketplaceCheckoutPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [orderComplete, setOrderComplete] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingDivision, setShippingDivision] = useState('Dhaka');
  const [shippingDistrict, setShippingDistrict] = useState('Dhaka');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');

  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/marketplace/products?q=${params.slug}&limit=1`);
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProduct(data.products[0]);
        } else {
          setErrorMessage('Product not found or unavailable on marketplace');
        }
      } catch (err) {
        setErrorMessage('Failed to load product details');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress) {
      alert('Please fill out all required fields (Name, Phone, Address)');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/marketplace/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          customerName,
          customerPhone,
          shippingDivision,
          shippingDistrict,
          shippingAddress,
          paymentMethod: 'COD',
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Checkout failed');
      }

      setOrderComplete(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during checkout');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <MarketplaceHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
        <MarketplaceFooter />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <MarketplaceHeader />
        <main className="flex-1 py-16 max-w-xl mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-4xl shadow-xl shadow-emerald-500/20">
            ✓
          </div>
          <h1 className="text-3xl font-black text-white">Order Confirmed!</h1>
          <p className="text-sm text-slate-300">
            Thank you for shopping on Nabrijan Marketplace. Your Cash on Delivery order has been successfully sent to <span className="font-bold text-emerald-400">{product.store.name}</span>.
          </p>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Order Reference:</span>
              <span className="font-mono font-bold text-emerald-400">{orderComplete.orderNumber}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Payment Method:</span>
              <span className="font-bold text-white">Cash on Delivery (COD)</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Customer Phone:</span>
              <span className="font-bold text-white">{customerPhone}</span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/marketplace"
              className="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3 rounded-xl transition-all shadow-lg"
            >
              Continue Shopping →
            </Link>
          </div>
        </main>
        <MarketplaceFooter />
      </div>
    );
  }

  const unitPrice = product ? (product.salePrice ?? product.regularPrice) : 0;
  const shippingFee = 60;
  const subtotal = unitPrice * quantity;
  const totalAmount = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <MarketplaceHeader />

      <main className="flex-1 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link href={`/marketplace/product/${params.slug}`} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Product
          </Link>

          <h1 className="text-3xl font-black text-white mb-8">Checkout & Order Confirmation</h1>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Form */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
                <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-400" /> Shipping & Customer Details
                </h3>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Phone Number (COD Verification) *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Division</label>
                    <select
                      value={shippingDivision}
                      onChange={(e) => setShippingDivision(e.target.value)}
                      className="w-full bg-slate-800 text-sm text-white rounded-xl px-3 py-2.5 border border-slate-700"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Barisal">Barisal</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">District</label>
                    <input
                      type="text"
                      value={shippingDistrict}
                      onChange={(e) => setShippingDistrict(e.target.value)}
                      placeholder="e.g. Dhaka"
                      className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Delivery Address *</label>
                  <textarea
                    required
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="House number, road number, area..."
                    className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Order Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special instructions for delivery rider..."
                    className="w-full bg-slate-800 text-sm text-white rounded-xl px-4 py-2.5 border border-slate-700"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-white block">Cash on Delivery (COD) Selected</span>
                      <span className="text-slate-400">Pay cash directly to delivery rider upon inspecting package.</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl text-base shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing Order...
                    </>
                  ) : (
                    `Place Order (৳${totalAmount}) →`
                  )}
                </button>
              </form>
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-5 space-y-6">
              {product && (
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
                  <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3">
                    Order Summary
                  </h3>

                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.images[0]?.url} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-[11px] text-emerald-400 font-semibold">{product.store.name}</div>
                      <h4 className="font-bold text-sm text-white line-clamp-2">{product.title}</h4>
                      <div className="text-sm font-black text-emerald-400 mt-1">৳{unitPrice}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-300">
                    <span>Quantity:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-7 h-7 bg-slate-800 rounded-lg text-white font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-7 h-7 bg-slate-800 rounded-lg text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal:</span>
                      <span className="font-bold text-white">৳{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Shipping Fee:</span>
                      <span className="font-bold text-white">৳{shippingFee}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                      <span>Total Amount:</span>
                      <span className="text-emerald-400">৳{totalAmount}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
