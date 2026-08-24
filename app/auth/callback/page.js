import AuthCallbackClient from '@/components/AuthCallbackClient'

export const metadata = {
  title: 'Reset password',
  robots: { index: false, follow: false },
}

export default function AuthCallbackPage() {
  return <AuthCallbackClient />
}
