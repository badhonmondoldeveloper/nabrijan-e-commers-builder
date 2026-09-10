import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { orderNumber?: string; total?: string };
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white border-slate-200 shadow-xl text-center">
        <CardContent className="p-8 space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Order Placed Successfully!</h1>
            <p className="text-xs text-slate-500">
              Thank you for your order. Our store team will call you to confirm delivery details.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Order Number:</span>
              <span className="font-mono font-bold text-blue-600">#{searchParams.orderNumber || 'ORD-SUCCESS'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payment Mode:</span>
              <span className="font-semibold text-emerald-600">Cash on Delivery (COD)</span>
            </div>
            {searchParams.total && (
              <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-2">
                <span>Total Payable Amount:</span>
                <span className="text-base text-blue-600">৳{searchParams.total}</span>
              </div>
            )}
          </div>

          <Link href={`/store/${params.slug}`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold">
              Return to Storefront <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
