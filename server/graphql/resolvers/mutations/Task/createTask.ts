export const createTask = async (_: any, args: any, context: any) => {
  const { title, description, projectId, assignedToId, dueDate, priority, userId: inputUserId } = args.input;
  const userId = inputUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  const newTask = await context.prisma.task.create({
    data: {
      title,
      description,
      projectId,
      assignedToId,
      dueDate,
      priority,
      createdById: userId,
    },
  });

  return context.prisma.task.findUnique({
    where: { id: newTask.id },
    include: { assignedTo: true },
  });
};
