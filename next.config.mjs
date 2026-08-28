const noIndexHeaders = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc', pathname: '/**' },
    ],
  },
  async headers() {
    return [
      { source: '/auth', headers: noIndexHeaders },
      { source: '/auth/:path*', headers: noIndexHeaders },
      { source: '/dashboard', headers: noIndexHeaders },
      { source: '/dashboard/:path*', headers: noIndexHeaders },
      { source: '/admin', headers: noIndexHeaders },
      { source: '/admin/:path*', headers: noIndexHeaders },
    ]
  },
  async redirects() {
    return [
      { source: '/onboarding', destination: '/dashboard', permanent: true },
      { source: '/onboarding/:path*', destination: '/dashboard', permanent: true },
    ]
  },
}

export default nextConfig
