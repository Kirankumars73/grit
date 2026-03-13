import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { createPost } from "@/lib/api";
import {
  Type,
  FileText,
  Globe,
  ArrowRight,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createPost({ title, body, status: published ? "published" : "draft" });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Feed
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Create New Post
          </h1>
          <p className="text-slate-400 text-sm mb-8">
            Share your thoughts with the community
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                <Type size={14} />
                Title
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your post a title..."
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 
                  placeholder:text-slate-600 text-sm transition-all duration-200
                  focus:border-violet-500/50"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                <FileText size={14} />
                Content
              </label>
              <textarea
                id="post-content"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your post content here..."
                required
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 
                  placeholder:text-slate-600 text-sm transition-all duration-200 resize-none
                  focus:border-violet-500/50"
              />
            </div>

            {/* Published Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Publish immediately
                  </p>
                  <p className="text-xs text-slate-500">
                    Make this post visible to everyone
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPublished(!published)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                  published ? "bg-violet-600" : "bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    published ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Submit */}
            <button
              id="post-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 
                text-white font-semibold text-sm transition-all duration-300
                hover:from-violet-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-violet-500/25
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Publish Post
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
