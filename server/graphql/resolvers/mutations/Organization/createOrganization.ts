import { Role } from '@prisma/client';

export const createOrganization = async (_: any, args: any, context: any) => {
  const { name, image, userId: inputUserId } = args.input;
  const userId = inputUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Count orgs for user (optional, update if you want to limit by new model)
  // const orgCount = await context.prisma.organizationMember.count({
  //   where: { userId },
  // });
  // if (orgCount >= 3) throw new Error('Max 3 organizations per user');

  // Create org and set user as ADMIN in OrganizationMember
  const org = await context.prisma.organization.create({
    data: {
      name,
      image,
      ownerId: userId,
      organizationMembers: {
        create: {
          userId,
          role: Role.ADMIN,
        },
      },
    },
  });

  return org;
}; 