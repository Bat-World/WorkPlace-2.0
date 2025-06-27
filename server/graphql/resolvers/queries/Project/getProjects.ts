export const getProjects = async (_: any, args: any, context: any) => {
  const userId = args.userId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  return context.prisma.project.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: true,
      createdBy: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};
