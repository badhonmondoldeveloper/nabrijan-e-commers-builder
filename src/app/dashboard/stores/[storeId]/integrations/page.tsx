'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Truck, 
  MessageSquare, 
  Key, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Save, 
  Send,
  Sliders,
  History
} from 'lucide-react';

export default function MerchantIntegrationsPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Integration states
  const [provider, setProvider] = useState<'STEADFAST' | 'PATHAO'>('STEADFAST');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [storeIdRef, setStoreIdRef] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupPhone, setPickupPhone] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED');
  const [attempts, setAttempts] = useState<any[]>([]);

  // Notification Template states
  const [smsTemplate, setSmsTemplate] = useState('Dear {{customerName}}, your order #{{orderNumber}} has been confirmed! Tracking: {{trackingCode}}');

  useEffect(() => {
    fetchIntegrations();
  }, [storeId]);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stores/${storeId}/integrations`);
      const data = await res.json();
      if (res.ok && data.courier) {
        setProvider(data.courier.provider || 'STEADFAST');
        setApiKey(data.courier.apiKeyMasked || '');
        setApiSecret(data.courier.apiSecretMasked || '');
        setStoreIdRef(data.courier.storeIdRef || '');
        setPickupAddress(data.courier.pickupAddress || '');
        setPickupPhone(data.courier.pickupPhone || '');
        setConnectionStatus(data.courier.status || 'DISCONNECTED');
      }
      if (data.attempts) {
        setAttempts(data.attempts);
      }
    } catch (e) {
      console.error('Failed to load integrations:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourier = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/stores/${storeId}/integrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SAVE_COURIER',
          provider,
          apiKey,
          apiSecret,
          storeIdRef,
          pickupAddress,
          pickupPhone
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      setStatusMsg({ type: 'success', text: data.message });
      setConnectionStatus(data.status);
      fetchIntegrations();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/stores/${storeId}/integrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TEST_CONNECTION',
          provider
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Test connection failed');
      setStatusMsg({ type: 'success', text: data.message });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
        Loading merchant integration settings...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-7 h-7 text-indigo-600" /> Merchant Integration Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure automated Bangladesh Courier APIs (Steadfast & Pathao), SMS Gateways, and monitor webhook logs securely.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            connectionStatus === 'CONNECTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${connectionStatus === 'CONNECTED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {connectionStatus === 'CONNECTED' ? 'Courier Active' : 'Disconnected'}
          </span>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          <span className="text-sm font-medium">{statusMsg.text}</span>
        </div>
      )}

      {/* Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Courier Configuration */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Bangladesh Courier Integration</h2>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setProvider('STEADFAST')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                  provider === 'STEADFAST' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Steadfast Courier
              </button>
              <button
                type="button"
                onClick={() => setProvider('PATHAO')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                  provider === 'PATHAO' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pathao Courier
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveCourier} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                {provider} API Key / Client ID
              </label>
              <div className="relative">
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter Provider API Key"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowKeys(!showKeys)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                {provider} API Secret / Client Secret
              </label>
              <div className="relative">
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  placeholder="Enter Secret Key"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Merchant Store ID / Reference
                </label>
                <input
                  type="text"
                  value={storeIdRef}
                  onChange={(e) => setStoreIdRef(e.target.value)}
                  placeholder="e.g. 14209"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Pickup Contact Phone
                </label>
                <input
                  type="text"
                  value={pickupPhone}
                  onChange={(e) => setPickupPhone(e.target.value)}
                  placeholder="e.g. 01700000000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Pickup Address Details
              </label>
              <textarea
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                rows={2}
                placeholder="House, Road, Area, District"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-semibold transition flex items-center gap-2"
              >
                {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Test Connection
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-sm"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Integration
              </button>
            </div>
          </form>
        </div>

        {/* Customer SMS Notification Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">SMS Notification Template</h2>
          </div>

          <div className="space-y-4 text-xs text-slate-600">
            <p>
              Automated SMS will be dispatched to customer phone numbers whenever consignment tracking status updates.
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono space-y-1">
              <div className="font-semibold text-slate-700 text-[11px]">Available Variables:</div>
              <div>{"{{customerName}}"} - Customer Full Name</div>
              <div>{"{{orderNumber}}"} - Order Invoice ID</div>
              <div>{"{{trackingCode}}"} - Courier Tracking Code</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Order Confirmation Template
              </label>
              <textarea
                value={smsTemplate}
                onChange={(e) => setSmsTemplate(e.target.value)}
                rows={4}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="button"
              className="w-full py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition shadow-sm"
            >
              Update SMS Template
            </button>
          </div>
        </div>
      </div>

      {/* Integration Attempt & Webhook Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" /> Integration API & Webhook Activity Log
          </h2>
          <button
            onClick={fetchIntegrations}
            className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {attempts.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No integration attempts recorded yet. Create orders or trigger API tests to see live logs.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Resource</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {attempts.map((att: any) => (
                  <tr key={att.id} className="hover:bg-slate-50/50">
                    <td className="p-3 text-slate-500">{new Date(att.createdAt).toLocaleString()}</td>
                    <td className="p-3 font-semibold text-slate-900">{att.provider}</td>
                    <td className="p-3 font-mono">{att.action}</td>
                    <td className="p-3">{att.resource}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
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
  );
}
