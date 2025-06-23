export const getLogs = async (_: any, args: any, context: any) => {
  const { taskId, userId: argUserId } = args;
  const userId = argUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');
  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { organization: { include: { members: true } } } } },
  });
  if (!task) throw new Error('Task not found');
  const isMember = task.project.organization.members.some((m: any) => m.id === userId);
  if (!isMember) throw new Error('Not a member of the organization');
  return context.prisma.log.findMany({ where: { taskId } });
}; 