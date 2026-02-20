export default function ContactLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      <section className="py-16 md:py-24">
        <div className="container">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left: Contact Form Skeleton */}
            <div className="lg:col-span-3">
              <div className="rounded-xl border border-muted p-6 md:p-8">
                <div className="h-8 bg-muted rounded w-48 mb-2" />
                <div className="h-4 bg-muted rounded w-64 mb-8" />

                {/* Form fields skeleton */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 bg-muted rounded w-16 mb-2" />
                      <div className="h-10 bg-muted rounded w-full" />
                    </div>
                    <div>
                      <div className="h-4 bg-muted rounded w-16 mb-2" />
                      <div className="h-10 bg-muted rounded w-full" />
                    </div>
                  </div>
                  <div>
                    <div className="h-4 bg-muted rounded w-20 mb-2" />
                    <div className="h-10 bg-muted rounded w-full" />
                  </div>
                  <div>
                    <div className="h-4 bg-muted rounded w-24 mb-2" />
                    <div className="h-32 bg-muted rounded w-full" />
                  </div>
                  <div className="h-12 bg-muted rounded w-full" />
                </div>
              </div>
            </div>

            {/* Right: Info Cards Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl border border-muted p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-5 bg-muted rounded w-24 mb-2" />
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-3/4 mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
