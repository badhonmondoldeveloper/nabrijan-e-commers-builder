'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Server Exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <Card className="max-w-md w-full bg-slate-900 border-slate-800 text-slate-100 shadow-2xl text-center">
        <CardContent className="p-8 space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Application Exception Caught</h2>
            <p className="text-xs text-slate-400">
              {error.message || 'An unexpected error occurred while loading this page.'}
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-slate-500">Error Digest: {error.digest}</p>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => reset()}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Try Again
            </Button>
            <Link href="/">
              <Button variant="outline" className="border-slate-800 bg-slate-950 text-slate-300 text-xs">
                <Home className="w-3.5 h-3.5 mr-1.5" /> Return Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
