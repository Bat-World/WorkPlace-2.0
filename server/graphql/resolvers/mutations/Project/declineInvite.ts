export const declineInvite = async (_: any, { token }: { token: string }, context: any) => {
  // Optionally: check if user is signed in
  const invitation = await context.prisma.invitation.findUnique({ where: { token } });
  if (!invitation) throw new Error('Invitation not found or already handled');
  if (invitation.accepted) throw new Error('Invitation already accepted');

  // You can either delete or mark as declined. Here, we'll delete:
  await context.prisma.invitation.delete({ where: { token } });

  return {
    message: 'Invitation declined',
    projectId: invitation.projectId,
  };
}; 