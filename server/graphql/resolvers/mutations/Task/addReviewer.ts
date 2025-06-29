export const addReviewer = async (_: any, args: any, context: any) => {
  const { taskId, userId: reviewerId, actingUserId } = args;
  const userId = actingUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { 
      project: { 
        include: { 
          members: { include: { user: true } } 
        } 
      },
      reviewers: true 
    },
  });
  
  if (!task) throw new Error('Task not found');

  const isMember = task.project.members.some((m: any) => m.userId === reviewerId);
  if (!isMember) throw new Error('User is not a member of the project');

  const isAlreadyReviewer = task.reviewers.some((r: any) => r.id === reviewerId);
  if (isAlreadyReviewer) {
    throw new Error('User is already a reviewer for this task');
  }

  const updatedTask = await context.prisma.task.update({
    where: { id: taskId },
    data: { reviewers: { connect: { id: reviewerId } } },
    include: { 
      reviewers: true,
      project: { include: { members: { include: { user: true } } } }
    },
  });

  return updatedTask;
}; 