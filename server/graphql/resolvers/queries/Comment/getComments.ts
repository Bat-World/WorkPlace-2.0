export const getComments = async (_: any, args: any, context: any) => {
  const { taskId, skip = 0, take = 10, userId: argUserId } = args;
  const userId = argUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');
  
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
  
  // Get only top-level comments (no parentId)
  const comments = await context.prisma.comment.findMany({ 
    where: { 
      taskId,
      parentId: null, // Only top-level comments
    }, 
    skip, 
    take,
    include: {
      author: true,
      replies: {
        include: {
          author: true,
          likes: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
      likes: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Add computed fields
  const commentsWithComputed = await Promise.all(
    comments.map(async (comment: any) => {
      const likeCount = comment.likes.length;
      const isLikedByUser = comment.likes.some((like: any) => like.userId === userId);
      
      return {
        ...comment,
        likeCount,
        isLikedByUser,
        replies: await Promise.all(
          comment.replies.map(async (reply: any) => {
            const replyLikeCount = reply.likes.length;
            const replyIsLikedByUser = reply.likes.some((like: any) => like.userId === userId);
            
            return {
              ...reply,
              likeCount: replyLikeCount,
              isLikedByUser: replyIsLikedByUser,
            };
          })
        ),
      };
    })
  );

  return commentsWithComputed;
}; 