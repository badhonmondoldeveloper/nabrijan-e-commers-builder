'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Shield, Trash2, Loader2, Check } from 'lucide-react';

interface StaffMember {
  id: string;
  role: string;
  status: string;
  permissions: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const AVAILABLE_PERMISSIONS = [
  { id: 'products:read', name: 'View Products' },
  { id: 'products:write', name: 'Manage Products' },
  { id: 'orders:read', name: 'View Orders' },
  { id: 'orders:write', name: 'Manage Orders' },
  { id: 'inventory:read', name: 'View Inventory' },
  { id: 'inventory:write', name: 'Adjust Stock' },
  { id: 'settings:write', name: 'Store Settings' },
];

export default function StoreStaffPage({
  params,
}: {
  params: { storeId: string };
}) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MANAGER');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'products:read',
    'orders:read',
    'inventory:read',
  ]);
  const [submitting, setSubmitting] = useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stores/${params.storeId}/staff`);
      const data = await res.json();
      if (res.ok && data.staff) {
        setStaff(data.staff);
      }
    } catch (err) {
      console.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [params.storeId]);

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert('Please enter user email');

    try {
      setSubmitting(true);
      const res = await fetch(`/api/stores/${params.storeId}/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role,
          permissions: selectedPermissions,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmail('');
        fetchStaff();
      } else {
        alert(data.message || 'Failed to add staff member');
      }
    } catch (err) {
      alert('Network error adding staff');
    } finally {
      setSubmitting(false);
    }
  };

  const removeStaff = async (staffId: string) => {
    if (!confirm('Remove this staff member from your store?')) return;
    try {
      const res = await fetch(`/api/stores/${params.storeId}/staff?staffId=${staffId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setStaff((prev) => prev.filter((s) => s.id !== staffId));
      } else {
        alert(data.message || 'Failed to remove staff member');
      }
    } catch (err) {
      alert('Network error removing staff');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Staff & Permissions</h1>
        <p className="text-sm text-slate-400">
          Invite store managers, order fulfillers, and inventory handlers with fine-grained access control.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Add Staff Form */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-base flex items-center text-white">
              <UserPlus className="w-4 h-4 text-blue-400 mr-2" /> Invite Staff Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Registered User Email</label>
                <Input
                  type="email"
                  placeholder="manager@store.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Staff Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MANAGER">Store Manager</option>
                  <option value="ORDER_MANAGER">Order Fulfiller</option>
                  <option value="PRODUCT_MANAGER">Catalog Manager</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Granular Permissions</label>
                <div className="space-y-2">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const active = selectedPermissions.includes(perm.id);
                    return (
                      <button
                        type="button"
                        key={perm.id}
                        onClick={() => togglePermission(perm.id)}
                        className={`w-full flex items-center justify-between p-2 rounded text-xs transition border ${
                          active
                            ? 'bg-blue-600/10 border-blue-500/40 text-blue-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <span>{perm.name}</span>
                        {active && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                Invite Staff Member
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Staff List */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center text-white">
              <Users className="w-4 h-4 text-emerald-400 mr-2" /> Active Staff Members ({staff.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
              </div>
            ) : staff.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Shield className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-base font-semibold text-white">No Additional Staff Invited</p>
                <p className="text-xs text-slate-400 mt-1">You are currently the sole owner managing this store.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {staff.map((st) => {
                  let perms: string[] = [];
                  try {
                    perms = JSON.parse(st.permissions || '[]');
                  } catch (e) {}

                  return (
                    <div key={st.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white text-sm">{st.user.name}</span>
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                            {st.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">{st.user.email}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {perms.map((p) => (
                            <span key={p} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 text-[10px] rounded">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeStaff(st.id)}
                        className="text-red-400 hover:bg-red-950/40 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
