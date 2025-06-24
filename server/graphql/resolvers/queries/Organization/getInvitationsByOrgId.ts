import { PrismaClient } from '@prisma/client';

export const getInvitationsByOrgId = async (_: any, { orgId }: { orgId: string }, { prisma }: { prisma: PrismaClient }) => {
  if (!orgId) return [];
  try {
    return await prisma.invitation.findMany({
      where: { organizationId: orgId },
    });
  } catch (e) {
    return [];
  }
}; 