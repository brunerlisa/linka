import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import './index.css'
import App from './App.jsx'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {clerkPublishableKey ? (
      <ClerkProvider publishableKey={clerkPublishableKey} signInForceRedirectUrl="/onboarding" signUpForceRedirectUrl="/onboarding">
        <App />
      </ClerkProvider>
    ) : (
      <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
        Missing <code>VITE_CLERK_PUBLISHABLE_KEY</code> in <code>.env.local</code>.
      </div>
    )}
  </StrictMode>,
)
