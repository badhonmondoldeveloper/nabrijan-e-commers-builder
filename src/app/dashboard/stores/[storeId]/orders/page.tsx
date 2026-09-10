import { notFound } from 'next/navigation';
import { db } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Phone, MapPin, Calendar, Clock } from 'lucide-react';
import OrderStatusUpdater from '@/components/dashboard/OrderStatusUpdater';
import OrderInvoiceDrawer from '@/components/dashboard/OrderInvoiceDrawer';
import CourierDispatchModal from '@/components/dashboard/CourierDispatchModal';

export default async function StoreOrdersPage({
  params,
}: {
  params: { storeId: string };
}) {
  const store = await db.store.findUnique({
    where: { id: params.storeId },
  });

  if (!store) notFound();

  const orders = await db.order.findMany({
    where: { storeId: store.id },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: 'desc' } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Orders Management</h1>
        <p className="text-sm text-slate-400">
          Track customer Cash on Delivery (COD) orders, status history, and Bangladesh shipping details.
        </p>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-16 px-4">
              <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">Customer order করলে এখানে দেখতে পাবেন</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
                You haven't received any customer orders for this store yet. When customers place COD orders on your storefront, they will be listed here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {orders.map((ord) => (
                <div key={ord.id} className="p-6 space-y-4 hover:bg-slate-950/40 transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-sm font-bold text-blue-400">#{ord.orderNumber}</span>
                        <Badge
                          variant="outline"
                          className={
                            ord.orderStatus === 'DELIVERED'
                              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                              : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                          }
                        >
                          {ord.orderStatus}
                        </Badge>
                        <Badge variant="outline" className="border-slate-700 text-slate-300">
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center">
                        <Calendar className="w-3 h-3 mr-1 inline" />
                        {new Date(ord.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Order Status Update, Printable Invoice & Courier Dispatch */}
                    <div className="flex items-center space-x-2">
                      <CourierDispatchModal
                        storeId={store.id}
                        orderId={ord.id}
                        orderNumber={ord.orderNumber}
                        customerName={ord.customerName}
                        totalAmount={ord.totalAmount}
                      />
                      <OrderInvoiceDrawer storeName={store.name} order={ord} />
                      <OrderStatusUpdater storeId={store.id} orderId={ord.id} currentStatus={ord.orderStatus} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400 block font-semibold mb-1">Customer Delivery Details</span>
                      <p className="text-white font-medium">{ord.customerName}</p>
                      <p className="text-slate-300 font-mono flex items-center mt-0.5">
                        <Phone className="w-3 h-3 mr-1 text-slate-500" /> {ord.customerPhone}
                      </p>
                      <p className="text-slate-400 mt-1 flex items-start">
                        <MapPin className="w-3 h-3 mr-1 text-slate-500 shrink-0 mt-0.5" />
                        {ord.shippingAddress}, {ord.shippingArea}, {ord.shippingDistrict}, {ord.shippingDivision}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold mb-1">Order Financial Breakdown</span>
                      <div className="flex justify-between text-slate-300 py-0.5">
                        <span>Subtotal:</span>
                        <span>৳{ord.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-300 py-0.5">
                        <span>Shipping Fee:</span>
                        <span>৳{ord.shippingFee}</span>
                      </div>
                      {ord.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-400 py-0.5">
                          <span>Discount:</span>
                          <span>-৳{ord.discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-white font-bold text-sm border-t border-slate-800 pt-1 mt-1">
                        <span>Total COD Collection:</span>
                        <span className="text-emerald-400">৳{ord.totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-blue-400 font-semibold text-xs mt-0.5">
                        <span>Estimated Profit:</span>
                        <span>৳{ord.estimatedProfit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Ordered Items</span>
                    <div className="space-y-1">
                      {ord.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-xs text-slate-300 bg-slate-900/60 p-2 rounded">
                          <span>
                            {item.productTitle} {item.variantTitle ? `(${item.variantTitle})` : ''} x {item.quantity}
                          </span>
                          <span className="font-semibold text-white">৳{item.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
