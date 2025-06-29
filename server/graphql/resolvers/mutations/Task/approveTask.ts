export const approveTask = async (_: any, args: any, context: any) => {
  const { taskId, userId: argUserId } = args;
  const userId = argUserId || context?.userId;
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
  
  // Check if user is a reviewer of the task
  const isReviewer = task.reviewers.some((r: any) => r.id === userId);
  if (!isReviewer) throw new Error('Only reviewers can approve tasks');
  
  // Check if user is ADMIN in the project
  const projectMember = task.project.members.find((m: any) => m.userId === userId);
  if (!projectMember || projectMember.role !== 'ADMIN') {
    throw new Error('Only ADMIN reviewers can approve tasks');
  }

  const updatedTask = await context.prisma.task.update({
    where: { id: taskId },
    data: { status: 'APPROVED' },
    include: {
      project: { include: { members: { include: { user: true } } } },
      reviewers: true,
      assignees: true,
      createdBy: true,
    },
  });

  return updatedTask;
}; 