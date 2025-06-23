export const updateTask = async (_: any, args: any, context: any) => {
  const { taskId, input } = args;
  const { userId: inputUserId, ...updateData } = input;
  const userId = inputUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Fetch task and project/org for RBAC (pseudo-code, adjust as needed)
  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { organization: true } } },
  });
  if (!task) throw new Error('Task not found');

  // Only ADMIN can change deadline or move to DONE
  if ((updateData.dueDate || updateData.status === 'DONE') && task.project.organization.ownerId !== userId) {
    throw new Error('Only ADMIN can change deadline or close task');
  }

  // Update task (do not include userId in data)
  await context.prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });

  // Return the full updated task with all fields and relations
  return context.prisma.task.findUnique({
    where: { id: taskId },
    include: { assignedTo: true },
  });
}; 