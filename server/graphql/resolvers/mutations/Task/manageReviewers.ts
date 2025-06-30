export const manageReviewers = async (_: any, args: any, context: any) => {
  const { taskId, reviewerIds, actingUserId } = args;
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

  // Verify all reviewer IDs are valid project members
  for (const reviewerId of reviewerIds) {
    const isMember = task.project.members.some((m: any) => m.userId === reviewerId);
    if (!isMember) {
      throw new Error(`User ${reviewerId} is not a member of the project`);
    }
  }

  // Update task with new reviewers list
  const updatedTask = await context.prisma.task.update({
    where: { id: taskId },
    data: { 
      reviewers: {
        set: reviewerIds.map((id: string) => ({ id }))
      }
    },
    include: { 
      reviewers: true,
      project: { include: { members: { include: { user: true } } } }
    },
  });

  return updatedTask;
}; 