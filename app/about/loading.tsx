export default function AboutLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero skeleton */}
      <div className="relative h-[60vh] bg-muted" />

      {/* Timeline section skeleton */}
      <div className="py-16 md:py-24">
        <div className="container">
          <div className="h-8 bg-muted rounded w-48 mx-auto mb-12" />
          <div className="max-w-3xl mx-auto space-y-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-4 h-4 rounded-full bg-muted flex-shrink-0 mt-2" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-muted rounded w-24" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
