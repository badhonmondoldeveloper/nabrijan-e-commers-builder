'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image as ImageIcon, Upload, Trash2, Copy, ExternalLink, Loader2, FileText } from 'lucide-react';

interface MediaItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export default function StoreMediaPage({
  params,
}: {
  params: { storeId: string };
}) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stores/${params.storeId}/media`);
      const data = await res.json();
      if (res.ok && data.media) {
        setMedia(data.media);
      }
    } catch (err) {
      console.error('Failed to load media assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [params.storeId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName || !fileUrl) return alert('Filename and URL required');

    try {
      setSubmitting(true);
      const res = await fetch(`/api/stores/${params.storeId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          fileUrl,
          fileType: 'IMAGE',
          fileSize: 204800,
          mimeType: 'image/jpeg',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFileName('');
        setFileUrl('');
        fetchMedia();
      } else {
        alert(data.message || 'Failed to register media asset');
      }
    } catch (err) {
      alert('Network error uploading media');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMedia = async (mediaId: string) => {
    if (!confirm('Delete this media asset?')) return;
    try {
      const res = await fetch(`/api/stores/${params.storeId}/media?mediaId=${mediaId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== mediaId));
      } else {
        alert(data.message || 'Failed to delete media asset');
      }
    } catch (err) {
      alert('Network error deleting media asset');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Media URL copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Media Library & Asset Manager</h1>
        <p className="text-sm text-slate-400">
          Upload and manage product photos, store banners, and promotional graphics.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Upload Form */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-base flex items-center text-white">
              <Upload className="w-4 h-4 text-blue-400 mr-2" /> Add Media Asset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Asset Title / Name</label>
                <Input
                  placeholder="e.g. Summer Promotion Banner"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Image CDN URL</label>
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                Add Asset to Library
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Media Grid */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center text-white">
              <ImageIcon className="w-4 h-4 text-emerald-400 mr-2" /> Stored Assets ({media.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
              </div>
            ) : media.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <ImageIcon className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-base font-semibold text-white">Media Library Empty</p>
                <p className="text-xs text-slate-400 mt-1">Add promotional banners or logo images to use across your store design.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {media.map((item) => (
                  <div key={item.id} className="group bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col justify-between hover:border-slate-700 transition">
                    <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
                      <img
                        src={item.fileUrl}
                        alt={item.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="p-3 space-y-2">
                      <p className="font-semibold text-xs text-white truncate" title={item.fileName}>
                        {item.fileName}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyUrl(item.fileUrl)}
                          className="text-blue-400 hover:bg-blue-950/40 hover:text-blue-300 h-7 text-[11px] px-2"
                        >
                          <Copy className="w-3 h-3 mr-1" /> Copy URL
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMedia(item.id)}
                          className="text-red-400 hover:bg-red-950/40 hover:text-red-300 h-7 px-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
