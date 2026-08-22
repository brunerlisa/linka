import AuthForm from '@/components/AuthForm'

export const metadata = {
  title: 'Sign up',
  robots: { index: false, follow: false },
}

export default function SignUpPage() {
  return <AuthForm mode="sign-up" />
}
