import { Request, Response, NextFunction } from 'express';

export async function clerkAuth(req: Request, res: Response, next: NextFunction) {
  // TODO: Validate Clerk JWT, fetch user, attach to req.user
  next();
} 