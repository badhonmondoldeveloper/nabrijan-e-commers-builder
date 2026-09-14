'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle, Loader2, PhoneCall, Hash, Building2, User, Clock, Search, Filter } from 'lucide-react';

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
  const [activeFilter, setActiveFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredSubmissions = submissions.filter((s) => {
    const matchesFilter = activeFilter === 'ALL' || s.status === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.trxId.toLowerCase().includes(q) ||
      s.senderNumber.includes(q) ||
      s.store?.name.toLowerCase().includes(q) ||
      s.user?.email.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const pendingCount = submissions.filter((s) => s.status === 'PENDING').length;
  const approvedCount = submissions.filter((s) => s.status === 'APPROVED').length;
  const rejectedCount = submissions.filter((s) => s.status === 'REJECTED').length;

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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveFilter('PENDING')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeFilter === 'PENDING' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveFilter('APPROVED')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeFilter === 'APPROVED' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setActiveFilter('REJECTED')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeFilter === 'REJECTED' ? 'bg-red-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeFilter === 'ALL' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            All Submissions ({submissions.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search TrxID, Mobile, Store..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-950 border-slate-800 text-xs text-white placeholder:text-slate-500 h-9 rounded-xl"
          />
        </div>
      </div>

      {/* Submissions Table */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl overflow-hidden">
        <CardHeader className="bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-400" />
                {activeFilter} bKash / Nagad Submissions
              </CardTitle>
              <p className="text-xs text-slate-400 mt-1">
                Verify TrxID and click Approve to instantly make merchant store LIVE and assign subscription plan.
              </p>
            </div>
            <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs px-3 py-1">
              Showing {filteredSubmissions.length} Records
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
              No {activeFilter.toLowerCase()} payment submissions found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Merchant & Store</th>
                    <th className="p-4">Sender Number</th>
                    <th className="p-4">Transaction ID (TrxID)</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-400" />
                          {sub.store?.name || 'N/A Store'}
                        </div>
                        <div className="text-slate-400 flex items-center gap-1 text-[11px] mt-0.5">
                          <User className="w-3 h-3 text-slate-500" />
                          {sub.user?.name || 'User'} ({sub.user?.email || 'N/A Email'})
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
                      <td className="p-4">
                        <Badge
                          className={
                            sub.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : sub.status === 'REJECTED'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                          }
                        >
                          {sub.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {sub.status === 'PENDING' ? (
                          <>
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
                          </>
                        ) : (
                          <span className="text-slate-500 text-xs font-medium italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
