export const setTaskLabels = async (_: any, args: any, context: any) => {
  const { taskId, labelNames, labelColor = "#2FC285", actingUserId } = args;
  const userId = actingUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Fetch task
  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });
  if (!task) throw new Error('Task not found');

  // Ensure all labels exist, create if missing
  const labelIds: string[] = [];
  for (const name of labelNames) {
    let label = await context.prisma.label.findFirst({
      where: { name, projectId: task.projectId },
    });
    if (!label) {
      label = await context.prisma.label.create({
        data: {
          name,
          color: labelColor,
          projectId: task.projectId,
        },
      });
    }
    labelIds.push(label.id);
  }

  // Set the task's labels to exactly this set
  const updatedTask = await context.prisma.task.update({
    where: { id: taskId },
    data: { labels: { set: labelIds.map(id => ({ id })) } },
    include: { labels: true },
  });

  return updatedTask;
}; 