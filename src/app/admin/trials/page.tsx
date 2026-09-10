'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  RefreshCw, 
  Sparkles,
  Calendar
} from 'lucide-react';

export default function AdminTrialsPage() {
  const [loading, setLoading] = useState(true);
  const [trials, setTrials] = useState<any[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'WARNING' | 'EXPIRED'>('ALL');

  useEffect(() => {
    fetchTrials();
  }, []);

  const fetchTrials = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/trials');
      const data = await res.json();
      if (res.ok && data.trials) {
        setTrials(data.trials);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExtend = async (trialId: string) => {
    const reason = prompt('Enter reason for trial extension (e.g. Granted by Support):');
    if (!reason) return;

    try {
      const res = await fetch('/api/admin/trials/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trialId, days: 7, reason })
      });
      if (res.ok) {
        alert('Trial extended by 7 days successfully');
        fetchTrials();
      }
    } catch (e) {
      alert('Failed to extend trial');
    }
  };

  const filteredTrials = trials.filter(t => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-md">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-7 h-7 text-indigo-400" /> Super Admin 7-Day Trial 360 Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor merchant onboarding progress, active trials, conversion funnels, and grant trial extensions.
          </p>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${filter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            All Trials
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${filter === 'ACTIVE' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('EXPIRED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${filter === 'EXPIRED' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Expired
          </button>
        </div>
      </div>

      {/* Trial Table */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-400" />
            Loading trial store records...
          </div>
        ) : filteredTrials.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No trial records found matching filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Store Name</th>
                  <th className="p-3">User Email</th>
                  <th className="p-3">Started</th>
                  <th className="p-3">Ends At</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredTrials.map((t: any) => (
                  <tr key={t.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-white">{t.store?.name || t.storeId}</td>
                    <td className="p-3">{t.user?.email || t.userId}</td>
                    <td className="p-3 text-slate-400">{new Date(t.startedAt).toLocaleDateString()}</td>
                    <td className="p-3 font-mono text-indigo-300">{new Date(t.endsAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                        t.status === 'TRIAL_ACTIVE' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleExtend(t.id)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-[11px] transition flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> +7 Days
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
