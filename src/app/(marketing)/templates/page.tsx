'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Palette,
  Sparkles,
  Eye,
  CheckCircle2,
  Search,
  Monitor,
  Smartphone,
  X,
  Zap,
  ShoppingBag,
  Star,
} from 'lucide-react';

interface TemplateItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: string;
  isPopular?: boolean;
  image: string;
  description: string;
  features: string[];
  primaryColor: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: 'tmpl-1',
    name: 'AliExpress Flash Merchant',
    slug: 'aliexpress-flash',
    category: 'Fashion & Apparel',
    price: 'FREE',
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    description: 'High-converting red & amber storefront design with built-in Flash Sale countdown timer, stock percentage bar, and sticky mobile cart.',
    features: ['Flash Sale Countdown', 'Sticky Mobile Cart', 'Verified Buyer Reviews', 'COD Single-Page Checkout'],
    primaryColor: '#dc2626',
  },
  {
    id: 'tmpl-2',
    name: 'Bangla Mega Grocery Mart',
    slug: 'bangla-grocery',
    category: 'Groceries & Food',
    price: 'FREE',
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    description: 'Fresh emerald green layout optimized for BD mobile grocery shoppers, fresh farm produce, and quick daily essentials delivery.',
    features: ['Freshness Guarantee Badges', 'Category Quick Filter', 'Express COD Shipping', 'Dhaka & Regional Zones'],
    primaryColor: '#059669',
  },
  {
    id: 'tmpl-3',
    name: 'Tech Nexus Dark Mode',
    slug: 'tech-nexus',
    category: 'Electronics & Tech',
    price: '৳1,500',
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
    description: 'Futuristic dark mode theme tailored for mobile gadgets, computers, and smart accessories with technical specs highlights.',
    features: ['Dark Mode Aesthetic', 'Technical Specs Grid', 'Official Warranty Badge', 'Variant Stock Matrix'],
    primaryColor: '#2563eb',
  },
  {
    id: 'tmpl-4',
    name: 'Minimalist Luxury & Gold',
    slug: 'minimalist-luxury',
    category: 'Luxury & Jewelry',
    price: '৳2,000',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
    description: 'High-end gold accent theme designed for boutique clothing, gold jewelry, and premium luxury accessories.',
    features: ['Luxury Typography', 'Full-bleed Banners', 'Discreet Packaging Badge', 'Concierge Support Info'],
    primaryColor: '#d97706',
  },
  {
    id: 'tmpl-5',
    name: 'Cosmetics & Beauty Bloom',
    slug: 'beauty-bloom',
    category: 'Cosmetics & Beauty',
    price: '৳1,200',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    description: 'Rose-tinted elegant layout designed for skincare products, makeup, and organic beauty cosmetics.',
    features: ['Shade Swatch Selector', 'Ingredient Transparency', 'Dermatologist Verified', 'Before/After Showcase'],
    primaryColor: '#e11d48',
  },
  {
    id: 'tmpl-6',
    name: 'Minimalist COD Speedster',
    slug: 'minimalist-cod',
    category: 'Minimalist COD',
    price: 'FREE',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80',
    description: 'Ultra-fast 99+ PageSpeed score single-page store optimized specifically for 3G/4G Bangladesh mobile networks.',
    features: ['Ultra-fast Loading', '1-Click COD Order', 'Mobile Bottom Bar', 'Zero Latency Forms'],
    primaryColor: '#4f46e5',
  },
];

const CATEGORIES = [
  'All',
  'Fashion & Apparel',
  'Electronics & Tech',
  'Groceries & Food',
  'Cosmetics & Beauty',
  'Luxury & Jewelry',
  'Minimalist COD',
];

export default function TemplatesMarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const filteredTemplates = TEMPLATES.filter((tmpl) => {
    const matchesCategory = selectedCategory === 'All' || tmpl.category === selectedCategory;
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-pink-400" />
            <span className="font-bold text-white text-lg tracking-tight">Nabrijan Theme Gallery</span>
          </div>
          <Link href="/register">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-12 max-w-6xl flex-1 space-y-10">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge
            variant="outline"
            className="border-pink-500/30 text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Dynamic Storefront Theme Engine
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            High-Converting Store Templates
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every theme comes built-in with Cash on Delivery (COD) single-page checkout, mobile sticky buy bar, flash sale countdowns, and verified buyer reviews.
          </p>

          {/* Search Input Bar */}
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-5" />
            <Input
              type="text"
              placeholder="Search themes by name or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border-slate-800 text-white pl-10 text-sm h-11 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                selectedCategory === cat
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {filteredTemplates.map((tmpl) => (
            <Card
              key={tmpl.id}
              className="bg-slate-900 border-slate-800 text-white overflow-hidden flex flex-col justify-between shadow-xl hover:border-slate-700 transition group"
            >
              <div>
                <div className="aspect-video bg-slate-950 relative overflow-hidden">
                  <img
                    src={tmpl.image}
                    alt={tmpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                    {tmpl.isPopular && (
                      <Badge className="bg-pink-600 text-white text-[10px] font-black">POPULAR</Badge>
                    )}
                    <Badge className="bg-blue-600 text-white text-xs font-bold shadow">{tmpl.price}</Badge>
                  </div>
                </div>

                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-white">{tmpl.name}</CardTitle>
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: tmpl.primaryColor }}
                      title={`Primary Accent: ${tmpl.primaryColor}`}
                    />
                  </div>
                  <CardDescription className="text-slate-400 text-xs font-medium">{tmpl.category}</CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">{tmpl.description}</p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {tmpl.features.map((feat) => (
                      <span
                        key={feat}
                        className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-[10px] text-slate-400 rounded font-medium"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </div>

              <div className="p-5 pt-0 flex items-center space-x-2">
                <Button
                  onClick={() => setPreviewTemplate(tmpl)}
                  variant="outline"
                  size="sm"
                  className="w-1/2 border-slate-800 bg-slate-950 text-slate-300 hover:text-white text-xs h-9"
                >
                  <Eye className="w-3.5 h-3.5 mr-1 text-blue-400" /> Preview
                </Button>

                <Link href="/register" className="w-1/2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs h-9 shadow">
                    Use Theme
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Live Interactive Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-white text-base">{previewTemplate.name}</span>
                <Badge className="bg-blue-600 text-white text-xs font-bold">{previewTemplate.price}</Badge>
              </div>

              {/* Device Toggle */}
              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1 rounded text-xs flex items-center transition ${
                    previewDevice === 'desktop'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5 mr-1" /> Desktop
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1 rounded text-xs flex items-center transition ${
                    previewDevice === 'mobile'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 mr-1" /> Mobile
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <Link href="/register">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold">
                    Use This Theme Now
                  </Button>
                </Link>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Canvas Frame */}
            <div className="flex-1 bg-slate-950 p-6 overflow-hidden flex items-center justify-center">
              <div
                className={`transition-all duration-300 bg-white text-slate-900 rounded-xl overflow-y-auto shadow-2xl border border-slate-300 ${
                  previewDevice === 'desktop' ? 'w-full h-full' : 'w-[375px] h-[95%]'
                }`}
              >
                {/* Simulated Storefront Content Header */}
                <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                  <span className="font-extrabold text-lg" style={{ color: previewTemplate.primaryColor }}>
                    {previewTemplate.name}
                  </span>
                  <div className="flex items-center space-x-3 text-xs">
                    <span>Products</span>
                    <span>Reviews</span>
                    <Button size="sm" className="bg-blue-600 text-white text-xs h-7">
                      <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Cart (0)
                    </Button>
                  </div>
                </div>

                {/* Hero Section */}
                <div
                  className="p-8 text-center text-white space-y-4"
                  style={{ backgroundColor: previewTemplate.primaryColor }}
                >
                  <span className="text-xs uppercase tracking-widest font-black bg-black/30 px-3 py-1 rounded-full">
                    Welcome to Official Merchant Store
                  </span>
                  <h2 className="text-2xl font-black">{previewTemplate.name} Official Showcase</h2>
                  <p className="text-xs opacity-90 max-w-md mx-auto">
                    {previewTemplate.description}
                  </p>
                </div>

                {/* Products Grid Mock */}
                <div className="p-6 space-y-6">
                  <h3 className="font-bold text-slate-900 text-base border-b pb-2">Trending Products Collection</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2].map((n) => (
                      <div key={n} className="border rounded-xl p-3 space-y-2 bg-slate-50">
                        <div className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 font-bold">
                          Product Image #{n}
                        </div>
                        <h4 className="font-bold text-xs text-slate-800">Premium Item Showcase #{n}</h4>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-blue-600 text-sm">৳1,450</span>
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">
                            -20% OFF
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
