export const updateTask = async (_: any, args: any, context: any) => {
  const { taskId, input } = args;
  const { title, description, body, attachments, status, dueDate, priority, assigneeIds } = input;

  const updateData: any = {};
  
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (body !== undefined) updateData.body = body;
  if (attachments !== undefined) updateData.attachments = attachments;
  if (dueDate !== undefined) updateData.dueDate = dueDate;
  if (priority !== undefined) updateData.priority = priority;

  if (assigneeIds !== undefined) {
    await context.prisma.task.update({
      where: { id: taskId },
      data: { assignees: { set: [] } },
    });

    if (assigneeIds.length > 0) {
      updateData.assignees = {
        connect: assigneeIds.map((id: string) => ({ id }))
      };
    }
  }

  if (status !== undefined) {
    updateData.status = status;

    
    if (status === "DONE") {
      updateData.doneAt = new Date();
    } else {
      updateData.doneAt = null;
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
