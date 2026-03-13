import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Send, Loader2, User } from "lucide-react";
import { getCommentsByPost, createComment, type Comment } from "@/lib/api";

interface CommentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle: string;
}

export function CommentsPanel({ isOpen, onClose, postTitle }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError("");
    getCommentsByPost(postTitle)
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [isOpen, postTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await createComment(postTitle, newComment.trim());
      setNewComment("");
      // Re-fetch comments
      const updated = await getCommentsByPost(postTitle);
      setComments(Array.isArray(updated) ? updated : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Slide-in panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col"
            style={{
              background: "rgba(12, 12, 20, 0.97)",
              backdropFilter: "blur(20px)",
              borderLeft: "1px solid rgba(139, 92, 246, 0.12)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-violet-400" />
                <h2 className="font-semibold text-slate-100 text-sm">Comments</h2>
                <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                  {comments.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Post title ref */}
            <div className="px-6 py-3 border-b border-white/5">
              <p className="text-xs text-slate-500 truncate">
                Commenting on:{" "}
                <span className="text-slate-300 font-medium">{postTitle}</span>
              </p>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={22} className="animate-spin text-violet-500" />
                </div>
              )}

              {!loading && comments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <MessageCircle size={32} className="text-slate-700" />
                  <p className="text-slate-500 text-sm">No comments yet</p>
                  <p className="text-slate-600 text-xs">Be the first to comment!</p>
                </div>
              )}

              {!loading &&
                comments.map((comment, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center shrink-0 border border-violet-500/20 mt-0.5">
                      <User size={12} className="text-violet-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 mb-1">
                        {comment.author || "Anonymous"}
                      </p>
                      <div className="bg-white/5 rounded-xl rounded-tl-none px-4 py-2.5">
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Comment input */}
            <div className="px-6 py-4 border-t border-white/5">
              {error && (
                <p className="text-xs text-red-400 mb-2">{error}</p>
              )}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 
                    placeholder:text-slate-600 text-sm transition-all duration-200
                    focus:border-violet-500/50 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium
                    hover:bg-violet-500 transition-all duration-200 disabled:opacity-50
                    disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
