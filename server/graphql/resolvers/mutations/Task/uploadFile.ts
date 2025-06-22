export const uploadFile = async (_: any, args: any, context: any) => {
  const { taskId, fileUrl, actingUserId } = args;
  const userId = actingUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Fetch task and org
  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { organization: { include: { members: true } } } } },
  });
  if (!task) throw new Error('Task not found');
  const isMember = task.project.organization.members.some((m: any) => m.id === userId);
  if (!isMember) throw new Error('Not a member of the organization');

  // For now, just log the file URL (in production, store in a File model or on Task)
  // Option 1: Add to a File model (recommended for multiple files per task)
  // Option 2: Add a fileUrl field to Task (for single file)
  // Here, we'll just return the fileUrl for demo
  return { success: true, fileUrl };
}; 