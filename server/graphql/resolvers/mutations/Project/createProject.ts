export const createProject = async (_: any, args: any, context: any) => {
  const { title, description, organizationId } = args.input;
  const userId = context.userId;

  if (!userId) throw new Error('Unauthorized');
  console.log("userId going",userId);
  

  const existingUser = await context.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) throw new Error('User does not exist in DB');

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
