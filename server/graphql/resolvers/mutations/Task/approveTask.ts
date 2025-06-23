export const approveTask = async (_: any, args: any, context: any) => {
  const { taskId, userId: argUserId } = args;
  const userId = argUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Fetch task and project/org for RBAC
  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { organization: true } } },
  });
  if (!task) throw new Error('Task not found');
  if (task.project.organization.ownerId !== userId) {
    throw new Error('Only ADMIN can approve task');
  }
  if (task.status !== 'REVIEW') throw new Error('Task must be in REVIEW to approve');

  // Update status to DONE
  const updatedTask = await context.prisma.task.update({
    where: { id: taskId },
    data: { status: 'DONE' },
  });

  return updatedTask;
}; 