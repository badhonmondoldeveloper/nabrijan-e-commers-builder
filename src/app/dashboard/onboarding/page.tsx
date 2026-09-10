'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, CheckCircle2, Globe, Palette, ShoppingBag, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Fashion & Clothing',
  'Electronics & Gadgets',
  'Beauty & Personal Care',
  'Home & Kitchen',
  'Groceries & Food',
  'Health & Wellness',
  'Jewelry & Accessories',
  'Books & Stationery',
  'Sports & Fitness',
  'General Retail',
];

export default function StoreOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Fashion & Clothing',
    phone: '',
    currency: 'BDT',
    address: 'Dhaka, Bangladesh',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNameChange = (val: string) => {
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setFormData((prev) => ({ ...prev, name: val, slug: autoSlug }));
  };

  const calculateProgress = () => Math.round((step / totalSteps) * 100);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/stores/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Store setup failed');
      }

      router.push(`/dashboard/stores/${data.store.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-xl">
        {/* Progress Header */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Step {step} of {totalSteps}</span>
            <span className="text-blue-400 font-semibold">{calculateProgress()}% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300 ease-out"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                <Sparkles className="w-3 h-3 mr-1" /> Quick Setup
              </Badge>
            </div>
            {step === 1 && (
              <>
                <CardTitle className="text-2xl font-bold">What is your Store Name?</CardTitle>
                <CardDescription className="text-slate-400">
                  This will be your brand identity and public storefront address.
                </CardDescription>
              </>
            )}
            {step === 2 && (
              <>
                <CardTitle className="text-2xl font-bold">Select Business Industry</CardTitle>
                <CardDescription className="text-slate-400">
                  Choose the category that best matches the products you plan to sell.
                </CardDescription>
              </>
            )}
            {step === 3 && (
              <>
                <CardTitle className="text-2xl font-bold">Store Contact & Location</CardTitle>
                <CardDescription className="text-slate-400">
                  Used for order invoices and Bangladesh Cash on Delivery (COD) shipping configuration.
                </CardDescription>
              </>
            )}
            {step === 4 && (
              <>
                <CardTitle className="text-2xl font-bold">Review & Launch Store</CardTitle>
                <CardDescription className="text-slate-400">
                  We'll automatically configure your Cash on Delivery engine, shipping rates, and theme.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-md">
                {error}
              </div>
            )}

            {/* STEP 1: Name & Slug */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Store Name</label>
                  <Input
                    type="text"
                    placeholder="e.g. Nabrijan Fashion & Style"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Store Web Address (Slug)</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 font-mono">http://localhost:3000/store/</span>
                    <Input
                      type="text"
                      placeholder="nabrijan-fashion"
                      value={formData.slug}
                      onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                      className="bg-slate-950 border-slate-800 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Category */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, category: cat }))}
                    className={`p-3 rounded-lg border text-left text-xs font-medium transition ${
                      formData.category === cat
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* STEP 3: Contact & Location */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Contact Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="01712345678"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className="bg-slate-950 border-slate-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Business Address</label>
                  <Input
                    type="text"
                    placeholder="House 12, Road 5, Mirpur, Dhaka"
                    value={formData.address}
                    onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                    className="bg-slate-950 border-slate-800 text-white"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Summary */}
            {step === 4 && (
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Store Name:</span>
                  <span className="font-semibold text-white">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Store Slug:</span>
                  <span className="font-mono text-blue-400">/store/{formData.slug}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Industry:</span>
                  <span className="text-white">{formData.category}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Payment Gateway:</span>
                  <span className="text-emerald-400 font-medium flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Cash On Delivery (COD Active)
                  </span>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-slate-800/80 pt-4">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                className="border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                onClick={() => {
                  if (step === 1 && (!formData.name || !formData.slug)) {
                    setError('Please enter store name and slug');
                    return;
                  }
                  setError('');
                  setStep((s) => s + 1);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                Continue <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-600/30"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : '🚀 Launch My Store'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
