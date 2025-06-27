export const updateTask = async (_: any, args: any, context: any) => {
  const { taskId, input } = args;
  const { userId: inputUserId, ...updateData } = input;
  const userId = inputUserId || context?.userId;
  
  if (!userId && process.env.NODE_ENV === 'production') {
    throw new Error('Unauthorized');
  }

  // Fetch task and project for validation
  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { 
      project: { 
        include: { 
          ProjectMember: true
        } 
      } 
    },
  });
  
  if (!task) throw new Error('Task not found');

  // Check if user is a member of the project or the task creator
  const isProjectMember = userId && task.project.ProjectMember.some((member: { userId: string }) => member.userId === userId);
  const isTaskCreator = userId && task.createdById === userId;
  
  // Allow if user is project member, task creator, or in development mode
  if (userId && !isProjectMember && !isTaskCreator && process.env.NODE_ENV === 'production') {
    throw new Error('Unauthorized: Not a member of this project');
  }

  // Update task
  await context.prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });

  // Return the full updated task with all fields and relations
  return context.prisma.task.findUnique({
    where: { id: taskId },
    include: { 
      assignedTo: true,
      project: {
        select: {
          id: true,
          title: true,
        }
      }
    },
  });
}; 