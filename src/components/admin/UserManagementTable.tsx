'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ShieldAlert, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  _count: { stores: number; subscriptions: number };
}

export function UserManagementTable({ initialUsers }: { initialUsers: UserData[] }) {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'SUPER_ADMIN' ? 'MERCHANT' : 'SUPER_ADMIN';
    if (!confirm(`Are you sure you want to change user role to ${newRole}?`)) return;

    try {
      setUpdatingId(userId);
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: data.user.role } : u))
        );
      } else {
        alert(data.error || 'Failed to update role');
      }
    } catch (e) {
      alert('Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleVerification = async (userId: string, currentVerified: boolean) => {
    try {
      setUpdatingId(userId);
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEmailVerified: !currentVerified }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, isEmailVerified: data.user.isEmailVerified } : u
          )
        );
      } else {
        alert(data.error || 'Failed to update verification status');
      }
    } catch (e) {
      alert('Failed to update verification status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs min-w-[750px]">
        <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider">
          <tr>
            <th className="p-4">User Name</th>
            <th className="p-4">Email Address</th>
            <th className="p-4">Role Access</th>
            <th className="p-4">Verification</th>
            <th className="p-4">Owned Stores</th>
            <th className="p-4">Joined Date</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-slate-800/40">
              <td className="p-4 font-semibold text-white text-sm">{u.name}</td>
              <td className="p-4 text-slate-300 font-mono">{u.email}</td>
              <td className="p-4">
                <Badge
                  variant="outline"
                  className={
                    u.role === 'SUPER_ADMIN'
                      ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10 font-bold'
                      : 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                  }
                >
                  {u.role === 'SUPER_ADMIN' ? '🛡️ SUPER ADMIN' : '🏪 MERCHANT'}
                </Badge>
              </td>
              <td className="p-4">
                <button
                  onClick={() => toggleVerification(u.id, u.isEmailVerified)}
                  disabled={updatingId === u.id}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                    u.isEmailVerified
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                  }`}
                >
                  {u.isEmailVerified ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-amber-400" /> Pending Verification
                    </>
                  )}
                </button>
              </td>
              <td className="p-4 font-bold text-emerald-400">{u._count.stores} stores</td>
              <td className="p-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="p-4 text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleRole(u.id, u.role)}
                  disabled={updatingId === u.id}
                  className="border-slate-700 bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 text-[11px]"
                >
                  {updatingId === u.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : u.role === 'SUPER_ADMIN' ? (
                    <>
                      <ShieldAlert className="w-3 h-3 mr-1 text-rose-400" /> Downgrade Merchant
                    </>
                  ) : (
                    <>
                      <Shield className="w-3 h-3 mr-1 text-indigo-400" /> Make Super Admin
                    </>
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
