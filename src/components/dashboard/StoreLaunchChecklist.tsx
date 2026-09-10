'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Circle, 
  PackagePlus, 
  Palette, 
  Truck, 
  Share2, 
  ShoppingBag, 
  ArrowRight,
  Rocket
} from 'lucide-react';

export function StoreLaunchChecklist({ 
  storeId, 
  progress 
}: { 
  storeId: string; 
  progress: number;
}) {
  const checklistItems = [
    { title: 'Create Merchant Store', desc: 'Store tenant created', completed: true, link: `/dashboard/stores/${storeId}` },
    { title: 'Add First Product', desc: 'Create product catalog', completed: progress >= 28, link: `/dashboard/stores/${storeId}/products/new` },
    { title: 'Customize Visual Theme', desc: 'Choose theme preset or builder', completed: progress >= 42, link: `/dashboard/stores/${storeId}/builder` },
    { title: 'Configure Bangladesh Courier', desc: 'Connect Steadfast or Pathao', completed: progress >= 57, link: `/dashboard/stores/${storeId}/integrations` },
    { title: 'Publish Store', desc: 'Make storefront active for visitors', completed: progress >= 85, link: `/dashboard/stores/${storeId}` },
    { title: 'Get Your First Order', desc: 'Receive COD order from customer', completed: progress >= 100, link: `/dashboard/stores/${storeId}/orders` }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-600" /> Store Launch Checklist
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Follow these actionable steps to publish your store and start receiving orders.
          </p>
        </div>
        <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {progress}% Complete
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {checklistItems.map((item, idx) => (
          <Link key={idx} href={item.link}>
            <div className={`p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer flex items-start gap-3 ${
              item.completed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
            }`}>
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className={`text-xs font-bold ${item.completed ? 'text-emerald-900 line-through' : 'text-slate-900'}`}>
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
