import { Outfit } from 'next/font/google'
import { AuthProvider } from '@/components/AuthProvider'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

const LOGO_SRC = '/noblemirrorcapital.png'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.noblemirrorcapital.com'
const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'na68QqLqQW7fBIsd8O_JQ1ooZwZURbpH6FdXhb6Uydk'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Noble Mirror Capital',
  url: siteUrl,
  logo: `${siteUrl}${LOGO_SRC}`,
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Noble Mirror Capital - Innovative Copy Trading',
    template: '%s | Noble Mirror Capital',
  },
  description: 'A platform with endless possibilities. When experts trade, you trade.',
  applicationName: 'Noble Mirror Capital',
  keywords: [
    'copy trading',
    'ai trading platform',
    'social trading',
    'Noble Mirror Capital',
    'forex copy trading',
    'crypto copy trading',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Noble Mirror Capital',
    title: 'Noble Mirror Capital - Innovative Copy Trading',
    description: 'A platform with endless possibilities. When experts trade, you trade.',
    images: [
      {
        url: LOGO_SRC,
        width: 1024,
        height: 1024,
        alt: 'Noble Mirror Capital logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noble Mirror Capital - Innovative Copy Trading',
    description: 'A platform with endless possibilities. When experts trade, you trade.',
    images: [LOGO_SRC],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/noblemirrorcapital.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/noblemirrorcapital.png',
  },
  verification: {
    google: googleVerification,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} overflow-x-hidden`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className="min-h-screen bg-dark text-slate-100 font-sans antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
