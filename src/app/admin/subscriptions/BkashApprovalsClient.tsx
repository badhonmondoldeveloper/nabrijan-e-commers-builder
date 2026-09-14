'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, PhoneCall, Hash, Building2, User, Clock } from 'lucide-react';

interface ManualSubmission {
  id: string;
  storeId: string;
  userId: string;
  amount: number | string;
  method: string;
  senderNumber: string;
  trxId: string;
  status: string;
  adminNotes?: string | null;
  createdAt: string | Date;
  store: { name: string; slug: string; status: string };
  user: { name: string; email: string };
}

export default function BkashApprovalsClient({ initialSubmissions }: { initialSubmissions: ManualSubmission[] }) {
  const [submissions, setSubmissions] = useState<ManualSubmission[]>(initialSubmissions);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAction = async (submissionId: string, action: 'APPROVE' | 'REJECT') => {
    setLoadingId(submissionId);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/payments/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Action failed');
      }

      setMessage({ type: 'success', text: data.message });

      // Update local state
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submissionId
            ? {
                ...sub,
                status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
                store: {
                  ...sub.store,
                  status: action === 'APPROVE' ? 'ACTIVE' : 'PAYMENT_REQUIRED',
                },
              }
            : sub
        )
      );
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to process action' });
    } finally {
      setLoadingId(null);
    }
  };

  const pendingSubmissions = submissions.filter((s) => s.status === 'PENDING');
  const pastSubmissions = submissions.filter((s) => s.status !== 'PENDING');

  return (
    <div className="space-y-8 font-sans">
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Pending bKash Approvals */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl overflow-hidden">
        <CardHeader className="bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
                Pending bKash Store Activations
              </CardTitle>
              <p className="text-xs text-slate-400 mt-1">
                Verify merchant bKash TrxID and approve to instantly make their store LIVE.
              </p>
            </div>
            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-sm px-3 py-1">
              {pendingSubmissions.length} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {pendingSubmissions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
              No pending bKash activations right now. All stores are verified!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Merchant & Store</th>
                    <th className="p-4">bKash Mobile</th>
                    <th className="p-4">Transaction ID (TrxID)</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pendingSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/40">
                      <td className="p-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-400" />
                          {sub.store?.name}
                        </div>
                        <div className="text-slate-400 flex items-center gap-1 text-[11px] mt-0.5">
                          <User className="w-3 h-3 text-slate-500" />
                          {sub.user?.name} ({sub.user?.email})
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                          {sub.senderNumber}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono bg-slate-950 px-2.5 py-1 rounded text-amber-400 font-bold border border-slate-800 flex items-center gap-1 w-fit">
                          <Hash className="w-3 h-3 text-amber-500" />
                          {sub.trxId}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white">৳{Number(sub.amount)}</td>
                      <td className="p-4 text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAction(sub.id, 'APPROVE')}
                          disabled={loadingId === sub.id}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3"
                        >
                          {loadingId === sub.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve & Live
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(sub.id, 'REJECT')}
                          disabled={loadingId === sub.id}
                          className="bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold px-3"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History of Past Activations */}
      {pastSubmissions.length > 0 && (
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl overflow-hidden">
          <CardHeader className="bg-slate-900/80 border-b border-slate-800">
            <CardTitle className="text-lg font-bold text-white">Payment Submission History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Store</th>
                    <th className="p-4">Merchant</th>
                    <th className="p-4">bKash Mobile</th>
                    <th className="p-4">TrxID</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Processed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pastSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{sub.store?.name}</td>
                      <td className="p-4 text-slate-300">{sub.user?.email}</td>
                      <td className="p-4 font-mono text-slate-300">{sub.senderNumber}</td>
                      <td className="p-4 font-mono text-slate-300">{sub.trxId}</td>
                      <td className="p-4 font-bold text-white">৳{Number(sub.amount)}</td>
                      <td className="p-4">
                        <Badge
                          className={
                            sub.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }
                        >
                          {sub.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-400">{new Date(sub.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
