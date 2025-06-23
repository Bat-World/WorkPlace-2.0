export const getTasks = async (_: any, args: any, context: any) => {
  const userId = args.userId || context?.userId;
  if (!userId) throw new Error('Unauthorized');
  return context.prisma.task.findMany({
    where: {
      project: {
        organization: {
          members: { some: { id: userId } }
        }
      }
    },
  });
}; 