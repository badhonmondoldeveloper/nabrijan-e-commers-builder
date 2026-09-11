'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, ShieldAlert, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TrialStatus } from '@/lib/tenancy/trial-service';

export function TrialDashboardCard({ storeId }: { storeId: string }) {
  const [trial, setTrial] = useState<TrialStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrialStatus();
  }, [storeId]);

  const fetchTrialStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stores/${storeId}/trial`);
      const data = await res.json();
      if (res.ok && data.trial) {
        setTrial(data.trial);
      }
    } catch (err) {
      console.error('Failed to load trial status:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !trial) return null;

  return (
    <div className={`p-6 rounded-2xl border shadow-sm transition-all ${
      trial.isExpired
        ? 'bg-rose-50 border-rose-200 text-rose-900'
        : trial.status === 'TRIAL_WARNING'
        ? 'bg-amber-50 border-amber-200 text-amber-900'
        : 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white border-indigo-900'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side Info */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              trial.isExpired
                ? 'bg-rose-200 text-rose-900'
                : trial.status === 'TRIAL_WARNING'
                ? 'bg-amber-200 text-amber-900'
                : 'bg-indigo-600 text-white'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              {trial.isExpired
                ? 'Trial Expired'
                : trial.daysLeft === 0
                ? `${trial.hoursLeft} Hours Left`
                : `${trial.daysLeft} Days Left`}
            </span>
            <span className="text-xs font-semibold opacity-75">
              3-Day Free Trial
            </span>
          </div>

          <h3 className="text-xl font-extrabold tracking-tight">
            {trial.isExpired
              ? 'Your 3-Day Free Trial has Expired'
              : trial.daysLeft <= 1
              ? 'Final Day of Your Free Trial!'
              : 'Launch & Grow Your E-Commerce Store'}
          </h3>

          <p className="text-xs opacity-80 leading-relaxed">
            {trial.isExpired
              ? 'Upgrade to a paid plan to keep your store active and unlock unlimited products, custom domains, and courier integrations.'
              : 'Complete your launch checklist and publish your store to receive your first order today.'}
          </p>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-bold">
              <span>Store Launch Progress</span>
              <span>{trial.checklistProgress}%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${trial.checklistProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Side Upgrade CTA */}
        <div className="flex flex-col gap-2 shrink-0">
          <Link href="/dashboard/billing">
            <button className="w-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-4 h-4" /> Upgrade Plan
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/dashboard/stores/${storeId}/builder`}>
            <button className="w-full px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition text-center">
              Continue Store Setup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
