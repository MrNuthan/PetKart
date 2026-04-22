import React, { useEffect, useState } from "react";
import { Star, Trash2, MessageSquare, Filter, Search } from "lucide-react";
import { motion } from "motion/react";
import { adminService, type AdminReview } from "../services/adminService";

export default function Reviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminService
      .fetchReviews()
      .then(setReviews)
      .catch((err) => console.error("Failed to load reviews", err))
      .finally(() => setLoading(false));
  }, []);

  const deleteReview = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await adminService.deleteReview(id);
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesRating =
      ratingFilter === "All" ||
      (ratingFilter === "5" && r.rating === 5) ||
      (ratingFilter === "4" && r.rating === 4) ||
      (ratingFilter === "3" && r.rating <= 3);
    const matchesSearch =
      search === "" ||
      r.product_name.toLowerCase().includes(search.toLowerCase()) ||
      r.user_name.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Product Reviews</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm px-3 py-2 outline-none"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars & below</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, starI) => (
                      <Star
                        key={starI}
                        className={`w-4 h-4 ${
                          starI < review.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                {review.product_name}
              </h4>
              {review.comment && (
                <p className="text-sm text-slate-600 dark:text-slate-400 italic mb-4">
                  "{review.comment}"
                </p>
              )}

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {review.user_name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-500">
                  {review.user_name}
                </span>
                <span className="text-xs text-slate-400">({review.user_email})</span>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
              No reviews found
            </h3>
            <p className="text-slate-500">
              When customers review products, they will appear here.
            </p>
          </div>
        )}
      </div>

      <div className="text-sm text-slate-400 text-center">
        Showing {filteredReviews.length} of {reviews.length} reviews
      </div>
    </div>
  );
}
