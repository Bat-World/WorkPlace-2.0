'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { user, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard')
    }
  }, [isSignedIn, router])

  if (!isSignedIn) {
    return (
      <div className="p-6">
        <div className="mb-4">Landing page.</div>
        <Button onClick={() => router.push(`/auth/sign-in`)}>Sign In</Button>
        <Button onClick={() => router.push(`/auth/sign-up`)}>Sign Up</Button>
      </div>
    )
  }

  
  return <div className="p-6">Redirecting to dashboard...</div>
}
