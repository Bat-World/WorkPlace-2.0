export const getTasks = async (_: any, args: any, context: any) => {
  const { userId, projectId } = args;
  const currentUserId = userId || context?.userId;
  
  if (!currentUserId && process.env.NODE_ENV === 'production') {
    throw new Error('Unauthorized');
  }

  const whereClause: any = {};

  if (projectId) {
    whereClause.projectId = projectId;
  }

  // Optionally, you can check if the user is a member of the project here

  return context.prisma.task.findMany({
    where: whereClause,
    include: {
      assignees: true,
      labels: true,
      project: {
        select: {
          id: true,
          title: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}; 