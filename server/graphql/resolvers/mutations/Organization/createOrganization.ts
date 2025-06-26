import { Role } from '@prisma/client';

export const createOrganization = async (_: any, args: any, context: any) => {
  const { name, userId: inputUserId } = args.input;
  const userId = inputUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Count orgs for user
  const orgCount = await context.prisma.organization.count({
    where: { members: { some: { id: userId } } },
  });
  if (orgCount >= 3) throw new Error('Max 3 organizations per user');

  // Create org and set user as ADMIN
  const org = await context.prisma.organization.create({
    data: {
      name,
      ownerId: userId,
      members: { connect: { id: userId } },
    },
  });

  // Optionally update user role in org (if you have a join table)
  // ...

  return org;
}; 