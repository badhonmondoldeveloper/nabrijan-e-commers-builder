'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, XCircle, Trash2, MessageSquare, Loader2 } from 'lucide-react';

interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  title?: string | null;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isVerifiedPurchase: boolean;
  createdAt: string;
  product: {
    id: string;
    title: string;
    slug: string;
  };
}

export default function StoreReviewsModerationPage({
  params,
}: {
  params: { storeId: string };
}) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stores/${params.storeId}/reviews`);
      const data = await res.json();
      if (res.ok && data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Failed to load customer reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [params.storeId]);

  const updateStatus = async (reviewId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setActionId(reviewId);
      const res = await fetch(`/api/stores/${params.storeId}/reviews`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, status }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
        );
      } else {
        alert(data.message || 'Failed to update review status');
      }
    } catch (err) {
      alert('Network error updating review status');
    } finally {
      setActionId(null);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      setActionId(reviewId);
      const res = await fetch(`/api/stores/${params.storeId}/reviews?reviewId=${reviewId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      } else {
        alert(data.message || 'Failed to delete review');
      }
    } catch (err) {
      alert('Network error deleting review');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Product Reviews & Ratings</h1>
        <p className="text-sm text-slate-400">
          Moderate customer reviews, approve verified ratings, and build trust on your storefront.
        </p>
      </div>

      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between text-white">
            <span className="flex items-center">
              <MessageSquare className="w-5 h-5 text-blue-400 mr-2" />
              Customer Reviews ({reviews.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
              <p className="text-sm text-slate-400 mt-2">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-base font-semibold text-white">No Customer Reviews Yet</p>
              <p className="text-xs text-slate-400 mt-1">When buyers leave reviews on your product pages, they will appear here for approval.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{rev.customerName}</span>
                        {rev.isVerifiedPurchase && (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                            Verified Purchase
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={
                            rev.status === 'APPROVED'
                              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                              : rev.status === 'REJECTED'
                              ? 'border-red-500/30 text-red-400 bg-red-500/10'
                              : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                          }
                        >
                          {rev.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Product: <span className="text-blue-400 font-medium">{rev.product?.title}</span> • {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-amber-400 ml-1">{rev.rating}.0</span>
                    </div>
                  </div>

                  {rev.title && <h4 className="text-sm font-bold text-slate-200">{rev.title}</h4>}
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded border border-slate-800/80">
                    "{rev.comment}"
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-900">
                    {rev.status !== 'APPROVED' && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(rev.id, 'APPROVED')}
                        disabled={actionId === rev.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                    )}
                    {rev.status !== 'REJECTED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(rev.id, 'REJECTED')}
                        disabled={actionId === rev.id}
                        className="border-slate-700 text-amber-400 hover:bg-slate-800 h-8 text-xs"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteReview(rev.id)}
                      disabled={actionId === rev.id}
                      className="text-red-400 hover:bg-red-950/40 hover:text-red-300 h-8 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
