export const createTask = async (_: any, args: any, context: any) => {
  const {
    title,
    description,
    projectId,
    assignedToId,
    dueDate,
    priority,
    status,
    userId: inputUserId,
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

  // Validate that the assigned user exists if assignedToId is provided
  let validatedAssignedToId = assignedToId;
  if (assignedToId) {
    const assignedUser = await context.prisma.user.findUnique({
      where: { id: assignedToId },
    });
    if (!assignedUser) {
      // If the assigned user doesn't exist, set it to null
      validatedAssignedToId = null;
    }
  }

  const newTask = await context.prisma.task.create({
    data: {
      title,
      description,
      projectId,
      assignedToId: validatedAssignedToId,
      dueDate,
      priority,
      status,
      createdById: validatedCreatedById,
    },
  });

  return context.prisma.task.findUnique({
    where: { id: newTask.id },
    include: { assignedTo: true },
  });
};
