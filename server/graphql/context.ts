import { auth } from '@clerk/nextjs/server';

export const createContext = async (req: Request) => {
  const { userId } = await auth(); 
  if (!userId) throw new Error("Unauthorized");

  return {
    userId,
    isAuthenticated: true,
  };
};
