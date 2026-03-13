import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface DeletePostDialogProps {
  postTitle: string;
  onConfirm: () => Promise<void>;
}

export function DeletePostDialog({ postTitle, onConfirm }: DeletePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isMatch = inputValue === postTitle;

  const handleDelete = async () => {
    if (!isMatch) return;
    setLoading(true);
    setError("");
    try {
      await onConfirm();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setInputValue("");
      setError("");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <button
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 
            transition-all duration-200 hover:scale-110"
          title="Delete post"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 size={14} />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent
        className="border-red-500/20 bg-[#0f0f1a] text-slate-100"
        style={{ background: "rgba(15, 15, 26, 0.98)", backdropFilter: "blur(20px)" }}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-red-400">
            <Trash2 className="h-5 w-5" />
            <AlertDialogTitle className="text-red-400">Delete Post</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-slate-400">
            This action <span className="text-slate-200 font-medium">cannot be undone</span>. The post will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 py-2">
          <p className="text-sm text-slate-400">
            To confirm, type the post title:{" "}
            <span className="text-slate-100 font-mono font-medium bg-white/5 px-1.5 py-0.5 rounded">
              {postTitle}
            </span>
          </p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type the post title..."
            autoFocus
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 
              placeholder:text-slate-600 text-sm transition-all duration-200
              focus:border-red-500/50"
            style={{ outline: "none" }}
          />
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-transparent border border-white/10 text-slate-300 hover:bg-white/5 hover:text-slate-100"
          >
            Cancel
          </AlertDialogCancel>
          <button
            onClick={handleDelete}
            disabled={!isMatch || loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium
              bg-red-600 text-white transition-all duration-200
              hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            Delete Post
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
