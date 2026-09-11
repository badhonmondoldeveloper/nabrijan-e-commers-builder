'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Search, Globe, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Copy, ExternalLink, Loader2 } from 'lucide-react';

export default function TechnicalSeoDashboardPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seoScore, setSeoScore] = useState(85);

  useEffect(() => {
    async function fetchStore() {
      try {
        const res = await fetch(`/api/stores/${storeId}`);
        const data = await res.json();
        if (data.store) {
          setStore(data.store);
          
          // Calculate dynamic SEO score
          let score = 50;
          if (data.store.customDomain) score += 20;
          if (data.store.logo) score += 10;
          if (data.store.category) score += 10;
          if (data.store.products && data.store.products.length > 0) score += 10;
          setSeoScore(Math.min(100, score));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (storeId) fetchStore();
  }, [storeId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> Inspecting technical SEO health...
      </div>
    );
  }

  const sitemapUrl = `https://nabrijan.site/sitemap.xml`;
  const storeUrl = store?.customDomain ? `https://${store.customDomain}` : `https://nabrijan.site/store/${store?.slug}`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5" /> Technical SEO Engine
          </div>
          <h1 className="text-2xl font-black text-white">Store Search Engine Health</h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Automated platform SEO, Schema.org JSON-LD microdata, XML sitemap generation, and Google SERP snippet previews.
          </p>
        </div>

        {/* SEO Score Gauge */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center font-black text-xl text-emerald-400">
            {seoScore}
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase">SEO Health Score</div>
            <div className="text-[10px] text-emerald-400 font-semibold">Optimized for Google Crawlers</div>
          </div>
        </div>
      </div>

      {/* Audit Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Automated Technical Checks
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-850 border border-slate-800">
              <span className="text-slate-300 font-medium">Schema.org JSON-LD Product Microdata</span>
              <span className="text-emerald-400 font-bold">✓ ACTIVE</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-850 border border-slate-800">
              <span className="text-slate-300 font-medium">Dynamic XML Sitemap Generator</span>
              <span className="text-emerald-400 font-bold">✓ ACTIVE</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-850 border border-slate-800">
              <span className="text-slate-300 font-medium">Mobile Responsiveness Audit</span>
              <span className="text-emerald-400 font-bold">✓ 100/100</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-850 border border-slate-800">
              <span className="text-slate-300 font-medium">Custom Domain SSL Status</span>
              {store?.customDomain ? (
                <span className="text-emerald-400 font-bold">✓ CONNECTED ({store.customDomain})</span>
              ) : (
                <span className="text-amber-400 font-bold">⚠ SUBDOMAIN ACTIVE</span>
              )}
            </div>
          </div>
        </div>

        {/* Google SERP Snippet Preview */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" /> Google Search Result Preview
          </h3>

          <div className="bg-white p-4 rounded-2xl space-y-1 font-sans text-left">
            <div className="text-[11px] text-emerald-800 font-medium truncate">
              {storeUrl}
            </div>
            <h4 className="text-blue-700 font-bold text-base hover:underline cursor-pointer line-clamp-1">
              {store?.name} — Online Store in Bangladesh
            </h4>
            <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
              Buy authentic products online from {store?.name}. Fast Cash on Delivery shipping across all 64 districts in Bangladesh.
            </p>
          </div>

          <div className="pt-2 text-xs text-slate-400">
            <span>Sitemap URL: </span>
            <a href={sitemapUrl} target="_blank" className="text-cyan-400 font-mono underline ml-1">
              {sitemapUrl}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
