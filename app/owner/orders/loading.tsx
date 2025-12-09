import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="h-9 w-64 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-2" />
          <div className="h-5 w-96 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>

        {/* Statistics skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-7 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters skeleton */}
        <Card className="mb-6">
          <CardHeader>
            <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 h-10 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Orders skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="bg-zinc-100 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="h-20 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 w-64 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-56 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
