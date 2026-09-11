'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, Save, CheckCircle2, Store, Phone, Mail, MapPin, MessageSquare, Globe, Palette, ShieldCheck } from 'lucide-react';

export default function StoreSettingsPage({ params }: { params: { storeId: string } }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    name: '',
    category: '',
    logo: '',
    banner: '',
    phone: '',
    email: '',
    address: '',
    whatsappNumber: '',
    facebookUrl: '',
    instagramUrl: '',
    announcementText: '',
    accentColor: '#2563eb',
    enableCOD: true,
    seoTitle: '',
    seoDescription: '',
  });

  useEffect(() => {
    fetchStoreDetails();
  }, [params.storeId]);

  const fetchStoreDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stores/${params.storeId}`);
      const data = await res.json();
      if (res.ok && data.store) {
        const s = data.store;
        const st = s.settings || {};
        setForm({
          name: s.name || '',
          category: s.category || '',
          logo: s.logo || '',
          banner: s.banner || '',
          phone: st.phone || '',
          email: st.email || '',
          address: st.address || '',
          whatsappNumber: st.whatsappNumber || '',
          facebookUrl: st.facebookUrl || '',
          instagramUrl: st.instagramUrl || '',
          announcementText: st.announcementText || '',
          accentColor: st.accentColor || '#2563eb',
          enableCOD: st.enableCOD ?? true,
          seoTitle: st.seoTitle || '',
          seoDescription: st.seoDescription || '',
        });
      }
    } catch (err: any) {
      setError('Failed to load store settings');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'banner') => {
    if (type === 'logo') setUploadingLogo(true);
    else setUploadingBanner(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/stores/${params.storeId}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      if (data.url) {
        setForm((p) => ({ ...p, [type]: data.url }));
        setMessage(`${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully!`);
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingBanner(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`/api/stores/${params.storeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update settings');

      setMessage('Store settings and vendor details saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center">
          <Store className="w-6 h-6 mr-2 text-blue-500" /> Store Branding & Vendor Settings
        </h1>
        <p className="text-sm text-slate-400">
          Customize your store logo, banner, WhatsApp order number, contact details, and theme design.
        </p>
      </div>

      {message && (
        <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-md flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2" /> {message}
        </div>
      )}

      {error && (
        <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Assets (Logo & Banner) */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Palette className="w-5 h-5 mr-2 text-pink-400" /> Store Branding & Media Assets
            </CardTitle>
            <CardDescription className="text-slate-400">
              Upload your official store logo and storefront banner from your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-300">Store Logo (লোগো)</label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center text-slate-600">
                    {form.logo ? (
                      <img src={form.logo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <Store className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={logoInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')}
                    />
                    <Button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                      variant="outline"
                      size="sm"
                      className="border-slate-800 bg-slate-950 text-slate-300 text-xs"
                    >
                      {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Upload className="w-3.5 h-3.5 mr-1" />}
                      📷 Upload Logo
                    </Button>
                    <p className="text-[11px] text-slate-500 mt-1">Recommended: 200x200 PNG/JPG</p>
                  </div>
                </div>
              </div>

              {/* Banner Upload */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-300">Storefront Banner (ব্যানার)</label>
                <div className="space-y-2">
                  <div className="w-full h-20 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center text-slate-600">
                    {form.banner ? (
                      <img src={form.banner} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-500">No Banner Uploaded</span>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={bannerInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'banner')}
                  />
                  <Button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={uploadingBanner}
                    variant="outline"
                    size="sm"
                    className="border-slate-800 bg-slate-950 text-slate-300 text-xs"
                  >
                    {uploadingBanner ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Upload className="w-3.5 h-3.5 mr-1" />}
                    🖼️ Upload Banner Image
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Store Name *</label>
                <Input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Business Category</label>
                <Input
                  type="text"
                  placeholder="Fashion, Electronics, Grocery..."
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Contact & Social Info */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Phone className="w-5 h-5 mr-2 text-emerald-400" /> Vendor Contact & Social Profiles
            </CardTitle>
            <CardDescription className="text-slate-400">
              Customers will see these contact details on your shop header, footer, and checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" /> Contact Phone Number
                </label>
                <Input
                  type="text"
                  placeholder="01712345678"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 flex items-center">
                  <MessageSquare className="w-3.5 h-3.5 mr-1 text-emerald-400" /> WhatsApp Number (for Quick Order Button)
                </label>
                <Input
                  type="text"
                  placeholder="01712345678"
                  value={form.whatsappNumber}
                  onChange={(e) => setForm((p) => ({ ...p, whatsappNumber: e.target.value }))}
                  className="bg-slate-950 border-slate-800 text-white font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" /> Customer Support Email
                </label>
                <Input
                  type="email"
                  placeholder="support@mystore.com"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> Store Physical Address
                </label>
                <Input
                  type="text"
                  placeholder="House #12, Road #4, Dhanmondi, Dhaka"
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 flex items-center">
                  <Globe className="w-3.5 h-3.5 mr-1 text-blue-400" /> Facebook Page Link
                </label>
                <Input
                  type="url"
                  placeholder="https://facebook.com/yourpage"
                  value={form.facebookUrl}
                  onChange={(e) => setForm((p) => ({ ...p, facebookUrl: e.target.value }))}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 flex items-center">
                  <Globe className="w-3.5 h-3.5 mr-1 text-pink-400" /> Instagram Profile Link
                </label>
                <Input
                  type="url"
                  placeholder="https://instagram.com/yourhandle"
                  value={form.instagramUrl}
                  onChange={(e) => setForm((p) => ({ ...p, instagramUrl: e.target.value }))}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storefront Design & Announcement Bar */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg">Announcement Bar & Theme</CardTitle>
            <CardDescription className="text-slate-400">Header notification bar for special offers or notices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Top Announcement Bar Text</label>
              <Input
                type="text"
                placeholder="🔥 সারা বাংলাদেশে ক্যাশ অন ডেলিভারি এবং দ্রুত ডেলিভারি!"
                value={form.announcementText}
                onChange={(e) => setForm((p) => ({ ...p, announcementText: e.target.value }))}
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save & Update Vendor Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
