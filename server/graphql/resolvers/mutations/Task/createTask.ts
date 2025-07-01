export const createTask = async (_: any, args: any, context: any) => {
  const {
    title,
    description,
    projectId,
    assignedToId, // Keep for backward compatibility but convert to assignees
    assigneeIds, // <-- new
    dueDate,
    priority,
    status,
    userId: inputUserId,
    labels,
  } = args.input;
  const userId = inputUserId || context?.userId;

  if (!userId && process.env.NODE_ENV === "production") {
    throw new Error("Unauthorized");
  }

  // Validate that the creator user exists
  let validatedCreatedById = userId;
  if (userId) {
    const creatorUser = await context.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!creatorUser) {
      // For development, create a default user if it doesn't exist
      if (process.env.NODE_ENV !== "production") {
        try {
          const defaultUser = await context.prisma.user.create({
            data: {
              id: userId,
              email: `${userId}@example.com`,
              name: "Default User",
            },
          });
          validatedCreatedById = defaultUser.id;
        } catch (error) {
          console.log('Error creating default user:', error);
          throw new Error('User does not exist and could not be created');
        }
      } else {
        throw new Error('User does not exist');
      }
    }
  } else {
    validatedCreatedById = 'default-user-id';
  }

  // Prepare assignees data - support both legacy and new
  let assigneesData = undefined;
  if (assigneeIds && assigneeIds.length > 0) {
    // Ensure all users exist (auto-create if missing)
    await Promise.all(
      assigneeIds.map(async (userId: string) => {
        let user = await context.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          await context.prisma.user.create({
            data: {
              id: userId,
              email: `${userId}@example.com`,
              name: "Auto-created User",
            },
          });
        }
      })
    );
    assigneesData = { connect: assigneeIds.map((userId: string) => ({ id: userId })) };
  } else if (assignedToId) {
    assigneesData = { connect: [{ id: assignedToId }] };
  }

  // Create the task
  const newTask = await context.prisma.task.create({
    data: {
      title,
      description,
      projectId,
      assignees: assigneesData,
      dueDate,
      priority,
      status,
      createdById: validatedCreatedById,
    },
  });

  // Handle labels if provided
  if (labels && labels.length > 0) {
    for (const labelName of labels) {
      // Find or create label
      let label = await context.prisma.label.findFirst({
        where: { name: labelName, projectId },
      });
      
      if (!label) {
        label = await context.prisma.label.create({
          data: {
            name: labelName,
            color: '#2FC285', // Default color
            projectId,
          },
        });
      }

      // Connect label to task
      await context.prisma.task.update({
        where: { id: newTask.id },
        data: { labels: { connect: { id: label.id } } },
      });
    }
  }

  return context.prisma.task.findUnique({
    where: { id: newTask.id },
    include: { 
      assignees: true,
      labels: true,
    },
  });
};
