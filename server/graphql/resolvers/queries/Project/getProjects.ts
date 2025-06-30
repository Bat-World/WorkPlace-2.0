export const getProjects = async (_: any, args: any, context: any) => {
  const userId = args.userId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  return await context.prisma.project.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        include: {
          user: true, 
        },
      },
      createdBy: true,
      labels: true, 
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};
