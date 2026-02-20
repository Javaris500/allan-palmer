export default function RepertoireLoading() {
  return (
    <div className="min-h-screen pt-12 animate-pulse">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="text-center mb-10">
            <div className="h-5 bg-muted rounded w-36 mx-auto mb-4" />
            <div className="h-10 bg-muted rounded w-64 mx-auto mb-4" />
            <div className="h-4 bg-muted rounded w-80 mx-auto" />
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-muted rounded w-16 mx-auto mb-1" />
                <div className="h-4 bg-muted rounded w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Song Catalog Section */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container">
          {/* Search and filters skeleton */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="h-10 bg-muted rounded flex-1" />
            <div className="h-10 bg-muted rounded w-40" />
            <div className="h-10 bg-muted rounded w-40" />
          </div>

          {/* Category tabs skeleton */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-9 bg-muted rounded-full w-24 flex-shrink-0" />
            ))}
          </div>

          {/* Song list skeleton */}
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 p-4 rounded-lg border border-muted"
              >
                <div className="w-10 h-10 bg-muted rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-48" />
                  <div className="h-4 bg-muted rounded w-32" />
                </div>
                <div className="h-4 bg-muted rounded w-16" />
                <div className="h-8 bg-muted rounded w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
