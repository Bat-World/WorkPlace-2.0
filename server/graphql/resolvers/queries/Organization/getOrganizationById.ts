export const getOrganizationById = async (_: any, args: any, context: any) => {
  const { orgId, skip = 0, take = 10, userId: argUserId } = args;
  const userId = argUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');
  const org = await context.prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      members: { skip, take },
      projects: true,
    },
  });
  if (!org) throw new Error('Organization not found');
  const isMember = org.members.some((m: any) => m.id === userId);
  if (!isMember) throw new Error('Not a member of the organization');
  return org;
}; 