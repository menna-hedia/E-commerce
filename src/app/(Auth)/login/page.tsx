import { Suspense } from 'react'
import type { Metadata } from 'next'
import LoginForm from './loginForm'

export const metadata: Metadata = { title: "Sign in" }

export default function page() {
  // useSearchParams (for callbackUrl) needs a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}