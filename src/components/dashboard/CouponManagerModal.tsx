'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';

export default function CouponManagerModal({ storeId }: { storeId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING'>('PERCENTAGE');
  const [amount, setAmount] = useState(10);
  const [minPurchase, setMinPurchase] = useState(500);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/stores/${storeId}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          discountType,
          amount,
          minPurchase,
          isActive: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Coupon creation failed');
      }

      setOpen(false);
      setCode('');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error creating coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-medium">
        <Plus className="w-4 h-4 mr-1.5" /> Create Coupon Code
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 text-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-white">Create Discount Coupon</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Coupon Code *</label>
                <Input
                  type="text"
                  placeholder="e.g. EID2026 or SAVE10"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  className="bg-slate-950 border-slate-800 text-white font-mono uppercase text-sm font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Discount Type *</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full h-9 bg-slate-950 border border-slate-800 rounded-md text-xs text-white px-3"
                >
                  <option value="PERCENTAGE">PERCENTAGE (% Off)</option>
                  <option value="FIXED_AMOUNT">FIXED AMOUNT (৳ Off)</option>
                  <option value="FREE_SHIPPING">FREE SHIPPING</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">
                  {discountType === 'PERCENTAGE' ? 'Percentage Discount (%)' : 'Amount (৳)'}
                </label>
                <Input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  required
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Minimum Order Amount (৳)</label>
                <Input
                  type="number"
                  min="0"
                  value={minPurchase}
                  onChange={(e) => setMinPurchase(parseFloat(e.target.value) || 0)}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 border-t border-slate-800 pt-4">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-slate-400">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : 'Save Coupon'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
