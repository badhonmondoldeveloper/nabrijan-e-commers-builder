'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, FileText, X } from 'lucide-react';

interface OrderInvoiceDrawerProps {
  storeName: string;
  order: {
    orderNumber: string;
    createdAt: Date | string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string | null;
    shippingAddress: string;
    shippingArea: string;
    shippingDistrict: string;
    shippingDivision: string;
    paymentMethod: string;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    totalAmount: number;
    items: {
      id: string;
      productTitle: string;
      variantTitle?: string | null;
      quantity: number;
      price: number;
      total: number;
    }[];
  };
}

export default function OrderInvoiceDrawer({ storeName, order }: OrderInvoiceDrawerProps) {
  const [open, setOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
      >
        <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
        Print Invoice
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 border-slate-200 rounded-2xl max-w-3xl w-full p-0 overflow-hidden max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Official Printable Invoice - #{order.orderNumber}
              </h3>
              <div className="flex items-center space-x-2">
                <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-9">
                  <Printer className="w-4 h-4 mr-1.5" /> Print / Save PDF
                </Button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div className="p-8 space-y-6 font-sans overflow-y-auto" id="printable-invoice">
              <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div>
                  <h1 className="text-2xl font-black text-blue-600 tracking-wide uppercase">{storeName}</h1>
                  <p className="text-xs text-slate-500 mt-1">Nabrijan Multi-Tenant E-Commerce SaaS Platform</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider mb-1">
                    Official Invoice
                  </span>
                  <p className="text-sm font-bold text-slate-800">Invoice #: {order.orderNumber}</p>
                  <p className="text-xs text-slate-500">Date: {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 text-sm">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-2">Billed To (Customer):</h4>
                  <p className="font-semibold text-slate-900">{order.customerName}</p>
                  <p className="text-slate-600 mt-0.5">Phone: {order.customerPhone}</p>
                  {order.customerEmail && <p className="text-slate-600">Email: {order.customerEmail}</p>}
                  <p className="text-slate-600 mt-2 text-xs leading-relaxed">
                    {order.shippingAddress}, {order.shippingArea}, {order.shippingDistrict}, {order.shippingDivision}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-2">Payment Details:</h4>
                  <p className="text-slate-700">Payment Method: <span className="font-bold text-slate-900">{order.paymentMethod}</span></p>
                  <p className="text-slate-700 mt-1">Collection Status: <span className="font-bold text-amber-600">Cash on Delivery</span></p>
                  <p className="text-xs text-slate-500 mt-3 italic">
                    * Please collect full total amount from customer upon courier delivery.
                  </p>
                </div>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Item Description</th>
                    <th className="py-3 px-4 text-center">Unit Price</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm text-slate-800">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-medium">
                        {item.productTitle}
                        {item.variantTitle && <span className="text-xs text-slate-500 block font-normal">{item.variantTitle}</span>}
                      </td>
                      <td className="py-3.5 px-4 text-center">৳{item.price}</td>
                      <td className="py-3.5 px-4 text-center font-bold">{item.quantity}</td>
                      <td className="py-3.5 px-4 text-right font-semibold">৳{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-start border-t border-slate-200 pt-6">
                <div className="text-xs text-slate-500 max-w-md">
                  <p className="font-semibold text-slate-700 mb-1">Terms & Instructions:</p>
                  <p>1. Check items carefully upon receipt.</p>
                  <p>2. Keep invoice copy for returns or support requests.</p>
                </div>
                <div className="w-64 space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Subtotal:</span>
                    <span className="font-semibold">৳{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Shipping Fee:</span>
                    <span className="font-semibold">৳{order.shippingFee}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between py-1 text-emerald-600 border-b border-slate-100">
                      <span>Discount:</span>
                      <span>-৳{order.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 text-slate-900 font-bold text-base border-t border-slate-300">
                    <span>Total COD Payable:</span>
                    <span className="text-blue-600 font-black">৳{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="pt-12 flex justify-between items-end text-xs text-slate-400">
                <div className="text-center border-t border-slate-300 pt-2 w-40">
                  <p className="font-semibold text-slate-600">Authorized Signature</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-500">{storeName} Store Admin</p>
                  <p className="text-[10px]">Generated via Nabrijan E-Commerce Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
