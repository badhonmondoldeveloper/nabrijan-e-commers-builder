'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, Sparkles, CheckCircle2, Globe, Shield, MessageCircle, Phone, Mail, Upload, Loader2, Image as ImageIcon, CreditCard } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    siteName: 'Nabrijan E-Commerce',
    siteTagline: 'Create your professional online store in minutes',
    logoUrl: '',
    bannerText: '🔥 ৳৫০০ টাকায় ফুল স্টোর প্যাকেজ সাবস্ক্রিপশন চালু করুন!',
    fullPackagePrice: 500,
    bkashNumber: '01625642420',
    bkashType: 'Personal',
    contactEmail: 'badhonmondoldeveloper@gmail.com',
    contactPhone: '+8801625642420',
    whatsappNumber: '+8801625642420',
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
          bannerText: data.settings.bannerText || '🔥 ৳৫০০ টাকায় ফুল স্টোর প্যাকেজ সাবস্ক্রিপশন চালু করুন!',
          fullPackagePrice: data.settings.fullPackagePrice !== undefined ? Number(data.settings.fullPackagePrice) : 500,
          bkashNumber: data.settings.bkashNumber || '01625642420',
          bkashType: data.settings.bkashType || 'Personal',
          contactEmail: data.settings.contactEmail || 'badhonmondoldeveloper@gmail.com',
          contactPhone: data.settings.contactPhone || '+8801625642420',
          whatsappNumber: data.settings.whatsappNumber || '+8801625642420',
        });
      }
    } catch (err) {
      console.error('Failed to fetch platform settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Logo upload failed');

      if (data.url) {
        setForm((prev) => ({ ...prev, logoUrl: data.url }));
        setMessage({ type: 'success', text: 'Logo image uploaded successfully from your device!' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload logo image' });
    } finally {
      setUploadingLogo(false);
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
        setMessage({ type: 'success', text: 'Platform settings and bKash payment receiver numbers saved successfully!' });
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
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Site Branding & bKash Payment Settings</h1>
          <p className="text-sm text-slate-400">
            Manage your bKash payment receiver number, single ৳500 plan pricing, site logo, and contact info.
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
        {/* bKash Payment Receiving Numbers Management Card */}
        <Card className="bg-slate-900 border-2 border-pink-500/40 text-slate-100 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-pink-950/40 to-slate-900 border-b border-slate-800">
            <CardTitle className="text-lg flex items-center gap-2 text-pink-400">
              <CreditCard className="w-5 h-5 text-pink-400" /> bKash Merchant Payment Receiver Settings (বিকাশ নম্বর ম্যানেজমেন্ট)
            </CardTitle>
            <CardDescription className="text-slate-300">
              মার্চেন্টরা আপনার স্টোর লাইভ করার জন্য এই বিকাশ নম্বরে ৫০০ টাকা পাঠাবে। আপনি নিচে বিকাশ নম্বর পরিবর্তন করতে পারবেন।
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-pink-300 block">
                  bKash Payment Receiver Phone Number (বিকাশ নম্বর)
                </label>
                <Input
                  type="text"
                  value={form.bkashNumber}
                  onChange={(e) => setForm({ ...form, bkashNumber: e.target.value })}
                  placeholder="01625642420"
                  className="bg-slate-950 border-pink-500/30 text-white font-mono text-base font-extrabold tracking-wider"
                  required
                />
                <p className="text-[11px] text-slate-400">এই নম্বরে মার্চেন্টরা ৫০০ টাকা পেমেন্ট পাঠাবে।</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  bKash Account Type (বিকাশ টাইপ)
                </label>
                <select
                  value={form.bkashType}
                  onChange={(e) => setForm({ ...form, bkashType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-xs font-bold"
                >
                  <option value="Personal">Personal (Send Money)</option>
                  <option value="Agent">Agent (Cash In)</option>
                  <option value="Merchant">Merchant (Payment)</option>
                </select>
                <p className="text-[11px] text-slate-400">Personal / Agent / Merchant</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-300 block">Full Store Package Subscription Fee</span>
                <span className="text-xs text-slate-400">Merchant Store Activation Fee per Month</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-emerald-400">৳</span>
                <Input
                  type="number"
                  min={1}
                  value={form.fullPackagePrice}
                  onChange={(e) => setForm({ ...form, fullPackagePrice: Number(e.target.value) })}
                  className="bg-slate-900 border-emerald-500/40 text-emerald-400 font-black text-lg w-32 text-center"
                  required
                />
                <span className="text-xs text-slate-400 font-bold">/ Month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Branding Card */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" /> Platform Identity & Website Logo
            </CardTitle>
            <CardDescription className="text-slate-400">
              Upload your official Nabrijan logo photo from your device or paste a URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Device Upload Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <label className="text-xs font-semibold text-slate-300 block">
                Nabrijan Official Website Logo (ডিভাইস থেকে ফটো আপলোড করুন)
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden flex items-center justify-center shrink-0">
                  {form.logoUrl ? (
                    <img src={form.logoUrl} alt="Nabrijan Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xl">
                      N
                    </div>
                  )}
                </div>

                <div className="space-y-2 w-full">
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      {uploadingLogo ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                      ) : (
                        <Upload className="w-4 h-4 mr-1.5" />
                      )}
                      📷 Device থেকে লোগো পিকচার সিলেক্ট করুন
                    </Button>
                  </div>

                  <Input
                    type="url"
                    value={form.logoUrl}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                    placeholder="https://your-domain.com/logo.png"
                    className="bg-slate-900 border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Website Name</label>
                <Input
                  type="text"
                  value={form.siteName}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  className="bg-slate-950 border-slate-800 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Hero Tagline</label>
                <Input
                  type="text"
                  value={form.siteTagline}
                  onChange={(e) => setForm({ ...form, siteTagline: e.target.value })}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support & Contact Channels */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-400" /> Platform Contact & Support Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> Official Email Address
              </label>
              <Input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="bg-slate-950 border-slate-800 text-white text-xs"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Support Helpline Phone
              </label>
              <Input
                type="text"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="bg-slate-950 border-slate-800 text-white text-xs"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-green-500" /> WhatsApp Support Number
              </label>
              <Input
                type="text"
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                className="bg-slate-950 border-slate-800 text-white text-xs"
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 py-3 rounded-xl text-sm shadow-xl"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save All Admin Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
