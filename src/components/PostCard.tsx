import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, User, MessageCircle, Rss } from "lucide-react";
import { DeletePostDialog } from "@/components/DeletePostDialog";
import { CommentsPanel } from "@/components/CommentsPanel";
import { deletePost } from "@/lib/api";
import type { Post } from "@/lib/api";

interface PostCardProps {
  post: Post;
  index: number;
  postId?: string;
  onDeleted?: (title: string) => void;
}

export function PostCard({ post, index, postId, onDeleted }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    Math.floor(Math.random() * 20) + 1
  );
  const [commentsOpen, setCommentsOpen] = useState(false);

  const handleLike = () => {
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    setLiked(!liked);
  };

  const handleDelete = async () => {
    if (postId) {
      await deletePost(postId);
    }
    onDeleted?.(post.title);
  };

  const isPublished = post.status === "published";

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="glass-card p-6 flex flex-col gap-4 group"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-100 line-clamp-2 group-hover:text-violet-300 transition-colors">
              {post.title}
            </h3>
          </div>
          {isPublished && (
            <span className="shrink-0 flex items-center gap-1 px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <Rss size={10} />
              Live
            </span>
          )}
        </div>

        {/* Content */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-4 flex-1">
          {post.body}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          {/* Author */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <User size={12} />
            <span className="max-w-32 truncate">
              {post.author || "Anonymous"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Comment button */}
            <button
              onClick={() => setCommentsOpen(true)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-400 transition-all duration-200 hover:scale-110"
              title="View comments"
            >
              <MessageCircle size={14} />
            </button>

            {/* Like button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs transition-all duration-200 hover:scale-110 ${
                liked ? "text-rose-400" : "text-slate-500 hover:text-rose-400"
              }`}
            >
              <Heart
                size={14}
                fill={liked ? "currentColor" : "none"}
                className={liked ? "scale-110" : ""}
              />
              <span>{likeCount}</span>
            </button>

            {/* Delete */}
            <DeletePostDialog
              postTitle={post.title}
              onConfirm={handleDelete}
            />
          </div>
        </div>
      </motion.article>

      {/* Comments slide-in panel */}
      <CommentsPanel
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        postTitle={post.title}
      />
    </>
  );
}
