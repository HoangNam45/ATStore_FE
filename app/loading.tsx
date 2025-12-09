import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500 mx-auto" />
        <p className="text-zinc-600 dark:text-zinc-400">Đang tải...</p>
      </div>
    </div>
  );
}
