export default function GalleryLoading() {
  return (
    <div className="min-h-screen pt-12 animate-pulse">
      {/* Photo Gallery Section */}
      <section className="py-12 md:py-20">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="h-5 bg-muted rounded w-32 mx-auto mb-4" />
            <div className="h-10 bg-muted rounded w-80 mx-auto mb-4" />
            <div className="h-4 bg-muted rounded w-96 mx-auto" />
          </div>

          {/* Photo carousel skeleton */}
          <div className="relative overflow-hidden">
            <div className="flex gap-4">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 w-80 aspect-[4/5] bg-muted rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Gallery Section */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="h-5 bg-muted rounded w-32 mx-auto mb-4" />
            <div className="h-10 bg-muted rounded w-72 mx-auto mb-4" />
            <div className="h-4 bg-muted rounded w-80 mx-auto" />
          </div>

          {/* Video grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="aspect-[9/16] bg-muted rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
