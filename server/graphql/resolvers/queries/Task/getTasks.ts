export const getTasks = async (_: any, args: any, context: any) => {
  try {
    const { userId, projectId } = args;
    const currentUserId = userId || context?.userId;
    
    if (!currentUserId && process.env.NODE_ENV === 'production') {
      throw new Error('Unauthorized');
    }

    if (!context?.prisma) {
      throw new Error('Prisma client is not available in context');
    }

    const whereClause: any = {};

    if (projectId) {
      whereClause.projectId = projectId;
    }

    // Optionally, you can check if the user is a member of the project here

    const result = await context.prisma.task.findMany({
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

    return result;
  } catch (error) {
    console.error('Error in getTasks resolver:', error);
    throw error;
  }
}; 