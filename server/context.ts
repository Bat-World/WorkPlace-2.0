import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createContext = async (request: Request) => {
  const userId = request.headers.get('x-user-id'); 

  if (!userId) {
    throw new Error('Unauthorized: No user ID provided');
  }

  return {
    prisma,
    userId,
  };
};
