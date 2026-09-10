'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Truck, Loader2, Send, CheckCircle } from 'lucide-react';

interface CourierDispatchModalProps {
  storeId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
}

export default function CourierDispatchModal({
  storeId,
  orderId,
  orderNumber,
  customerName,
  totalAmount,
}: CourierDispatchModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const handleDispatch = async (provider: 'STEADFAST' | 'PATHAO') => {
    try {
      setLoading(true);
      setResultMessage(null);
      const res = await fetch(`/api/stores/${storeId}/courier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, provider }),
      });
      const data = await res.json();
      if (res.ok) {
        setResultMessage(data.message);
        setTimeout(() => {
          setOpen(false);
          setResultMessage(null);
          window.location.reload();
        }, 2000);
      } else {
        alert(data.message || 'Courier dispatch failed');
      }
    } catch (err) {
      alert('Network error dispatching courier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs"
      >
        <Truck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Send to Courier
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold flex items-center text-white">
                <Truck className="w-5 h-5 text-emerald-400 mr-2" /> Book BD Courier Consignment
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1">
              <p className="text-slate-300">Order #: <strong className="text-white font-mono">#{orderNumber}</strong></p>
              <p className="text-slate-300">Recipient: <strong className="text-white">{customerName}</strong></p>
              <p className="text-slate-300">COD Collection: <strong className="text-emerald-400">৳{totalAmount}</strong></p>
            </div>

            {resultMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>{resultMessage}</span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <p className="text-xs text-slate-400 font-semibold">Select Courier Provider:</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleDispatch('STEADFAST')}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Send className="w-3.5 h-3.5 mr-1" />}
                  Steadfast Courier
                </Button>

                <Button
                  onClick={() => handleDispatch('PATHAO')}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-11"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Send className="w-3.5 h-3.5 mr-1" />}
                  Pathao Courier
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
