export const getProjects = async (_: any, args: any, context: any) => {
  const { userId: argUserId, orgId } = args;
  const userId = argUserId || context?.userId;

  if (!userId) throw new Error("Unauthorized");

  if (orgId) {
    const organization = await context.prisma.organization.findUnique({
      where: { id: orgId },
      include: { organizationMembers: true },
    });

    if (!organization) throw new Error("Organization not found");

    const isMember = organization.organizationMembers.some(
      (member: any) => member.userId === userId
    );
    if (!isMember) throw new Error("Not a member of the organization");

    return context.prisma.project.findMany({
      where: { organizationId: orgId },
      include: {
        organization: true,
        tasks: true,
      },
    });
  }

  return context.prisma.project.findMany({
    where: { organization: { organizationMembers: { some: { userId } } } },
    include: {
      organization: true,
      tasks: true,
    },
  });
};
