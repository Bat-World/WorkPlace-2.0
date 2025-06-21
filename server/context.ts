import { PrismaClient } from '@prisma/client'
import { clerkClient } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

export const createContext = async (request: Request) => {
  // Extract the authorization header
  const authHeader = request.headers.get('authorization')
  let userId = null

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      // For now, we'll use a simple approach
      // In production, you should properly verify the JWT token
      // This is a placeholder - you can decode the token to get user info
      userId = 'temp-user-id' // Replace with actual user ID from token
    } catch (error) {
      console.error('Token verification failed:', error)
    }
  }

  return {
    prisma,
    userId,
  }
}
