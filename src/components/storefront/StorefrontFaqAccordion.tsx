'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Truck } from 'lucide-react';

export default function StorefrontFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'ডেলিভারি পেতে কতদিন সময় লাগবে?',
      a: 'ঢাকা সিটির ভেতরে ২৪-৪৮ ঘণ্টা এবং ঢাকা সিটির বাইরে ২-৩ দিনের মধ্যে হোম ডেলিভারি পেয়ে যাবেন।',
    },
    {
      q: 'পণ্য পছন্দ না হলে বা সমস্যা থাকলে কি করবো?',
      a: 'ক্যাশ অন ডেলিভারি সুবিধায় ডেলিভারিম্যানের সামনে পণ্য চেক করতে পারবেন। কোনো ত্রুটি বা সাইজ সমস্যা থাকলে সাথে সাথে রিটার্ন করতে পারবেন।',
    },
    {
      q: 'ক্যাশ অন ডেলিভারিতে অর্ডার দেওয়া যাবে কি?',
      a: 'হ্যাঁ! কোনো অগ্রিম পেমেন্ট ছাড়াই সারা বাংলাদেশে ক্যাশ অন ডেলিভারিতে অর্ডার দিতে পারবেন। পণ্য হাতে পেয়ে টাকা শোধ করবেন।',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center">
        <HelpCircle className="w-5 h-5 text-blue-600 mr-2" /> সাধারণ প্রশ্ন ও উত্তর (FAQ)
      </h3>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 text-left font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-100 transition"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {isOpen && (
                <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
