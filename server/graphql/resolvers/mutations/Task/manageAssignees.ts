export const manageAssignees = async (_: any, args: any, context: any) => {
  const { taskId, assigneeIds, actingUserId } = args;
  const userId = actingUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  const task = await context.prisma.task.findUnique({
    where: { id: taskId },
    include: { 
      project: { 
        include: { 
          members: { include: { user: true } } 
        } 
      },
      assignees: true 
    },
  });
  
  if (!task) throw new Error('Task not found');

  // Verify all assignee IDs are valid project members
  for (const assigneeId of assigneeIds) {
    const isMember = task.project.members.some((m: any) => m.userId === assigneeId);
    if (!isMember) {
      throw new Error(`User ${assigneeId} is not a member of the project`);
    }
  }

  // Update task with new assignees list
  const updatedTask = await context.prisma.task.update({
    where: { id: taskId },
    data: { 
      assignees: {
        set: assigneeIds.map((id: string) => ({ id }))
      }
    },
    include: { 
      assignees: true,
      project: { include: { members: { include: { user: true } } } }
    },
  });

  return updatedTask;
}; 