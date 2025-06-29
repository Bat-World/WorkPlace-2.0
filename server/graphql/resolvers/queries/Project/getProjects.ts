export const getProjects = async (_: any, args: any, context: any) => {
  const userId = args.userId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  const projects = await context.prisma.project.findMany({
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

  // Explicitly include avatarUrl in the response
  return projects.map((project: any) => ({
    ...project,
    avatarUrl: project.avatarUrl,
  }));
};
