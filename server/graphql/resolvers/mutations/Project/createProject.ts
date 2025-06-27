export const createProject = async (_: any, args: any, context: any) => {
  const { title, description, userId: inputUserId } = args.input;
  const userId = inputUserId || context.userId;

  if (!userId) throw new Error('Unauthorized');

  const existingUser = await context.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) throw new Error('User does not exist in DB');

  // Create the project
  const newProject = await context.prisma.project.create({
    data: {
      title,
      description,
      createdById: userId,
    },
  });

  // Ensure the creator is a member (ADMIN)
  const existingMember = await context.prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId: newProject.id,
      },
    },
  });
  if (!existingMember) {
    await context.prisma.projectMember.create({
      data: {
        userId,
        projectId: newProject.id,
        role: 'ADMIN',
      },
    });
  }

  return newProject;
};
