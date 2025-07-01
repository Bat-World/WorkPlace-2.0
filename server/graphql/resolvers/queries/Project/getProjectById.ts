export const getProjectById = async (_: any, args: any, context: any) => {
  const { projectId, skip = 0, take = 10, userId: argUserId } = args;
  const userId = argUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  let user = await context.prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    user = await context.prisma.user.create({
      data: {
        id: userId,
        email: `user-${userId}@placeholder.com`,
        name: 'Unknown User',
      }
    });
  }

  const project = await context.prisma.project.findUnique({
    where: { id: projectId },
    include: {
      createdBy: true, 
      tasks: { skip, take },
      labels: true,
      invitations: true,
      members: {
        include: { user: true }
      },
    }
  });

  if (!project) throw new Error('Project not found');

  const validMembers = project.members.filter((m: { user: null; }) => m.user !== null);

  const isMember = validMembers.some((m: { userId: any; }) => m.userId === userId);
  if (!isMember && process.env.NODE_ENV === 'production') {
    throw new Error('Not a member of the project');
  }

  return {
    ...project,
    members: validMembers,
  };
};
