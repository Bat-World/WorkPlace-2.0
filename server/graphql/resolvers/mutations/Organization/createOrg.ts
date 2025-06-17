
import { prisma } from '@/lib/prisma';

export const createOrg = async (_: any, args: { name: string; userId: string; description?: string }) => {
  const { name, userId, description } = args;

  const organization = await prisma.organization.create({
    data: {
      name,
      description: description ?? '',
      members: {
        create: {
          userId,
          role: 'ADMIN',
        },
      },
    },
  });

  return organization;
};
