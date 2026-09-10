'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Check, Sparkles, X, Eye } from 'lucide-react';

export interface ThemePreset {
  id: string;
  name: string;
  category: string;
  primaryColor: string;
  description: string;
  price: string;
  isPopular?: boolean;
  sections: {
    id: string;
    sectionType: string;
    title: string;
    subtitle: string;
    isVisible: boolean;
  }[];
}

export const OFFICIAL_THEME_PRESETS: ThemePreset[] = [
  {
    id: 'preset-aliexpress-flash',
    name: 'AliExpress Flash Merchant',
    category: 'High-Converting E-Commerce',
    primaryColor: '#dc2626',
    price: 'FREE',
    isPopular: true,
    description: 'Red & amber high-converting design with Flash Sale countdown timer, discount badges, and sticky mobile cart.',
    sections: [
      { id: 'sec_1', sectionType: 'HERO', title: '🔥 Mega Flash Deals Up to 60% OFF', subtitle: 'Order Cash on Delivery before timer expires', isVisible: true },
      { id: 'sec_2', sectionType: 'FLASH_SALE', title: 'Limited Time Flash Sale', subtitle: 'Huge savings on top trending products', isVisible: true },
      { id: 'sec_3', sectionType: 'FEATURED_PRODUCTS', title: 'Hot Deals Collection', subtitle: 'Handpicked products with fast BD shipping', isVisible: true },
      { id: 'sec_4', sectionType: 'BENEFITS', title: 'Why BD Buyers Choose Us', subtitle: 'Fast COD Delivery • 100% Original Products', isVisible: true },
    ],
  },
  {
    id: 'preset-bangla-grocery',
    name: 'Bangla Mega Grocery',
    category: 'Groceries & Fresh Produce',
    primaryColor: '#059669',
    price: 'FREE',
    description: 'Fresh emerald green theme optimized for daily groceries, supermarts, and organic farm produce.',
    sections: [
      { id: 'sec_1', sectionType: 'HERO', title: '🥬 Fresh Groceries Delivered to Your Door', subtitle: 'Pure, organic, and daily essential products in Bangladesh', isVisible: true },
      { id: 'sec_2', sectionType: 'FEATURED_PRODUCTS', title: 'Fresh Produce & Pantry Items', subtitle: 'Same day Cash on Delivery in Dhaka & Chittagong', isVisible: true },
      { id: 'sec_3', sectionType: 'BENEFITS', title: 'Freshness Guaranteed', subtitle: 'Organic Quality Check • Express 24h Delivery', isVisible: true },
    ],
  },
  {
    id: 'preset-tech-nexus',
    name: 'Tech Nexus Dark',
    category: 'Electronics & Gadgets',
    primaryColor: '#2563eb',
    price: 'PREMIUM',
    isPopular: true,
    description: 'Futuristic dark mode theme tailored for smartphones, audio accessories, and tech gadgets.',
    sections: [
      { id: 'sec_1', sectionType: 'HERO', title: '⚡ Next-Gen Tech & Accessories', subtitle: 'Upgrade your digital lifestyle with genuine tech gear', isVisible: true },
      { id: 'sec_2', sectionType: 'FEATURED_PRODUCTS', title: 'Featured Electronics & Gadgets', subtitle: 'Official brand warranty included on all items', isVisible: true },
      { id: 'sec_3', sectionType: 'BENEFITS', title: 'Tech Support & Warranty', subtitle: 'Official Brand Warranty • 7 Days Replacement', isVisible: true },
    ],
  },
  {
    id: 'preset-minimalist-luxury',
    name: 'Minimalist Luxury & Gold',
    category: 'Fashion & Jewelry',
    primaryColor: '#d97706',
    price: 'PREMIUM',
    description: 'Elegant amber/gold luxury theme for boutique clothing, watches, and designer products.',
    sections: [
      { id: 'sec_1', sectionType: 'HERO', title: '✨ Timeless Elegance & Craftsmanship', subtitle: 'Discover bespoke fashion collections crafted for perfection', isVisible: true },
      { id: 'sec_2', sectionType: 'FEATURED_PRODUCTS', title: 'Curated Luxury Collection', subtitle: 'Limited stock designer apparel and accessories', isVisible: true },
      { id: 'sec_3', sectionType: 'BENEFITS', title: 'Premium Experience', subtitle: 'Discreet Packaging • Dedicated Concierge Support', isVisible: true },
    ],
  },
];

interface ThemePresetSelectorProps {
  onApplyPreset: (preset: ThemePreset) => void;
}

export default function ThemePresetSelector({ onApplyPreset }: ThemePresetSelectorProps) {
  const [open, setOpen] = useState(false);
  const [previewPreset, setPreviewPreset] = useState<ThemePreset | null>(null);

  const handleSelect = (preset: ThemePreset) => {
    onApplyPreset(preset);
    setOpen(false);
    setPreviewPreset(null);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="border-slate-800 bg-slate-950 text-pink-400 hover:text-white hover:bg-slate-900 text-xs font-semibold"
      >
        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-pink-400" /> Apply Theme Preset
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-4xl w-full p-6 space-y-6 max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center">
                  <Palette className="w-5 h-5 text-pink-400 mr-2" /> Official Theme Layout Presets
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a pre-configured theme layout to instantly transform your storefront design.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid md:grid-cols-2 gap-4 overflow-y-auto pr-1">
              {OFFICIAL_THEME_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: preset.primaryColor }}
                        />
                        <span className="font-bold text-white text-base">{preset.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {preset.isPopular && (
                          <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 text-[10px]">
                            POPULAR
                          </Badge>
                        )}
                        <Badge className="bg-blue-600 text-white text-[10px] font-bold">
                          {preset.price}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{preset.description}</p>
                    <span className="text-[11px] font-medium text-slate-500 block">
                      Category: {preset.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 pt-3 border-t border-slate-900">
                    <Button
                      onClick={() => handleSelect(preset)}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs h-9"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Apply This Preset
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
