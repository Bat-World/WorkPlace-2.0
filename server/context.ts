import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createContext = async (request: Request) => {
  const userId = request.headers.get('x-user-id'); 

  // Return context with userId (can be null) - let resolvers handle auth
  return {
    prisma,
    userId,
  };
};
