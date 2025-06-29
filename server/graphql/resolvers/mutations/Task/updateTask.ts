export const updateTask = async (_: any, args: any, context: any) => {
  const { taskId, input } = args;
  const { title, description, body, attachments, status, dueDate, priority, assigneeIds } = input;

  // Prepare update data
  const updateData: any = {};
  
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (body !== undefined) updateData.body = body;
  if (attachments !== undefined) updateData.attachments = attachments;
  if (status !== undefined) updateData.status = status;
  if (dueDate !== undefined) updateData.dueDate = dueDate;
  if (priority !== undefined) updateData.priority = priority;

  // Handle assignees if provided
  if (assigneeIds !== undefined) {
    // First disconnect all existing assignees
    await context.prisma.task.update({
      where: { id: taskId },
      data: { assignees: { set: [] } },
    });
    
    // Then connect new assignees
    if (assigneeIds.length > 0) {
      updateData.assignees = {
        connect: assigneeIds.map((id: string) => ({ id }))
      };
    }
  }

  return context.prisma.task.update({
    where: { id: taskId },
    data: updateData,
    include: { 
      assignees: true,
      labels: true,
    },
  });
}; 