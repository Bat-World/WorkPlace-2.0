export const createProject = async (_: any, args: any, context: any) => {
  const { title, description, organizationId, userId: inputUserId } = args.input;
  const userId = inputUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  const newProject = await context.prisma.project.create({
    data: {
      title,
      description,
      organizationId,
      createdById: userId,
    },
  });

  return newProject;
};
