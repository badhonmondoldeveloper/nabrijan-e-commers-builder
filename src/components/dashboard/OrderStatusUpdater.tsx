'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
];

export default function OrderStatusUpdater({
  storeId,
  orderId,
  currentStatus,
}: {
  storeId: string;
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setLoading(true);

    try {
      const res = await fetch(`/api/stores/${storeId}/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          newStatus,
          comment: `Order status manually updated to ${newStatus}`,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      router.refresh();
    } catch (err) {
      alert('Error updating order status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs text-slate-400 font-medium">Update Status:</span>
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={loading}
        className="bg-slate-950 border border-slate-800 text-white text-xs rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />}
    </div>
  );
}
