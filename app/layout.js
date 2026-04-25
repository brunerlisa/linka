import { ClerkProvider } from '@clerk/nextjs'
import { Outfit } from 'next/font/google'
import { AuthProvider } from '@/components/AuthProvider'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Noble Mirror Capital',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.noblemirrorcapital.com',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.noblemirrorcapital.com'}/noblemirrorcapital%20logo.png`,
}

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.noblemirrorcapital.com'),
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
        url: '/noblemirrorcapital%20logo.png',
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
    images: ['/noblemirrorcapital%20logo.png'],
  },
  icons: {
    icon: '/noblemirrorcapital%20logo.png',
    shortcut: '/noblemirrorcapital%20logo.png',
    apple: '/noblemirrorcapital%20logo.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en" className={outfit.variable}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />
        </head>
        <body className="min-h-screen bg-dark text-slate-100 font-sans antialiased" suppressHydrationWarning>
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
