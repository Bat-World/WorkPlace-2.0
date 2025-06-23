export const getProjectById = async (_: any, args: any, context: any) => {
  const { projectId, skip = 0, take = 10, userId: argUserId } = args;
  const userId = argUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');
  const project = await context.prisma.project.findUnique({
    where: { id: projectId },
    include: {
      organization: { include: { members: true } },
      tasks: { skip, take },
    },
  });
  if (!project) throw new Error('Project not found');
  const isMember = project.organization.members.some((m: any) => m.id === userId);
  if (!isMember) throw new Error('Not a member of the organization');
  return project;
}; 