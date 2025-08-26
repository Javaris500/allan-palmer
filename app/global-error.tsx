"use client"

// This is to explicitly handle global errors in production
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background text-foreground">
          <h1 className="text-4xl font-bold mb-6">Something went wrong</h1>
          <p className="mb-8 max-w-md text-muted-foreground">
            We apologize for the inconvenience. Please try refreshing the page or contact us if the problem persists.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
