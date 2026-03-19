import { ClerkProvider } from '@clerk/nextjs'
import { Outfit } from 'next/font/google'
import { AuthProvider } from '@/components/AuthProvider'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const metadata = {
  title: 'Noble Mirror Capital - Innovative Copy Trading',
  description: 'A platform with endless possibilities. When experts trade, you trade.',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/onboarding"
      signUpFallbackRedirectUrl="/onboarding"
    >
      <html lang="en" className={outfit.variable}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className="min-h-screen bg-dark text-slate-100 font-sans antialiased" suppressHydrationWarning>
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
