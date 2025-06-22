export const addLog = async (_: any, args: any, context: any) => {
  const { taskId, message, actingUserId } = args;
  const userId = actingUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Fetch task and org
  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { organization: { include: { members: true } } } } },
  });
  if (!task) throw new Error('Task not found');
  const isMember = task.project.organization.members.some((m: any) => m.id === userId);
  if (!isMember) throw new Error('Not a member of the organization');

  // Add log
  const log = await context.prisma.log.create({
    data: {
      message,
      userId: userId,
      taskId,
    },
  });

  return log;
}; 