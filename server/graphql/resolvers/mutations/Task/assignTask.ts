export const assignTask = async (_: any, args: any, context: any) => {
  const { taskId, userId: assigneeId, actingUserId } = args;
  const userId = actingUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Fetch task and org
  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { organization: { include: { members: true } } } } },
  });
  if (!task) throw new Error('Task not found');

  // Check if assigneeId is a member of the org
  const isMember = task.project.organization.members.some((m: any) => m.id === assigneeId);
  if (!isMember) throw new Error('User is not a member of the organization');

  // Assign user
  const updatedTask = await context.prisma.task.update({
    where: { id: taskId },
    data: { 
      assignees: {
        set: [{ id: assigneeId }]
      }
    },
    include: { assignees: true },
  });

  return updatedTask;
}; 