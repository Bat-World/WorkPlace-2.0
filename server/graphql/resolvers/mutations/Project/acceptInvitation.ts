export const acceptInvitation = async (_: any, args: any, context: any) => {
  const { token } = args.input;
  const userId = context.userId;

  if (!userId) throw new Error("Unauthorized");

  const invitation = await context.prisma.invitation.findUnique({
    where: { token },
    include: { project: true },
  });

  if (!invitation) throw new Error("Invalid or expired invitation");
  if (invitation.accepted) throw new Error("Invitation already accepted");

  const user = await context.prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  await context.prisma.invitation.update({
    where: { token },
    data: {
      accepted: true,
      acceptedAt: new Date(),
    },
  });

  await context.prisma.projectMember.create({
    data: {
      userId,
      projectId: invitation.projectId,
      role: 'MEMBER', 
    },
  });

  return {
    message: "Invitation accepted and project joined successfully",
    projectId: invitation.projectId,
  };
};
