export const getOrganizations = async (_: any, args: any, context: any) => {
  const userId = args.userId || context?.userId;
  if (!userId) throw new Error('Unauthorized');
  return context.prisma.organization.findMany({
    where: { members: { some: { id: userId } } },
  });
}; 