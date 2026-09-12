'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

interface ProductStatusToggleProps {
  storeId: string;
  productId: string;
  initialStatus: string;
}

export function ProductStatusToggle({ storeId, productId, initialStatus }: ProductStatusToggleProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isChecked = status === 'ACTIVE';

  const handleToggle = async (checked: boolean) => {
    const newStatus = checked ? 'ACTIVE' : 'INACTIVE';
    setLoading(true);

    try {
      const res = await fetch(`/api/stores/${storeId}/products/${productId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus(newStatus);
        toast({
          title: 'Product Status Updated',
          description: `Product is now ${newStatus}`,
        });
      } else {
        toast({
          title: 'Update Failed',
          description: data.message || 'Could not update product status',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Network error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isChecked}
        disabled={loading}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-emerald-600"
      />
      <Badge
        variant="outline"
        className={
          status === 'ACTIVE'
            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]'
            : 'border-slate-500/30 text-slate-400 bg-slate-500/10 text-[10px]'
        }
      >
        {status}
      </Badge>
    </div>
  );
}
