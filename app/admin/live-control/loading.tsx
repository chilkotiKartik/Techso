export default function LiveControlLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-5 w-5 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Broadcast Panel Skeleton */}
            <div className="bg-card rounded-lg p-6 space-y-4">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-muted animate-pulse rounded" />
                <div className="h-10 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-24 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
            </div>

            {/* Users List Skeleton */}
            <div className="bg-card rounded-lg p-6 space-y-4">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                      <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-6 space-y-4">
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                      <div className="h-4 flex-1 bg-muted animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
