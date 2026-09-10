'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, CheckCircle, Clock, Trash2, RefreshCw, Loader2, Copy, ShieldCheck } from 'lucide-react';

interface CustomDomain {
  id: string;
  domain: string;
  verificationStatus: 'PENDING' | 'VERIFIED';
  verificationCode: string;
  sslStatus: boolean;
  isPrimary: boolean;
  createdAt: string;
}

export default function StoreDomainsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const [domains, setDomains] = useState<CustomDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [domainName, setDomainName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stores/${params.storeId}/domains`);
      const data = await res.json();
      if (res.ok && data.domains) {
        setDomains(data.domains);
      }
    } catch (err) {
      console.error('Failed to load custom domains');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, [params.storeId]);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName) return alert('Enter a domain name');

    try {
      setSubmitting(true);
      const res = await fetch(`/api/stores/${params.storeId}/domains`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainName }),
      });
      const data = await res.json();
      if (res.ok) {
        setDomainName('');
        fetchDomains();
      } else {
        alert(data.message || 'Failed to add domain');
      }
    } catch (err) {
      alert('Network error adding domain');
    } finally {
      setSubmitting(false);
    }
  };

  const verifyDomain = async (domainId: string) => {
    try {
      setVerifyingId(domainId);
      const res = await fetch(`/api/stores/${params.storeId}/domains`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId }),
      });
      const data = await res.json();
      if (res.ok) {
        setDomains((prev) =>
          prev.map((d) =>
            d.id === domainId ? { ...d, verificationStatus: 'VERIFIED', sslStatus: true } : d
          )
        );
      } else {
        alert(data.message || 'Domain verification failed');
      }
    } catch (err) {
      alert('Network error verifying domain');
    } finally {
      setVerifyingId(null);
    }
  };

  const deleteDomain = async (domainId: string) => {
    if (!confirm('Remove this custom domain mapping?')) return;
    try {
      const res = await fetch(`/api/stores/${params.storeId}/domains?domainId=${domainId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setDomains((prev) => prev.filter((d) => d.id !== domainId));
      } else {
        alert(data.message || 'Failed to remove domain');
      }
    } catch (err) {
      alert('Network error removing domain');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Verification code copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Custom Domain Mapping & DNS</h1>
        <p className="text-sm text-slate-400">
          Connect your own branded domain (e.g. <code className="text-blue-400">shop.yourbrand.com</code>) to your Nabrijan store with free automatic SSL.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Add Domain Form */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-base flex items-center text-white">
              <Plus className="w-4 h-4 text-blue-400 mr-2" /> Connect Custom Domain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddDomain} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Domain Name</label>
                <Input
                  placeholder="e.g. shop.brand.com"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded border border-slate-800 space-y-1">
                <span className="font-semibold text-slate-300 block">DNS Setup Instructions:</span>
                <p>Add a <code className="text-blue-400">CNAME</code> record pointing your domain to:</p>
                <code className="block bg-slate-900 text-emerald-400 p-1.5 rounded font-mono text-[11px] select-all">
                  stores.nabrijan.com
                </code>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
                Add Domain
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Domains List */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center text-white">
              <Globe className="w-4 h-4 text-blue-400 mr-2" /> Connected Domains ({domains.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
              </div>
            ) : domains.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Globe className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-base font-semibold text-white">No Custom Domains Connected</p>
                <p className="text-xs text-slate-400 mt-1">
                  Your store is currently using the free subpath domain <code className="text-blue-400">localhost:3000/store/[slug]</code>.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {domains.map((dom) => (
                  <div key={dom.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="font-bold text-white text-base font-mono">{dom.domain}</span>
                        <Badge
                          variant="outline"
                          className={
                            dom.verificationStatus === 'VERIFIED'
                              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                              : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                          }
                        >
                          {dom.verificationStatus === 'VERIFIED' ? (
                            <span className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Active</span>
                          ) : (
                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Pending DNS</span>
                          )}
                        </Badge>
                        {dom.sslStatus && (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                            <ShieldCheck className="w-3 h-3 mr-1" /> SSL Secure
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {dom.verificationStatus !== 'VERIFIED' && (
                          <Button
                            size="sm"
                            onClick={() => verifyDomain(dom.id)}
                            disabled={verifyingId === dom.id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs"
                          >
                            {verifyingId === dom.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                            ) : (
                              <RefreshCw className="w-3.5 h-3.5 mr-1" />
                            )}
                            Verify DNS
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteDomain(dom.id)}
                          className="text-red-400 hover:bg-red-950/40 hover:text-red-300 h-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {dom.verificationStatus === 'PENDING' && (
                      <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs space-y-2">
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Verification TXT / CNAME Token:</span>
                          <button
                            onClick={() => copyToClipboard(dom.verificationCode)}
                            className="flex items-center text-blue-400 hover:text-blue-300 font-mono text-[11px]"
                          >
                            <Copy className="w-3 h-3 mr-1" /> Copy Code
                          </button>
                        </div>
                        <code className="block bg-slate-950 text-slate-300 p-2 rounded font-mono text-[11px]">
                          {dom.verificationCode}
                        </code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
