'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';

export default function CategoryManagerModal({
  storeId,
  existingCategories,
}: {
  storeId: string;
  existingCategories: any[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNameChange = (val: string) => {
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setName(val);
    setSlug(autoSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/stores/${storeId}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, parentId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create category');
      }

      setOpen(false);
      setName('');
      setSlug('');
      setDescription('');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error creating category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-medium">
        <Plus className="w-4 h-4 mr-1.5" /> Add Category
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 text-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Category</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Category Name *</label>
                <Input
                  type="text"
                  placeholder="e.g. Women Fashion"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="bg-slate-950 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Slug *</label>
                <Input
                  type="text"
                  placeholder="women-fashion"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="bg-slate-950 border-slate-800 text-white font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Parent Category (Optional)</label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full h-9 bg-slate-950 border border-slate-800 rounded-md text-xs text-white px-3"
                >
                  <option value="">None (Top-Level Category)</option>
                  {existingCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 border-t border-slate-800 pt-4">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-slate-400">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : 'Save Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
