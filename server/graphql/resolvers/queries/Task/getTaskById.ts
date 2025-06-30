export const getTaskById = async (_: any, args: any, context: any) => {
  const { taskId, userId: argUserId } = args;
  const userId = argUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');
  
  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: true,
      assignees: true,
      createdBy: true,
      reviewers: true,
      labels: true,
      comments: true,
      logs: true,
    },
  });
  
  if (!task) throw new Error('Task not found');
  
  const projectMember = await context.prisma.projectMember.findUnique({
    where: { 
      userId_projectId: {
        userId,
        projectId: task.projectId,
      }
    },
  });
  
  if (!projectMember) throw new Error('Not a member of the project');
  
  return task;
}; 