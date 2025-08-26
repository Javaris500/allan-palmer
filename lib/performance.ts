import React from "react"
// Performance optimization utilities
export const preloadCriticalResources = () => {
  if (typeof window === "undefined") return

  // Preload critical fonts
  const fontPreloads = ["/fonts/inter-var.woff2", "/fonts/playfair-display-var.woff2"]

  fontPreloads.forEach((font) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.href = font
    link.as = "font"
    link.type = "font/woff2"
    link.crossOrigin = "anonymous"
    document.head.appendChild(link)
  })
}

// Lazy load non-critical components
export const lazyLoadComponent = (importFn: () => Promise<any>) => {
  return React.lazy(() =>
    importFn().then((module) => ({
      default: module.default || module,
    })),
  )
}

// Optimize images for different screen sizes
export const getOptimizedImageProps = (src: string, alt: string, priority = false) => ({
  src,
  alt,
  priority,
  quality: priority ? 90 : 75,
  placeholder: "blur" as const,
  blurDataURL:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==",
})

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
