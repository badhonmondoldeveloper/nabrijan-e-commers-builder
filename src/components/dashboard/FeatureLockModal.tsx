'use client';

import Link from 'next/link';
import { Lock, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function FeatureLockModal({
  isOpen,
  onClose,
  featureName,
  requiredPlan
}: {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  requiredPlan?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 text-center space-y-6 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-50 text-amber-700">
            <Sparkles className="w-3.5 h-3.5" /> Premium Feature Locked
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            {featureName} Requires {requiredPlan || 'Growth'} Plan
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Upgrade your NABRIJAN subscription plan today to unlock {featureName}, custom domain support, advanced analytics, and automated SMS marketing.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> What's Included in {requiredPlan || 'Growth'} Plan:
          </div>
          <ul className="space-y-1.5 text-slate-600 pl-6 list-disc">
            <li>Unlimited products and storage</li>
            <li>Custom Domain connection</li>
            <li>Pathao & Steadfast automated COD courier booking</li>
            <li>Automated SMS & WhatsApp order tracking alerts</li>
            <li>AI Product Copywriter assistant</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Link href="/dashboard/billing">
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-4 h-4" /> Upgrade to {requiredPlan || 'Growth'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-slate-500 hover:text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            Cancel & Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
