import { Request, Response, NextFunction } from 'express';

export function requireOrgMember(req: Request, res: Response, next: NextFunction) {
  // TODO: Check if user is a member of the org
  next();
}

export function enforceMaxOrgs(req: Request, res: Response, next: NextFunction) {
  // TODO: Check if user has less than 3 orgs
  next();
} 