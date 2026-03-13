import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { getPosts, type Post } from "@/lib/api";
import { Loader2, FileX, RefreshCw } from "lucide-react";

export function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostDeleted = (title: string) => {
    setPosts((prev) => prev.filter((p) => p.title !== title));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text">Post Feed</h1>
            <p className="text-slate-400 text-sm mt-1">
              Discover what the community is sharing
            </p>
          </div>

          <button
            onClick={fetchPosts}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
              bg-white/5 border border-white/10 text-slate-400 
              hover:text-slate-200 hover:bg-white/10 transition-all duration-200
              disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={32} className="animate-spin text-violet-500" />
              <p className="text-slate-400 text-sm">Loading posts...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <FileX size={28} className="text-red-400" />
            </div>
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={fetchPosts}
              className="px-4 py-2 rounded-lg text-sm bg-violet-600 text-white hover:bg-violet-500 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center">
              <FileX size={28} className="text-violet-400" />
            </div>
            <p className="text-slate-400 text-sm">No posts yet</p>
            <p className="text-slate-500 text-xs">Be the first to share something!</p>
          </motion.div>
        )}

        {/* Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <PostCard
                  key={post.title}
                  post={post}
                  index={index}
                  onDeleted={handlePostDeleted}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
