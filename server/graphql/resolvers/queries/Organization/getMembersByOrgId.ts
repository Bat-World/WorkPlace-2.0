export const getMembersByOrgId = async (_: any, args: any, context: any) => {
  const { orgId } = args;
  const orgMembers = await context.prisma.organizationMember.findMany({
    where: { organizationId: orgId },
    include: { user: true }
  });
  return orgMembers.map((m: any) => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
    avatarUrl: m.user.avatarUrl,
    role: m.role,
  }));
}; 