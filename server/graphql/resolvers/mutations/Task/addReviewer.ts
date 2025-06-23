export const addReviewer = async (_: any, args: any, context: any) => {
  const { taskId, userId: reviewerId, actingUserId } = args;
  const userId = actingUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Fetch task and org
  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { organization: { include: { members: true } } } } },
  });
  if (!task) throw new Error('Task not found');

  // Check if reviewerId is a member of the org
  const isMember = task.project.organization.members.some((m: any) => m.id === reviewerId);
  if (!isMember) throw new Error('User is not a member of the organization');

  // Add reviewer
  const updatedTask = await context.prisma.task.update({
    where: { id: taskId },
    data: { reviewers: { connect: { id: reviewerId } } },
    include: { reviewers: true },
  });

  return updatedTask;
}; 