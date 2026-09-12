'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

interface StoreStatusToggleProps {
  storeId: string;
  initialStatus: string;
}

export function StoreStatusToggle({ storeId, initialStatus }: StoreStatusToggleProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isChecked = status === 'ACTIVE';

  const handleToggle = async (checked: boolean) => {
    const newStatus = checked ? 'ACTIVE' : 'INACTIVE';
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/stores/${storeId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus(newStatus);
        toast({
          title: 'Store Status Updated',
          description: `Store status changed to ${newStatus}`,
        });
      } else {
        toast({
          title: 'Update Failed',
          description: data.message || 'Could not update store status',
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
    <div className="flex items-center space-x-3">
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
            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
            : 'border-red-500/30 text-red-400 bg-red-500/10'
        }
      >
        {status}
      </Badge>
    </div>
  );
}
