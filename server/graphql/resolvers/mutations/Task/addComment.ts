export const addComment = async (_: any, args: any, context: any) => {
  const { taskId, content, actingUserId } = args;
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

  // Add comment
  const comment = await context.prisma.comment.create({
    data: {
      content,
      authorId: userId,
      taskId,
    },
  });

  // Auto-generate log
  await context.prisma.log.create({
    data: {
      message: `Comment added: ${content}`,
      userId: userId,
      taskId,
    },
  });

  return comment;
}; 