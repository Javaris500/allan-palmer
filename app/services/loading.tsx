export default function ServicesLoading() {
  return (
    <div className="min-h-screen pt-16 animate-pulse">
      <section className="py-16 md:py-24">
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="h-5 bg-muted rounded w-40 mx-auto mb-4" />
            <div className="h-10 bg-muted rounded w-72 mx-auto mb-4" />
            <div className="h-4 bg-muted rounded w-96 mx-auto" />
          </div>

          {/* Comparison Table Skeleton */}
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl border border-muted overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-4 border-b border-muted bg-muted/30 p-4">
                <div className="h-6 bg-muted rounded w-20" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-muted rounded-full" />
                    <div className="h-4 bg-muted rounded w-24" />
                  </div>
                ))}
              </div>

              {/* Table Rows */}
              {[...Array(10)].map((_, i) => (
                <div key={i} className="grid grid-cols-4 p-4 border-b border-muted/50">
                  <div className="h-4 bg-muted rounded w-32" />
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex justify-center">
                      <div className="w-6 h-6 bg-muted rounded-full" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Highlight Cards Skeleton */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 rounded-xl border border-muted">
                <div className="w-10 h-10 bg-muted rounded-full mb-4" />
                <div className="h-5 bg-muted rounded w-32 mb-2" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
