export const acceptInvite = async (_: any, args: any, context: any) => {
  const { token, userId: inputUserId } = args.input;
  const userId = inputUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Find invitation
  const invite = await context.prisma.invitation.findUnique({
    where: { token },
  });
  if (!invite || invite.accepted) throw new Error('Invalid or already accepted invitation');

  // Add user to org
  await context.prisma.organization.update({
    where: { id: invite.organizationId },
    data: { members: { connect: { id: userId } } },
  });

  // Mark invitation as accepted
  await context.prisma.invitation.update({
    where: { token },
    data: { accepted: true, acceptedAt: new Date() },
  });

  return { success: true };
}; 