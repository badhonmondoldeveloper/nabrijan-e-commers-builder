'use client';

import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  title?: string | null;
  comment: string;
  status: string;
  isVerifiedPurchase: boolean;
  createdAt: Date | string;
}

interface ProductReviewsSectionProps {
  storeSlug: string;
  productId: string;
  reviews: Review[];
}

export default function ProductReviewsSection({
  storeSlug,
  productId,
  reviews,
}: ProductReviewsSectionProps) {
  const approvedReviews = reviews.filter((r) => r.status === 'APPROVED');
  const [openModal, setOpenModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [customerName, setCustomerName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const totalReviews = approvedReviews.length;
  const avgRating = totalReviews > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  approvedReviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, r.rating)) as 1 | 2 | 3 | 4 | 5;
    ratingCounts[star] = (ratingCounts[star] || 0) + 1;
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !comment) return alert('Name and Review details required');

    try {
      setSubmitting(true);
      const res = await fetch(`/api/store/${storeSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          customerName,
          rating,
          title,
          comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback(data.message || 'Review submitted successfully!');
        setCustomerName('');
        setTitle('');
        setComment('');
        setTimeout(() => {
          setOpenModal(false);
          setFeedback(null);
        }, 1500);
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (err) {
      alert('Network error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-8">
      {/* Header & Rating Breakdown */}
      <div className="grid md:grid-cols-3 gap-8 pb-8 border-b border-slate-800 items-center">
        {/* Total Score */}
        <div className="text-center md:text-left space-y-2">
          <h3 className="text-xl font-bold text-white flex items-center justify-center md:justify-start">
            Customer Reviews ({totalReviews})
          </h3>
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <span className="text-5xl font-black text-amber-400">{avgRating}</span>
            <div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(avgRating))
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">Based on {totalReviews} verified ratings</p>
            </div>
          </div>
        </div>

        {/* 5-Star Rating Distribution Bar Chart */}
        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star as 1 | 2 | 3 | 4 | 5] || 0;
            const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : star === 5 ? 100 : 0;

            return (
              <div key={star} className="flex items-center space-x-3 text-xs text-slate-400">
                <span className="w-6 font-semibold flex items-center">
                  {star} <Star className="w-3 h-3 text-amber-400 fill-amber-400 ml-1" />
                </span>
                <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-slate-400">{percent}%</span>
              </div>
            );
          })}
        </div>

        {/* Write Review Trigger Button */}
        <div className="flex flex-col items-center md:items-end justify-center">
          <Button
            onClick={() => setOpenModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-5 rounded-xl shadow-lg"
          >
            <MessageSquarePlus className="w-5 h-5 mr-2" /> Write a Review
          </Button>
        </div>
      </div>

      {/* Review Submission Modal Overlay */}
      {openModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center text-white">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400 mr-2" /> Submit Product Review
              </h3>
              <button
                onClick={() => setOpenModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg font-medium">
                {feedback}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Rating</label>
                <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-amber-400 ml-2">{rating}.0 / 5.0</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name *</label>
                <Input
                  placeholder="e.g. Rahat Ahmed"
                  value={customerName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Review Headline (Optional)</label>
                <Input
                  placeholder="e.g. Excellent quality product!"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Detailed Review *</label>
                <textarea
                  placeholder="Share your experience with this product..."
                  value={comment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-white text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 border-t border-slate-800 pt-3">
                <Button type="button" variant="ghost" onClick={() => setOpenModal(false)} className="text-slate-400">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Submit Review'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Reviews List */}
      <div className="space-y-4">
        {approvedReviews.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm">No reviews yet for this product. Be the first to leave a review!</p>
          </div>
        ) : (
          approvedReviews.map((rev) => (
            <div key={rev.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">{rev.customerName}</span>
                  {rev.isVerifiedPurchase && (
                    <span className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Buyer
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {rev.title && <h4 className="font-semibold text-slate-200 text-xs">{rev.title}</h4>}
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{rev.comment}</p>
              <p className="text-[10px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
