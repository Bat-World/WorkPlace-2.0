import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/express";
import { IncomingMessage } from "http";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userId?: string;
}

export function createContext({ req }: { req: IncomingMessage }): Context {
  const { userId } = getAuth(req);
  return {
    prisma,
    userId: userId ?? undefined,
  };
}
