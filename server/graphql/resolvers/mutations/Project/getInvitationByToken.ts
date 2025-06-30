export const getInvitationByToken = async (
  _: any,
  { token }: { token: string },
  context: any
) => {
  const invitation = await context.prisma.invitation.findUnique({
    where: { token },
    include: {
      project: true,
      invitedBy: true,
    },
  });

  if (!invitation) throw new Error("Invalid invitation token");

  return {
    projectId: invitation.project.id,
    projectTitle: invitation.project.title,
    invitedByEmail: invitation.invitedBy.email,
  };
};
