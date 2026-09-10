'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';

export default function InventoryAdjusterModal({
  storeId,
  products,
}: {
  storeId: string;
  products: any[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [type, setType] = useState('PURCHASE');
  const [quantity, setQuantity] = useState(10);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/stores/${storeId}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, type, quantity, notes }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Inventory adjustment failed');
      }

      setOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error updating stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-medium">
        <Plus className="w-4 h-4 mr-1.5" /> Adjust Stock Quantity
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 text-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-white">Manual Stock Adjustment</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Select Product *</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full h-9 bg-slate-950 border border-slate-800 rounded-md text-xs text-white px-3"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Adjustment Type *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-9 bg-slate-950 border border-slate-800 rounded-md text-xs text-white px-3 font-mono"
                >
                  <option value="PURCHASE">PURCHASE (+ Add Stock)</option>
                  <option value="SALE">SALE (- Reduce Stock)</option>
                  <option value="ADJUSTMENT">ADJUSTMENT (+ Audit Correction)</option>
                  <option value="DAMAGE">DAMAGE (- Damaged/Lost Stock)</option>
                  <option value="RETURN">RETURN (+ Returned Stock)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Quantity *</label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  required
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Adjustment Notes</label>
                <Input
                  type="text"
                  placeholder="e.g. Received new shipment from supplier"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 border-t border-slate-800 pt-4">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-slate-400">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : 'Log & Update Stock'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
