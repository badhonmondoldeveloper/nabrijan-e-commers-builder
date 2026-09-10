'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Tablet, Smartphone, Save, Eye, Palette, Layers, Plus, Trash2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import ThemePresetSelector from '@/components/dashboard/ThemePresetSelector';

export default function VisualThemeBuilderPage({ params }: { params: { storeId: string } }) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [sections, setSections] = useState([
    { id: 'sec_1', sectionType: 'HERO', title: 'Welcome to Our Official Store', subtitle: 'Explore top premium products', isVisible: true },
    { id: 'sec_2', sectionType: 'FEATURED_PRODUCTS', title: 'Featured Products', subtitle: 'Handpicked items for you', isVisible: true },
    { id: 'sec_3', sectionType: 'BENEFITS', title: 'Why Choose Us', subtitle: 'Fast COD delivery across BD', isVisible: true },
  ]);

  const [primaryColor, setPrimaryColor] = useState('#2563eb');

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSections(updated);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const addSection = (type: string) => {
    const newSec = {
      id: `sec_${Date.now()}`,
      sectionType: type,
      title: `New ${type} Section`,
      subtitle: 'Section Description',
      isVisible: true,
    };
    setSections([...sections, newSec]);
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/stores/${params.storeId}/theme/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primaryColor, sections }),
      });

      if (!res.ok) {
        throw new Error('Publish failed');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Error publishing theme changes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center">
            <Palette className="w-5 h-5 mr-2 text-pink-400" /> Visual Theme Customizer
          </h1>
          <p className="text-xs text-slate-400">Live preview with viewport frame toggles</p>
        </div>

        {/* Viewport Frame Selectors */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <Button
            variant={viewport === 'desktop' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewport('desktop')}
            className="h-8 text-xs"
          >
            <Monitor className="w-3.5 h-3.5 mr-1" /> Desktop
          </Button>
          <Button
            variant={viewport === 'tablet' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewport('tablet')}
            className="h-8 text-xs"
          >
            <Tablet className="w-3.5 h-3.5 mr-1" /> Tablet
          </Button>
          <Button
            variant={viewport === 'mobile' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewport('mobile')}
            className="h-8 text-xs"
          >
            <Smartphone className="w-3.5 h-3.5 mr-1" /> Mobile
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <ThemePresetSelector
            onApplyPreset={(preset) => {
              setPrimaryColor(preset.primaryColor);
              setSections(preset.sections);
            }}
          />

          <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white font-medium">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
            {saved ? 'Saved Successfully!' : 'Save Theme Layout'}
          </Button>
        </div>
      </div>

      {/* Editor Split Screen */}
      <div className="grid lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Left Sidebar: Controls & Sections Manager */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 flex flex-col overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Section Hierarchy</span>
              <Button size="sm" variant="outline" onClick={() => addSection('BANNER')} className="text-xs border-slate-800">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Section
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-1">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Primary Brand Accent Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300">{primaryColor}</span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{sec.sectionType}</span>
                    <span className="text-slate-400 text-[11px] line-clamp-1">{sec.title}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => moveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveSection(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => removeSection(idx)} className="p-1 text-red-400 hover:text-red-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Pane: Live Viewport Canvas */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-center overflow-hidden">
          <div
            className={`transition-all duration-300 bg-white text-slate-900 rounded-xl shadow-2xl overflow-y-auto border border-slate-300 ${
              viewport === 'desktop'
                ? 'w-full h-full'
                : viewport === 'tablet'
                ? 'w-[768px] h-[95%]'
                : 'w-[375px] h-[90%]'
            }`}
          >
            {/* Live Render Mock */}
            <div className="p-6 space-y-8">
              {sections.map((sec) => (
                <div
                  key={sec.id}
                  className="p-6 rounded-xl border border-dashed border-slate-300 text-center space-y-2"
                  style={{ borderColor: primaryColor }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    [{sec.sectionType} SECTION]
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900">{sec.title}</h3>
                  <p className="text-xs text-slate-500">{sec.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
