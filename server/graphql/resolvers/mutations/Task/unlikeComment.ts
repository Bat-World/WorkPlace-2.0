export const unlikeComment = async (_: any, args: any, context: any) => {
  const { commentId, actingUserId } = args;
  const userId = actingUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Check if comment exists
  const comment = await context.prisma.comment.findUnique({
    where: { id: commentId },
    include: { task: { include: { project: true } } },
  });
  if (!comment) throw new Error('Comment not found');

  // Check if user is a member of the project
  const projectMember = await context.prisma.projectMember.findUnique({
    where: { 
      userId_projectId: {
        userId,
        projectId: comment.task.projectId,
      }
    },
  });
  if (!projectMember) throw new Error('Not a member of the project');

  // Find and delete the like
  const like = await context.prisma.commentLike.deleteMany({
    where: {
      commentId,
      userId,
    },
  });

  return like.count > 0;
}; 