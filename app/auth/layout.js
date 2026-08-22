export const metadata = {
  title: 'Account',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
}

export default function AuthLayout({ children }) {
  return children
}
