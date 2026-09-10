'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Plus, Trash2, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function CreateProductPage({ params }: { params: { storeId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
    variants: [
      { title: 'Default Variant', sku: '', price: 0, stock: 10, attributes: { Size: 'Standard' } }
    ],
  });

  const handleTitleChange = (val: string) => {
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setForm((p) => ({ ...p, title: val, slug: autoSlug }));
  };

  const handleAddImageUrl = () => {
    const url = prompt('Enter Image URL (Unsplash/CDN/Upload):');
    if (url) {
      setForm((p) => ({ ...p, images: [...p.images, url] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/stores/${params.storeId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          variants: form.variants.map((v) => ({
            ...v,
            price: v.price || form.regularPrice,
          })),
        }),
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
          Configure product titles, pricing, cost analysis, stock levels, and media images.
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
            <CardDescription className="text-slate-400">Core title, slug, and descriptions</CardDescription>
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
            <CardDescription className="text-slate-400">Cost price is used to compute net profit analytics</CardDescription>
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

            <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-md flex items-center justify-between text-xs text-blue-300">
              <span>Estimated Margin per unit:</span>
              <span className="font-bold text-emerald-400">
                ৳{(form.salePrice || form.regularPrice) - form.costPrice} profit / unit
              </span>
            </div>
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

        {/* Product Images Uploader / Media Library */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Product Media Gallery</CardTitle>
              <CardDescription className="text-slate-400">Mobile drag-and-drop or URL image picker</CardDescription>
            </div>
            <Button type="button" variant="outline" onClick={handleAddImageUrl} size="sm" className="border-slate-800 bg-slate-950 text-slate-300">
              <Upload className="w-3.5 h-3.5 mr-1.5" /> Add Image URL
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {form.images.map((url, idx) => (
                <div key={idx} className="relative group rounded-lg border border-slate-800 overflow-hidden bg-slate-950 aspect-square">
                  <img src={url} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                    className="absolute top-2 right-2 p-1.5 bg-red-600/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded">
                      Main Image
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href={`/dashboard/stores/${params.storeId}/products`}>
            <Button variant="outline" className="border-slate-800 bg-slate-950 text-slate-300">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Save & Publish Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
