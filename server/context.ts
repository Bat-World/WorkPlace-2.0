import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export interface IContext {
  prisma: PrismaClient;
  userId: string;
  req: NextRequest;
}

export const createContext = async (request: NextRequest): Promise<Omit<IContext, 'req'>> => {
  let userId = request.headers.get('x-user-id');

  if (!userId && process.env.NODE_ENV === 'development') {
    const firstUser = await prisma.user.findFirst();
    userId = firstUser?.id || null;
  }

  if (!userId) {
    throw new Error('Unauthorized: No user ID provided');
  }

  return {
    prisma,
    userId,
  };
};
