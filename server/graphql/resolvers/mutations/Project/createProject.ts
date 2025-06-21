export const createProject = async (_: any, args: any, context: any) => {
  const { title, description } = args.input;

  if (!context?.userId) throw new Error("Unauthorized");

  const newProject = await context.prisma.project.create({
    data: {
      title,
      description,
      createdById: context.userId,
    },
  });

  return newProject;
};
