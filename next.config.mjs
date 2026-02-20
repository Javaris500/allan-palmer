/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript and ESLint errors are now enforced at build time
  // Vercel handles standalone output automatically - removed for local dev compatibility
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.mux.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'stream.mux.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    optimizeCss: false,
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
}

export default nextConfig
