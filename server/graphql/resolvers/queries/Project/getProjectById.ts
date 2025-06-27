export const getProjectById = async (_: any, args: any, context: any) => {
  const { projectId, skip = 0, take = 10, userId: argUserId } = args;
  const userId = argUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');
  const project = await context.prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: { skip, take },
      invitations: true,
      labels: true,
      createdBy: true,
      ProjectMember: { include: { user: true } },
    }
  });
  if (!project) throw new Error('Project not found');
  const isMember = project.ProjectMember.some((m: any) => m.userId === userId);
  if (!isMember && process.env.NODE_ENV === 'production') {
    throw new Error('Not a member of the project');
  }
  const members = project.ProjectMember.map((m: any) => m.user);
  return { ...project, members };
}; 