'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Plus, Trash2, Upload, Image as ImageIcon, Sparkles, CheckCircle2, Layers } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const COMMON_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const COMMON_COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Navy', 'Maroon', 'Yellow'];

export default function CreateProductPage({ params }: { params: { storeId: string } }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  // Variant options state
  const [hasVariants, setHasVariants] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

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
    variants: [] as Array<{
      title: string;
      sku: string;
      price: number;
      salePrice?: number;
      stock: number;
      attributes: Record<string, string>;
    }>,
  });

  useEffect(() => {
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

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err: any) {
      setError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Size/Color chip toggles
  const toggleSize = (sz: string) => {
    const updated = selectedSizes.includes(sz)
      ? selectedSizes.filter((s) => s !== sz)
      : [...selectedSizes, sz];
    setSelectedSizes(updated);
    generateVariants(updated, selectedColors);
  };

  const toggleColor = (clr: string) => {
    const updated = selectedColors.includes(clr)
      ? selectedColors.filter((c) => c !== clr)
      : [...selectedColors, clr];
    setSelectedColors(updated);
    generateVariants(selectedSizes, updated);
  };

  const generateVariants = (sizes: string[], colors: string[]) => {
    if (sizes.length === 0 && colors.length === 0) {
      setForm((p) => ({ ...p, variants: [] }));
      return;
    }

    const generated: Array<{
      title: string;
      sku: string;
      price: number;
      salePrice?: number;
      stock: number;
      attributes: Record<string, string>;
    }> = [];

    const regPrice = Number(form.regularPrice) || 0;
    const slPrice = Number(form.salePrice) || undefined;
    const stk = Number(form.stock) || 10;

    if (sizes.length > 0 && colors.length > 0) {
      sizes.forEach((sz) => {
        colors.forEach((clr) => {
          generated.push({
            title: `${sz} / ${clr}`,
            sku: `${form.sku ? form.sku + '-' : ''}${sz.toUpperCase()}-${clr.toUpperCase()}`,
            price: regPrice,
            salePrice: slPrice,
            stock: stk,
            attributes: { Size: sz, Color: clr },
          });
        });
      });
    } else if (sizes.length > 0) {
      sizes.forEach((sz) => {
        generated.push({
          title: `Size: ${sz}`,
          sku: `${form.sku ? form.sku + '-' : ''}${sz.toUpperCase()}`,
          price: regPrice,
          salePrice: slPrice,
          stock: stk,
          attributes: { Size: sz },
        });
      });
    } else if (colors.length > 0) {
      colors.forEach((clr) => {
        generated.push({
          title: `Color: ${clr}`,
          sku: `${form.sku ? form.sku + '-' : ''}${clr.toUpperCase()}`,
          price: regPrice,
          salePrice: slPrice,
          stock: stk,
          attributes: { Color: clr },
        });
      });
    }

    setForm((p) => ({ ...p, variants: generated }));
  };

  const updateVariantItem = (idx: number, field: string, value: any) => {
    setForm((prev) => {
      const updated = [...prev.variants];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || form.regularPrice <= 0) {
      setError('Please fill in product title, unique slug, and valid regular price');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        shortDescription: form.shortDescription,
        fullDescription: form.fullDescription,
        regularPrice: Number(form.regularPrice),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        costPrice: Number(form.costPrice) || 0,
        sku: form.sku,
        barcode: form.barcode,
        stock: Number(form.stock) || 0,
        lowStockThreshold: Number(form.lowStockThreshold) || 3,
        weight: Number(form.weight) || 0,
        categoryId: form.categoryId || null,
        status: 'ACTIVE',
        images: form.images,
        variants: hasVariants && form.variants.length > 0 ? form.variants : [
          {
            title: 'Default Variant',
            sku: form.sku || 'DEF-01',
            price: Number(form.regularPrice),
            salePrice: form.salePrice ? Number(form.salePrice) : undefined,
            stock: Number(form.stock) || 0,
            attributes: { Standard: 'Default' },
          }
        ],
      };

      const res = await fetch(`/api/stores/${params.storeId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(`/dashboard/stores/${params.storeId}/products`);
      } else {
        setError(data.message || 'Failed to create product');
      }
    } catch (err: any) {
      setError(err.message || 'Product creation error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 max-w-full overflow-x-hidden font-sans pb-12">
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/stores/${params.storeId}/products`}>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Add New Product</h1>
        <p className="text-sm text-slate-400">
          Create a new single-vendor product item with pricing, images, and Size/Color variants.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Product Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-slate-300">Product Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Auravia Melasma Brightening Serum"
                className="bg-slate-950 border-slate-800 text-white mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-slate-300">Product Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="auravia-melasma-brightening-serum"
                  className="bg-slate-950 border-slate-800 text-white mt-1 font-mono text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-xs text-slate-300">Category</Label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full h-9 rounded-md bg-slate-950 border border-slate-800 text-white text-xs px-3 mt-1"
                >
                  <option value="">Select Category (Optional)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs text-slate-300">Short Description</Label>
              <textarea
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                rows={2}
                placeholder="Brief summary of product features..."
                className="w-full rounded-md bg-slate-950 border border-slate-800 text-white text-xs p-3 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Stock */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Pricing & Stock Inventory</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-slate-300">Regular Price (৳) *</Label>
              <Input
                type="number"
                value={form.regularPrice}
                onChange={(e) => setForm({ ...form, regularPrice: Number(e.target.value) })}
                className="bg-slate-950 border-slate-800 text-white mt-1 font-bold text-emerald-400"
                required
              />
            </div>
            <div>
              <Label className="text-xs text-slate-300">Sale Price (৳)</Label>
              <Input
                type="number"
                value={form.salePrice}
                onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })}
                className="bg-slate-950 border-slate-800 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-300">Stock Quantity *</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                className="bg-slate-950 border-slate-800 text-white mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-xs text-slate-300">SKU Code</Label>
              <Input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="SKU-1001"
                className="bg-slate-950 border-slate-800 text-white mt-1 font-mono text-xs"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-300">Cost Price (৳)</Label>
              <Input
                type="number"
                value={form.costPrice}
                onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })}
                className="bg-slate-950 border-slate-800 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-300">Low Stock Alert Level</Label>
              <Input
                type="number"
                value={form.lowStockThreshold}
                onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })}
                className="bg-slate-950 border-slate-800 text-white mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Product Images</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Upload high-quality images from your phone or device. First image is the main cover.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {form.images.map((imgUrl, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden group">
                  <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-950 flex flex-col items-center justify-center text-slate-400 hover:text-white transition"
              >
                {uploadingImage ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-semibold">Upload Device Image</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleDeviceFileUpload}
              />
            </div>
          </CardContent>
        </Card>

        {/* Size & Color Variant Builder */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-white flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-indigo-400" /> Size & Color Variants
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-0.5">
                  Enable size or color selection options for buyers.
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasVariantsToggle"
                  checked={hasVariants}
                  onCheckedChange={(c) => {
                    const checked = Boolean(c);
                    setHasVariants(checked);
                    if (!checked) {
                      setForm((p) => ({ ...p, variants: [] }));
                      setSelectedSizes([]);
                      setSelectedColors([]);
                    }
                  }}
                  className="data-[state=checked]:bg-indigo-600"
                />
                <Label htmlFor="hasVariantsToggle" className="text-xs text-white cursor-pointer font-bold">
                  Enable Variants
                </Label>
              </div>
            </div>
          </CardHeader>

          {hasVariants && (
            <CardContent className="space-y-6">
              {/* Size Selectors */}
              <div className="space-y-2">
                <Label className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Select Available Sizes</Label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SIZES.map((sz) => {
                    const active = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                          active
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selectors */}
              <div className="space-y-2">
                <Label className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Select Available Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_COLORS.map((clr) => {
                    const active = selectedColors.includes(clr);
                    return (
                      <button
                        key={clr}
                        type="button"
                        onClick={() => toggleColor(clr)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                          active
                            ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {clr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Variants Matrix Table */}
              {form.variants.length > 0 && (
                <div className="space-y-3 border-t border-slate-800 pt-4">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Generated Variants Matrix ({form.variants.length})</span>
                    <span className="text-[11px] text-slate-400">Customize price and stock per variant below</span>
                  </div>
                  <div className="overflow-x-auto select-none">
                    <table className="w-full text-left text-xs min-w-[500px]">
                      <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Variant Option</th>
                          <th className="p-3">SKU</th>
                          <th className="p-3">Price (৳)</th>
                          <th className="p-3">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {form.variants.map((v, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30">
                            <td className="p-3 font-bold text-indigo-300">{v.title}</td>
                            <td className="p-3">
                              <Input
                                value={v.sku}
                                onChange={(e) => updateVariantItem(idx, 'sku', e.target.value)}
                                className="h-7 bg-slate-950 border-slate-800 text-xs font-mono text-white"
                              />
                            </td>
                            <td className="p-3">
                              <Input
                                type="number"
                                value={v.price}
                                onChange={(e) => updateVariantItem(idx, 'price', Number(e.target.value))}
                                className="h-7 bg-slate-950 border-slate-800 text-xs font-bold text-emerald-400"
                              />
                            </td>
                            <td className="p-3">
                              <Input
                                type="number"
                                value={v.stock}
                                onChange={(e) => updateVariantItem(idx, 'stock', Number(e.target.value))}
                                className="h-7 bg-slate-950 border-slate-800 text-xs text-white"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        <div className="flex items-center justify-end space-x-4">
          <Link href={`/dashboard/stores/${params.storeId}/products`}>
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 shadow-lg shadow-blue-600/30"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            Save & Publish Product
          </Button>
        </div>
      </form>
    </div>
  );
}
