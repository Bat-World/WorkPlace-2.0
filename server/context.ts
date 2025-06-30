import { prisma } from "./lib/prisma";

export const createContext = async (request: Request) => {
  const userId = request.headers.get("x-user-id");

  if (!userId && process.env.NODE_ENV === "production") {
    throw new Error("Unauthorized: No user ID provided");
  }

  return {
    prisma,
    userId: userId || null,
  };
};
