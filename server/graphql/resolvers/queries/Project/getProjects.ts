export const getProjects = async (_: any, args: any, context: any) => {
  const userId = args.userId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  return context.prisma.project.findMany({
    where: {
      members: {
        some: {
          id: userId,
        },
      },
    },
    include: {
      tasks: true,        // optional: include if you need related data
      createdBy: true,    // optional: see project creator
      invitations: true,  // optional: if you're tracking project invites
    },
    orderBy: {
      updatedAt: 'desc',  // optional: sort by most recent
    },
  });
};
