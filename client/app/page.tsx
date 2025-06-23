'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function DashboardPage() {
  const { user, isSignedIn } = useUser()
  const { getToken } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleCreateProject = async () => {
    if (!title) return alert('Please enter a title')

    const mutation = `
      mutation CreateProject($input: CreateProjectInput!) {
        createProject(input: $input) {
          id
          title
        }
      }
    `

    const variables = {
      input: {
        title,
        description,
      },
    }

    try {
      const token = await getToken()

      const res = await fetch('http://localhost:3000/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: mutation, variables }),
      })

      const json = await res.json()

      if (json.errors) {
        console.error('GraphQL errors:', json.errors)
        alert('Failed to create project')
        return
      }

      const newProject = json.data.createProject
      console.log('✅ Project created:', newProject)
      router.push(`/projects/${newProject.id}`)
    } catch (error) {
      console.error('❌ Error creating project:', error)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="p-6">
        <div className="mb-4">Landing page.</div>
        <Button onClick={() => router.push(`/auth/sign-in`)}>Sign In</Button>
        <Button onClick={() => router.push(`/auth/sign-up`)}>Sign Up</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b bg-card p-4 flex justify-between items-center">
        <div className="text-lg font-semibold">WorkPlace 2.0</div>
        <div className="flex items-center gap-3">
          <span className="hidden md:block">Welcome, {user.firstName}!</span>
          <Image
            src={user.imageUrl}
            alt="avatar"
            width={36}
            height={36}
            className="rounded-full"
          />
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Projects</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Add Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Project</DialogTitle>
                <DialogDescription>Enter project details below</DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button onClick={handleCreateProject}>Create Project</Button>
            </DialogContent>
          </Dialog>
        </div>


      )}
      <button onClick={() => router.push(`/dashboard`)}>dashboard</button>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-card p-4 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-muted rounded-lg" />
                  <div>
                    <h3 className="font-semibold">Swipe marketing</h3>
                    <p className="text-sm text-muted-foreground">
                      Let's do the exact opposite of the first...
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>👥 14</span>
                  <span>📅 Jan 28</span>
                  <span>⚙️</span>
                </div>
              </div>
            ))}
        </div>
      </div>

    </div>
  )
}
