'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, 
  Truck, 
  MessageSquare, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Server
} from 'lucide-react';

export default function AdminIntegrationsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/integrations');
      const json = await res.json();
      if (res.ok) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load admin integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
        Loading platform-wide integration health metrics...
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-md">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-7 h-7 text-indigo-400" /> Super Admin V3 Integration Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time monitoring of Pathao & Steadfast Couriers, SMS Gateways, AI Credits, and Retry Analytics.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 self-start md:self-auto shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Health
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Total Shipments</div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalShipments || 0}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Successful API Calls</div>
            <div className="text-2xl font-bold text-slate-900">{stats.successfulAttempts || 0}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Failed / Retried</div>
            <div className="text-2xl font-bold text-slate-900">{stats.failedAttempts || 0}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">AI Copy Generations</div>
            <div className="text-2xl font-bold text-slate-900">{stats.aiUsagesCount || 0}</div>
          </div>
        </div>
      </div>

      {/* Grid Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Platform Shipments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" /> Live Platform Consignments
          </h2>
          {(!data?.shipments || data.shipments.length === 0) ? (
            <div className="p-6 text-center text-slate-400 text-sm">No consignment shipments recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-2.5">Store</th>
                    <th className="p-2.5">Order</th>
                    <th className="p-2.5">Provider</th>
                    <th className="p-2.5">Tracking</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {data.shipments.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-semibold text-slate-900">{s.store?.name || s.storeId}</td>
                      <td className="p-2.5">#{s.order?.orderNumber}</td>
                      <td className="p-2.5 font-semibold">{s.provider}</td>
                      <td className="p-2.5 font-mono text-indigo-600">{s.trackingCode}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-indigo-50 text-indigo-700">
                          {s.deliveryStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Global API Attempts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600" /> Platform Integration Attempts
          </h2>
          {(!data?.attempts || data.attempts.length === 0) ? (
            <div className="p-6 text-center text-slate-400 text-sm">No integration attempt logs available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-2.5">Time</th>
                    <th className="p-2.5">Provider</th>
                    <th className="p-2.5">Action</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {data.attempts.map((att: any) => (
                    <tr key={att.id} className="hover:bg-slate-50/50">
                      <td className="p-2.5 text-slate-500">{new Date(att.createdAt).toLocaleTimeString()}</td>
                      <td className="p-2.5 font-semibold text-slate-900">{att.provider}</td>
                      <td className="p-2.5 font-mono">{att.action}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                          att.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
