export const addComment = async (_: any, args: any, context: any) => {
  const { taskId, content, actingUserId, parentId } = args;
  const userId = actingUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Fetch task and check if it exists
  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });
  if (!task) throw new Error('Task not found');

  // Check if user is a member of the project
  const projectMember = await context.prisma.projectMember.findUnique({
    where: { 
      userId_projectId: {
        userId,
        projectId: task.projectId,
      }
    },
  });
  if (!projectMember) throw new Error('Not a member of the project');

  // If this is a reply, verify the parent comment exists and belongs to the same task
  if (parentId) {
    const parentComment = await context.prisma.comment.findUnique({
      where: { id: parentId },
    });
    if (!parentComment || parentComment.taskId !== taskId) {
      throw new Error('Parent comment not found or does not belong to this task');
    }
  }

  // Add comment
  const comment = await context.prisma.comment.create({
    data: {
      content,
      authorId: userId,
      taskId,
      parentId,
    },
    include: {
      author: true,
      replies: true,
      likes: {
        include: {
          user: true,
        },
      },
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