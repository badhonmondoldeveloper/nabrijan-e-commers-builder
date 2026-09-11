'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, Sparkles, CheckCircle2, Globe, Shield, MessageCircle, Phone, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    siteName: 'Nabrijan E-Commerce',
    siteTagline: 'Create your professional online store in minutes',
    logoUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&q=80',
    bannerText: '🔥 ৩ দিনের ফ্রি ট্রায়াল সুবিধা পেতে আজই রেজিস্ট্রেশন করুন!',
    trialDays: 3,
    contactEmail: 'badhonmondoldeveloper@gmail.com',
    contactPhone: '01700000000',
    whatsappNumber: '01700000000',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (res.ok && data.settings) {
        setForm({
          siteName: data.settings.siteName || 'Nabrijan E-Commerce',
          siteTagline: data.settings.siteTagline || '',
          logoUrl: data.settings.logoUrl || '',
          bannerText: data.settings.bannerText || '',
          trialDays: data.settings.trialDays || 3,
          contactEmail: data.settings.contactEmail || '',
          contactPhone: data.settings.contactPhone || '',
          whatsappNumber: data.settings.whatsappNumber || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch platform settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Platform settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save settings' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-12 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
        Loading Platform Settings...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 md:p-12 space-y-8 font-sans max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 mb-2">
            <Settings className="w-3 h-3 mr-1" /> Super Admin Global Settings
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Site Branding & Customization</h1>
          <p className="text-sm text-slate-400">
            Dynamically customize platform logo, hero title, announcement text, trial policy, and support contacts.
          </p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Branding Card */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" /> Platform Identity & Logo
            </CardTitle>
            <CardDescription className="text-slate-400">
              Customize the site name, tagline, and brand logo URL across the main homepage and header.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">Site Platform Name</label>
                <Input
                  value={form.siteName}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  placeholder="e.g. Nabrijan E-Commerce"
                  className="bg-slate-950 border-slate-800 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">Logo Image URL</label>
                <Input
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Hero Tagline / Subtitle</label>
              <Input
                value={form.siteTagline}
                onChange={(e) => setForm({ ...form, siteTagline: e.target.value })}
                placeholder="e.g. Create your professional online store in minutes"
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Announcement & Trial Policy Card */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Top Announcement & Free Trial Policy
            </CardTitle>
            <CardDescription className="text-slate-400">
              Set default free trial duration (3 days) and global homepage promo text.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Global Announcement Banner Text</label>
              <textarea
                rows={2}
                value={form.bannerText}
                onChange={(e) => setForm({ ...form, bannerText: e.target.value })}
                placeholder="🔥 ৩ দিনের ফ্রি ট্রায়াল সুবিধা পেতে আজই রেজিস্ট্রেশন করুন!"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-xs"
              />
            </div>

            <div className="space-y-2 max-w-xs">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Default Free Trial Days</label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={form.trialDays}
                  onChange={(e) => setForm({ ...form, trialDays: Number(e.target.value) })}
                  className="bg-slate-950 border-slate-800 text-white w-28 font-bold text-center"
                  required
                />
                <span className="text-xs text-slate-400 font-semibold">Days (Recommended: 3)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support & Contact Card */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-400" /> Platform Contact & Support Info
            </CardTitle>
            <CardDescription className="text-slate-400">
              Provide contact details for merchant inquiries and customer support.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1 mb-1">
                  <Phone className="w-3.5 h-3.5 text-blue-400" /> Contact Phone
                </label>
                <Input
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  placeholder="01700000000"
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1 mb-1">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Number
                </label>
                <Input
                  value={form.whatsappNumber}
                  onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                  placeholder="01700000000"
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1 mb-1">
                  <Mail className="w-3.5 h-3.5 text-sky-400" /> Support Email
                </label>
                <Input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  placeholder="badhonmondoldeveloper@gmail.com"
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 h-12 shadow-lg shadow-blue-500/20"
          >
            {saving ? 'Saving Settings...' : 'Save Site Settings'} <Save className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}
