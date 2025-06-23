export const addLabel = async (_: any, args: any, context: any) => {
  const { taskId, labelId, labelName, labelColor, actingUserId } = args;
  const userId = actingUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Fetch task
  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });
  if (!task) throw new Error('Task not found');

  let label;
  if (labelId) {
    label = await context.prisma.label.findUnique({
      where: { id: labelId },
      include: { project: true },
    });
    if (!label) throw new Error('Label not found');
    if (task.projectId !== label.projectId) throw new Error('Label must belong to the same project');
  } else if (labelName) {
    // Find or create label by name and color for the same project
    label = await context.prisma.label.findFirst({
      where: { name: labelName, projectId: task.projectId },
    });
    if (!label) {
      label = await context.prisma.label.create({
        data: {
          name: labelName,
          color: labelColor || '#cccccc',
          projectId: task.projectId,
        },
      });
    }
  } else {
    throw new Error('Either labelId or labelName must be provided');
  }

  // Add label
  const updatedTask = await context.prisma.task.update({
    where: { id: taskId },
    data: { labels: { connect: { id: label.id } } },
    include: { labels: true },
  });

  return updatedTask;
}; 