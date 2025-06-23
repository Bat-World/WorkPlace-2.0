export const addDeadline = async (_: any, args: any, context: any) => {
  const { taskId, dueDate, actingUserId } = args;
  const userId = actingUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Fetch task and project/org for RBAC
  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { organization: true } } },
  });
  if (!task) throw new Error('Task not found');
  if (task.project.organization.ownerId !== userId) {
    throw new Error('Only ADMIN can change deadline');
  }

  // Update deadline
  const updatedTask = await context.prisma.task.update({
    where: { id: taskId },
    data: { dueDate },
  });

  return updatedTask;
}; 