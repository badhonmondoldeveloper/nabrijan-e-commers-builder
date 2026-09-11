'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Plus, Trash2, Upload, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CreateProductPage({ params }: { params: { storeId: string } }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    regularPrice: 0,
    salePrice: 0,
    costPrice: 0,
    sku: '',
    barcode: '',
    stock: 10,
    lowStockThreshold: 3,
    weight: 0.5,
    categoryId: '',
    images: [] as string[],
    variants: [
      { title: 'Default Variant', sku: '', price: 0, stock: 10, attributes: { Size: 'Standard' } }
    ],
  });

  useEffect(() => {
    // Fetch categories for store
    fetch(`/api/stores/${params.storeId}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, [params.storeId]);

  const handleTitleChange = (val: string) => {
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setForm((p) => ({ ...p, title: val, slug: autoSlug }));
  };

  const handleDeviceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError('');

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`/api/stores/${params.storeId}/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || `Failed to upload ${file.name}`);
        }
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }

      setForm((p) => ({
        ...p,
        images: [...p.images, ...uploadedUrls],
      }));
    } catch (err: any) {
      setError(err.message || 'Device image upload failed');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const url = prompt('Enter Image URL (Unsplash/CDN/Web):');
    if (url && url.trim()) {
      setForm((p) => ({ ...p, images: [...p.images, url.trim()] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) return setError('Product Title is required');
    if (form.regularPrice <= 0) return setError('Regular Price must be greater than 0');

    setLoading(true);

    try {
      const finalImages = form.images.length > 0 ? form.images : [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
      ];

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        shortDescription: form.shortDescription.trim() || undefined,
        fullDescription: form.fullDescription.trim() || undefined,
        regularPrice: Number(form.regularPrice),
        salePrice: form.salePrice > 0 ? Number(form.salePrice) : null,
        costPrice: form.costPrice > 0 ? Number(form.costPrice) : 0,
        sku: form.sku.trim() || undefined,
        barcode: form.barcode.trim() || undefined,
        categoryId: form.categoryId || null,
        stock: Number(form.stock) || 0,
        lowStockThreshold: Number(form.lowStockThreshold) || 5,
        weight: Number(form.weight) || 0,
        status: 'ACTIVE',
        images: finalImages,
        variants: form.variants.map((v) => ({
          title: v.title || 'Standard',
          sku: v.sku.trim() || undefined,
          price: v.price > 0 ? Number(v.price) : Number(form.regularPrice),
          salePrice: form.salePrice > 0 ? Number(form.salePrice) : null,
          stock: Number(v.stock) || Number(form.stock) || 0,
          attributes: v.attributes || { Standard: 'Default' },
        })),
      };

      const res = await fetch(`/api/stores/${params.storeId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create product');
      }

      router.push(`/dashboard/stores/${params.storeId}/products`);
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href={`/dashboard/stores/${params.storeId}/products`}
        className="inline-flex items-center text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Products Catalog
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Add New Product</h1>
        <p className="text-sm text-slate-400">
          Configure product titles, pricing, device image uploads, stock levels, and category.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-md">
            {error}
          </div>
        )}

        {/* Basic Details */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg">Product Details</CardTitle>
            <CardDescription className="text-slate-400">Core title, slug, category, and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Product Title *</label>
                <Input
                  type="text"
                  placeholder="Premium Smart Watch"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">URL Slug *</label>
                <Input
                  type="text"
                  placeholder="premium-smart-watch"
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  required
                  className="bg-slate-950 border-slate-800 text-white font-mono text-xs"
                />
              </div>
            </div>

            {categories.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Category (ক্যাটাগরি)</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                  className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-sm text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Select Category (Optional)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">Short Summary</label>
                <button
                  type="button"
                  onClick={async () => {
                    if (!form.title) return alert('Please enter Product Title first!');
                    try {
                      const res = await fetch(`/api/stores/${params.storeId}/ai/generate-copy`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: form.title }),
                      });
                      const data = await res.json();
                      if (res.ok && data.copy) {
                        setForm((p) => ({
                          ...p,
                          shortDescription: data.copy.shortDescription,
                          fullDescription: data.copy.fullDescription,
                        }));
                      } else {
                        alert(data.message || 'AI generation failed');
                      }
                    } catch (e) {
                      alert('AI generation failed');
                    }
                  }}
                  className="text-xs text-pink-400 hover:text-pink-300 flex items-center font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> ✨ Generate AI Copy
                </button>
              </div>
              <Input
                type="text"
                placeholder="High resolution AMOLED display with fitness tracking"
                value={form.shortDescription}
                onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
                className="bg-slate-950 border-slate-800 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Cost Profit Analysis */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg">Pricing & Profit Estimation</CardTitle>
            <CardDescription className="text-slate-400">Regular price and optional discount price</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Regular Price (৳) *</label>
                <Input
                  type="number"
                  placeholder="2500"
                  value={form.regularPrice || ''}
                  onChange={(e) => setForm((p) => ({ ...p, regularPrice: parseFloat(e.target.value) || 0 }))}
                  required
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Sale Price (৳ Optional)</label>
                <Input
                  type="number"
                  placeholder="1990"
                  value={form.salePrice || ''}
                  onChange={(e) => setForm((p) => ({ ...p, salePrice: parseFloat(e.target.value) || 0 }))}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Cost Price (৳ Product Cost)</label>
                <Input
                  type="number"
                  placeholder="1200"
                  value={form.costPrice || ''}
                  onChange={(e) => setForm((p) => ({ ...p, costPrice: parseFloat(e.target.value) || 0 }))}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
            </div>

            {form.regularPrice > 0 && form.costPrice > 0 && (
              <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-md flex items-center justify-between text-xs text-blue-300">
                <span>Estimated Profit per unit:</span>
                <span className="font-bold text-emerald-400">
                  ৳{(form.salePrice || form.regularPrice) - form.costPrice} profit / unit
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock & SKU */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="text-lg">Inventory & Stock Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Initial Stock Quantity</label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm((p) => ({ ...p, stock: parseInt(e.target.value) || 0 }))}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Low Stock Alert Level</label>
                <Input
                  type="number"
                  value={form.lowStockThreshold}
                  onChange={(e) => setForm((p) => ({ ...p, lowStockThreshold: parseInt(e.target.value) || 0 }))}
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">SKU Code</label>
                <Input
                  type="text"
                  placeholder="SW-001"
                  value={form.sku}
                  onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                  className="bg-slate-950 border-slate-800 text-white font-mono text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Image Uploader & Media Gallery */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Product Photos (প্রোডাক্টের ছবি)</CardTitle>
              <CardDescription className="text-slate-400">
                Upload photos directly from your device (Mobile / Laptop / Gallery)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={handleDeviceFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 mr-1.5" /> 📷 Device থেকে ছবি দিন
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleAddImageUrl}
                size="sm"
                className="border-slate-800 bg-slate-950 text-slate-300 text-xs"
              >
                <ImageIcon className="w-3.5 h-3.5 mr-1" /> URL দিন
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.images.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-8 text-center cursor-pointer transition bg-slate-950/50"
              >
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-300">ডিভাইস থেকে ছবি আপলোড করতে এখানে ক্লিক করুন</p>
                <p className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP files allowed (Multiple files supported)</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {form.images.map((url, idx) => (
                  <div key={idx} className="relative group rounded-lg border border-slate-800 overflow-hidden bg-slate-950 aspect-square">
                    <img src={url} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                      className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition shadow-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded shadow flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Main Image
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href={`/dashboard/stores/${params.storeId}/products`}>
            <Button type="button" variant="outline" className="border-slate-800 bg-slate-950 text-slate-300">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading || uploadingImage} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Save & Publish Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}

