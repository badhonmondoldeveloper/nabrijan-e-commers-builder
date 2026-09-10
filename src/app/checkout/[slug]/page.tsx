'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, ShieldCheck, Truck, CheckCircle2, Phone, MapPin, User } from 'lucide-react';

const DIVISIONS = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'];

export default function StoreCODCheckoutPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    division: 'Dhaka',
    district: 'Dhaka',
    area: 'Mirpur',
    address: '',
    notes: '',
    paymentMethod: 'COD',
  });

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem(`cart_${params.slug}`) || '[]');
    setCartItems(items);
  }, [params.slug]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = form.district.toLowerCase().includes('dhaka') ? 60 : 120;
  const grandTotal = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeSlug: params.slug,
          items: cartItems,
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Order placement failed');
      }

      // Clear local cart
      localStorage.removeItem(`cart_${params.slug}`);

      router.push(`/checkout/${params.slug}/success?orderNumber=${data.order.orderNumber}&total=${data.order.totalAmount}`);
    } catch (err: any) {
      setError(err.message || 'Checkout failed. Please check your delivery information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/store/${params.slug}/cart`}
            className="inline-flex items-center text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Cart
          </Link>
          <span className="font-bold text-slate-900 text-sm">Cash on Delivery Checkout</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Delivery Information Card */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="e.g. Rahat Chowdhury"
                      value={form.customerName}
                      onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))}
                      required
                      className="pl-9 bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Phone Number (11 Digits) *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="tel"
                      placeholder="01700000000"
                      value={form.customerPhone}
                      onChange={(e) => setForm((p) => ({ ...p, customerPhone: e.target.value }))}
                      required
                      className="pl-9 bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Division *</label>
                  <select
                    value={form.division}
                    onChange={(e) => setForm((p) => ({ ...p, division: e.target.value }))}
                    className="w-full h-9 bg-slate-50 border border-slate-200 rounded-md text-xs px-3 text-slate-900 font-medium"
                  >
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">District *</label>
                  <Input
                    type="text"
                    placeholder="e.g. Dhaka"
                    value={form.district}
                    onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
                    required
                    className="bg-slate-50 border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Area / Thana *</label>
                  <Input
                    type="text"
                    placeholder="e.g. Dhanmondi"
                    value={form.area}
                    onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
                    required
                    className="bg-slate-50 border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Full Street Address *</label>
                <Input
                  type="text"
                  placeholder="House #, Road #, Flat details..."
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  required
                  className="bg-slate-50 border-slate-200 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-emerald-600" /> Payment Option
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Cash on Delivery (COD)</span>
                    <span className="text-xs text-slate-600">Pay cash upon parcel delivery at your doorstep</span>
                  </div>
                </div>
                <Badge className="bg-emerald-600 text-white text-xs">V1 Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Final Order Review & Submit */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Items Subtotal:</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Shipping Charge:</span>
                <span>৳{shippingFee}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-extrabold text-base text-slate-900">
                <span>Total Amount to Pay on Delivery:</span>
                <span className="text-blue-600 text-lg">৳{grandTotal}</span>
              </div>

              <Button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold h-12 text-base shadow-lg shadow-emerald-600/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Confirm Order (Cash on Delivery)'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
