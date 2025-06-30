export const deleteTask = async (_: any, args: any, context: any) => {
  const { taskId, userId: inputUserId } = args;
  const userId = inputUserId || context?.userId;

  if (!userId && process.env.NODE_ENV === "production") {
    throw new Error("Unauthorized");
  }

  // Find the task to delete
  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  // Optional: Add authorization check here
  // For example, check if the user is a member of the project
  // or if they created the task

  // Delete the task
  const deletedTask = await context.prisma.task.delete({
    where: { id: taskId },
    include: { 
      assignees: true,
      labels: true,
    },
  });

  return deletedTask;
}; 