'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, Sparkles, CheckCircle2, Globe, Shield, MessageCircle, Phone, Mail, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

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
    bannerText: '🔥 ৩ দিনের ফ্রি ট্রায়াল সুবিধা পেতে আজই রেজিস্ট্রেশন করুন!',
    trialDays: 3,
    freePrice: 0,
    starterPrice: 599,
    proPrice: 1099,
    growthPrice: 2499,
    businessPrice: 2499,
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
          bannerText: data.settings.bannerText || '',
          trialDays: data.settings.trialDays || 3,
          freePrice: data.settings.freePrice !== undefined ? Number(data.settings.freePrice) : 0,
          starterPrice: data.settings.starterPrice !== undefined ? Number(data.settings.starterPrice) : 599,
          proPrice: data.settings.proPrice !== undefined ? Number(data.settings.proPrice) : 1099,
          growthPrice: data.settings.growthPrice !== undefined ? Number(data.settings.growthPrice) : 2499,
          businessPrice: data.settings.businessPrice !== undefined ? Number(data.settings.businessPrice) : 2499,
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
        setMessage({ type: 'success', text: 'Platform settings and branding logo saved successfully!' });
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
            Dynamically upload site logo from device, customize hero tagline, announcement bar, trial policy, and support numbers.
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
                    {form.logoUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setForm((p) => ({ ...p, logoUrl: '' }))}
                        className="border-slate-800 text-slate-400 hover:text-white text-xs"
                      >
                        Reset Default
                      </Button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supports PNG, JPG, WEBP, SVG images up to 10MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Site Platform Name</label>
                <Input
                  value={form.siteName}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  placeholder="e.g. Nabrijan E-Commerce"
                  className="bg-slate-950 border-slate-800 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Logo URL Path</label>
                <Input
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  placeholder="/uploads/site-logo.png"
                  className="bg-slate-950 border-slate-800 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Hero Subtitle / Tagline</label>
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

        {/* Subscription Pricing Management Card */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" /> ZatiqEasy Subscription Plan Prices (সাবস্ক্রিপশন প্রাইসিং পরিবর্তন)
            </CardTitle>
            <CardDescription className="text-slate-400">
              Super Admin can change monthly pricing for Free, Starter, Pro, and Growth plans dynamically across the entire website.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-xs font-bold text-slate-200 block">
                  Free Plan Price (ফ্রি ট্রায়াল)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">৳</span>
                  <Input
                    type="number"
                    min={0}
                    value={form.freePrice}
                    onChange={(e) => setForm({ ...form, freePrice: Number(e.target.value) })}
                    placeholder="0"
                    className="bg-slate-900 border-slate-700 text-white pl-7 font-extrabold text-sm"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400">Default: ৳0 / month</p>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-xs font-bold text-slate-200 block">
                  Starter Plan Price (স্টার্টার প্ল্যান)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">৳</span>
                  <Input
                    type="number"
                    min={0}
                    value={form.starterPrice}
                    onChange={(e) => setForm({ ...form, starterPrice: Number(e.target.value) })}
                    placeholder="599"
                    className="bg-slate-900 border-slate-700 text-white pl-7 font-extrabold text-sm"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400">Default: ৳599 / month</p>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-indigo-500/40">
                <label className="text-xs font-bold text-indigo-300 block">
                  Pro Plan Price (প্রো প্ল্যান - Popular)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-indigo-400 font-bold">৳</span>
                  <Input
                    type="number"
                    min={0}
                    value={form.proPrice}
                    onChange={(e) => setForm({ ...form, proPrice: Number(e.target.value) })}
                    placeholder="1099"
                    className="bg-slate-900 border-indigo-500/40 text-white pl-7 font-extrabold text-sm"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400">Default: ৳1,099 / month</p>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-purple-500/40">
                <label className="text-xs font-bold text-purple-300 block">
                  Growth Plan Price (গ্রোথ প্ল্যান)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-purple-400 font-bold">৳</span>
                  <Input
                    type="number"
                    min={0}
                    value={form.growthPrice}
                    onChange={(e) => setForm({ ...form, growthPrice: Number(e.target.value) })}
                    placeholder="2499"
                    className="bg-slate-900 border-purple-500/40 text-white pl-7 font-extrabold text-sm"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400">Default: ৳2,499 / month</p>
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
                  placeholder="+8801625642420"
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
                  placeholder="+8801625642420"
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
