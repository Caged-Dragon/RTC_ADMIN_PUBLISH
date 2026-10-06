import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  ShieldCheck,
  Send,
  Sparkles,
  Package,
  MapPin,
  Calendar,
  Filter,
  User,
  HeartHandshake,
  Check,
  Award,
  Truck
} from 'lucide-react';
import { PlacedOrder } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { dbSelect, rpc } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface CustomerReview {
  id: string;
  customerName: string;
  city: string;
  rating: number;
  date: string;
  orderId?: string;
  comment: string;
  tags: string[];
  helpfulCount: number;
  verifiedBuyer: boolean;
  recommended: boolean;
}

interface CustomerReviewsFeedbackProps {
  orders?: PlacedOrder[];
  prefilledOrderId?: string;
  onFeedbackSubmitted?: () => void;
}

export const CustomerReviewsFeedback: React.FC<CustomerReviewsFeedbackProps> = ({
  orders = [],
  prefilledOrderId = '',
  onFeedbackSubmitted,
}) => {
  const { storeInfo: STORE_INFO } = useStore();
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const { session, isAuthenticated } = useAuth();

  useEffect(() => {
    dbSelect<any>('reviews', 'select=*&order=created_at.desc').then(rows => setReviews(rows.map(r => ({
      id:r.id, customerName:r.customer_name, city:r.city || '', rating:r.rating, date:new Date(r.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}), orderId:undefined, comment:r.comment_text || '', tags:r.experience_tags || [], helpfulCount:r.helpful_upvotes_count || 0, verifiedBuyer:!!r.is_verified_buyer, recommended:r.rating >= 4
    })))).catch(err => console.error('Reviews load failed', err));
  }, []);

  // Filter state
  const [ratingFilter, setRatingFilter] = useState<number | 'ALL'>('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});

  // Form inputs
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('Chennai');
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formOrderId, setFormOrderId] = useState(prefilledOrderId || (orders[0]?.orderId || ''));
  const [formComment, setFormComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Safe Packaging', 'Gift Boxes']);
  const [formRecommended, setFormRecommended] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);


  useEffect(() => {
    if (prefilledOrderId) {
      setFormOrderId(prefilledOrderId);
      setIsFormOpen(true);
    }
  }, [prefilledOrderId]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleHelpfulClick = (id: string) => {
    if (votedReviews[id]) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    setVotedReviews((prev) => ({ ...prev, [id]: true }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !session?.access_token) { alert('Please sign in before submitting a review.'); return; }
    const selected = orders.find(o => o.orderId === formOrderId);
    if (!selected?.dbId) { alert('Select one of your completed orders.'); return; }
    if (!formComment.trim()) { alert('Please enter your review comments.'); return; }
    try {
      const saved:any = await rpc('submit_customer_review',{p_order_id:selected.dbId,p_rating:formRating,p_comment:formComment.trim(),p_tags:selectedTags},session.access_token);
      const r=saved;
      setReviews(prev=>[{id:r.id,customerName:r.customer_name,city:r.city||'',rating:r.rating,date:new Date(r.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),comment:r.comment_text||'',tags:r.experience_tags||[],helpfulCount:r.helpful_upvotes_count||0,verifiedBuyer:true,recommended:r.rating>=4},...prev.filter(x=>x.id!==r.id)]);
      setSubmitSuccess(true); setFormComment('');
      setTimeout(()=>{setSubmitSuccess(false);setIsFormOpen(false);},2500);
      onFeedbackSubmitted?.();
    } catch(err:any){ alert(err.message || 'Unable to submit review.'); }
  };

  // Calculations
  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  const fiveStarPercent = Math.round(
    (reviews.filter((r) => r.rating === 5).length / (reviews.length || 1)) * 100
  );

  const filteredReviews = reviews.filter((r) => {
    if (ratingFilter === 'ALL') return true;
    return r.rating === ratingFilter;
  });

  const availableTags = [
    'Gift Boxes',
    'Safe Packaging',
    'Lorry Despatch',
    'Sparkler Quality',
    'Aerial Shots',
    'Sound Bombs',
    'Customer Support',
    'Wholesale Price',
  ];

  return (
    <div className="space-y-6 text-stone-100">
      
      {/* Testimonials & Reviews Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900/90 to-amber-950/40 border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Buyer Feedback</span>
              </span>
              <span className="text-xs text-stone-400 font-semibold">• 2026 Diwali Season</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white dark:text-white light:text-stone-900 tracking-tight">
              Customer Reviews & Order Testimonials
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 dark:text-stone-300 light:text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Read authentic feedback from families and wholesale buyers across India who booked their crackers directly from our Sivakasi godown.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isFormOpen ? 'Close Feedback Form' : 'Leave Order Feedback & Review'}</span>
          </button>
        </div>

        {/* Rating Metrics & Trust Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-800 dark:border-stone-800 light:border-stone-200">
          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 flex items-center gap-4">
            <div className="font-display text-4xl font-black text-amber-400 tabular-nums">
              {averageRating}
            </div>
            <div>
              <div className="flex items-center text-amber-400 gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-stone-400 font-semibold mt-1 block">
                {reviews.length} Verified Reviews
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 space-y-1">
            <span className="text-[11px] font-bold uppercase text-stone-400 block">5-Star Satisfaction</span>
            <div className="font-display text-xl font-bold text-emerald-400">
              {fiveStarPercent}% Positive
            </div>
            <span className="text-[11px] text-stone-400">Family & bulk buyers recommend</span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 space-y-1">
            <span className="text-[11px] font-bold uppercase text-stone-400 block">Packaging Standard</span>
            <div className="font-display text-xl font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Waterproof Gunny</span>
            </div>
            <span className="text-[11px] text-stone-400">Inspected for lorry transit</span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 space-y-1">
            <span className="text-[11px] font-bold uppercase text-stone-400 block">Sivakasi Despatch</span>
            <div className="font-display text-xl font-bold text-amber-400 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Direct Godown</span>
            </div>
            <span className="text-[11px] text-stone-400">KPN, ARC, ABT, VRL hubs</span>
          </div>
        </div>
      </div>

      {/* LEAVE FEEDBACK FORM MODAL / COLLAPSIBLE */}
      {isFormOpen && (
        <div className="p-6 sm:p-7 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-2xl space-y-5 animate-in fade-in duration-300">
          <div className="flex justify-between items-start border-b border-stone-800 pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Share Your RedThunder Crackers Order Experience</span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Help other families and buyers learn about product quality, sparkler brightness, and lorry parcel delivery.
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          {submitSuccess ? (
            <div className="p-6 text-center rounded-2xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="font-display text-lg font-bold text-white">Thank You for Your Review!</div>
              <p className="text-xs text-emerald-300 max-w-md mx-auto">
                Your testimonial has been verified and posted to the community feedback board. Wishing you a sparkling and safe Diwali!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              
              {/* Star Rating Picker */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <label className="block text-stone-300 font-bold">
                  How would you rate your crackers and ordering experience? <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || formRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="font-bold text-amber-400 text-sm ml-2">
                    {formRating === 5
                      ? '5/5 - Exceptional Fireworks!'
                      : formRating === 4
                      ? '4/5 - Very Good Quality'
                      : formRating === 3
                      ? '3/5 - Average Experience'
                      : 'Needs Improvement'}
                  </span>
                </div>
              </div>

              {/* Name, City & Order ID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Your Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Meenakshi Sundaram"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Your City / Destination <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chennai, Bangalore, Madurai"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Order ID (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RT-2026-1088"
                    value={formOrderId}
                    onChange={(e) => setFormOrderId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono"
                  />
                </div>
              </div>

              {/* Experience Highlights / Tags */}
              <div>
                <label className="block text-stone-300 font-bold mb-1.5">
                  Select aspects you liked (Click to toggle):
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-amber-600 text-white shadow'
                          : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-white'
                      }`}
                    >
                      {selectedTags.includes(tag) ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments Textarea */}
              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  Your Detailed Review & Comments <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details about the packaging condition, effect of sparklers or gift boxes, lorry parcel office pickup, etc..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  required
                />
              </div>

              {/* Recommendation Check */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-300 font-semibold">
                  Would you recommend RedThunder Crackers to friends and family for Diwali?
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormRecommended(true)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                      formRecommended ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    Yes, Definitely!
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormRecommended(false)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                      !formRecommended ? 'bg-red-600 text-white' : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold cursor-pointer shadow-lg active:scale-95 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Verified Review</span>
                </button>
              </div>

            </form>
          )}
        </div>
      )}

      {/* Filter Reviews Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-stone-400 font-bold mr-1">Filter Reviews:</span>
          <button
            onClick={() => setRatingFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
              ratingFilter === 'ALL'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setRatingFilter(5)}
            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer flex items-center gap-1 ${
              ratingFilter === 5
                ? 'bg-amber-600 text-white'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            <span>5 Stars</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>({reviews.filter((r) => r.rating === 5).length})</span>
          </button>
          <button
            onClick={() => setRatingFilter(4)}
            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer flex items-center gap-1 ${
              ratingFilter === 4
                ? 'bg-amber-600 text-white'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            <span>4 Stars</span>
            <span>({reviews.filter((r) => r.rating === 4).length})</span>
          </button>
        </div>

        <span className="text-stone-500 text-[11px]">
          Showing {filteredReviews.length} verified customer reviews
        </span>
      </div>

      {/* Reviews Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 sm:p-6 rounded-2xl bg-stone-900/90 dark:bg-stone-900/90 light:bg-white border border-stone-800 dark:border-stone-800 light:border-stone-200 shadow-md flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Reviewer Header */}
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white dark:text-white light:text-stone-900 text-sm">
                      {rev.customerName}
                    </span>
                    {rev.verifiedBuyer && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-stone-400 text-xs mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      {rev.city}
                    </span>
                    <span className="text-stone-600">•</span>
                    <span>{rev.date}</span>
                    {rev.orderId && (
                      <>
                        <span className="text-stone-600">•</span>
                        <span className="font-mono text-amber-400 font-semibold">#{rev.orderId}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 text-amber-400 bg-stone-950 px-2 py-1 rounded-lg border border-stone-800">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Review Body */}
              <p className="text-xs text-stone-300 dark:text-stone-300 light:text-stone-700 leading-relaxed">
                &ldquo;{rev.comment}&rdquo;
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {rev.tags.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-stone-950 text-stone-400 border border-stone-800 text-[10px] font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Helpful Counter & Recommendation */}
            <div className="pt-3 border-t border-stone-800 dark:border-stone-800 light:border-stone-200 flex items-center justify-between text-xs text-stone-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Recommends RedThunder</span>
              </span>

              <button
                onClick={() => handleHelpfulClick(rev.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
                  votedReviews[rev.id]
                    ? 'bg-amber-600/20 text-amber-300 border-amber-500'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
