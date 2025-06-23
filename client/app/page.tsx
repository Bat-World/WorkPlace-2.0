'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'


export default function DashboardPage() {
  const { user, isSignedIn } = useUser()
  const { getToken } = useAuth()
  const router = useRouter()

  if (!isSignedIn) {
    return (
      <div className="p-6">
        <div className="mb-4">Landing page.</div>
        <Button onClick={() => router.push(`/auth/sign-in`)}>Sign In</Button>
        <Button onClick={() => router.push(`/auth/sign-up`)}>Sign Up</Button>
      </div>
    )
  } else {
    router.push("/dashboard")
  }
}
