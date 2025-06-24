export const getOrganizations = async (_: any, args: any, context: any) => {
  const userId = args.userId || context?.userId;
  if (!userId) throw new Error('Unauthorized');
  const orgs = await context.prisma.organization.findMany({
    where: { organizationMembers: { some: { userId } } },
    include: {
      projects: true,
      owner: true,
    },
  });
  return orgs.map((org: any) => ({
    ...org,
    ownerId: org.ownerId,
  }));
}; 