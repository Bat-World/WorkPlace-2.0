export const getTasks = async (_: any, args: any, context: any) => {
  const userId = args.userId || context?.userId;
  const projectId = args.projectId;
  if (!userId) throw new Error('Unauthorized');
  return context.prisma.task.findMany({
    where: {
      ...(projectId
        ? { projectId }
        : {
            project: {
              organization: {
                members: { some: { id: userId } },
              },
            },
          }),
    },
    include: {
      assignedTo: true,
      labels: true,
      comments: true,
    },
  });
}; 