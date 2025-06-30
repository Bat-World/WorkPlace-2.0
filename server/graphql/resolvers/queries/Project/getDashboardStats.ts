export const getDashboardStats = async (
  _: any,
  args: { projectId: string; userId?: string },
  context: { prisma: any; userId?: string }
) => {
  const { projectId, userId: argUserId } = args;
  const userId = argUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  const project = await context.prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: true,
    },
  });

  if (!project) throw new Error('Project not found');

  const isMember = project.members.some((m: any) => m.userId === userId);
  if (!isMember && process.env.NODE_ENV === 'production') {
    throw new Error('Not a member of the project');
  }

  const [totalTasks, inProgressTasks, reviewReadyTasks, doneTasks] = await Promise.all([
    context.prisma.task.count({ where: { projectId } }),
    context.prisma.task.count({ where: { projectId, status: 'DOING' } }),
    context.prisma.task.count({ where: { projectId, status: 'REVIEW' } }),
    context.prisma.task.count({ where: { projectId, status: 'DONE' } }), 
  ]);

  return {
    totalTasks,
    inProgressTasks,
    reviewReadyTasks,
    doneTasks, 
  };
};
