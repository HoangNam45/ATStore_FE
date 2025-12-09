export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-600 dark:text-zinc-400">Đang tải...</p>
        </div>
      </div>
    </div>
  );
}
