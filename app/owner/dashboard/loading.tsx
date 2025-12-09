import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500 mx-auto" />
        <p className="text-zinc-600 dark:text-zinc-400">Đang tải...</p>
      </div>
    </div>
  );
}
