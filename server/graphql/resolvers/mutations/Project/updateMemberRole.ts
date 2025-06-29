export const updateMemberRole = async (_: any, { memberId, role }: { memberId: string, role: string }, context: any) => {
  if (!context?.userId) throw new Error('Unauthorized');
  
  // Check if user is admin of the project
  const member = await context.prisma.projectMember.findUnique({
    where: { id: memberId },
    include: { project: true }
  });
  
  if (!member) throw new Error('Member not found');
  
  // Check if current user is admin of the project
  const currentUserMember = await context.prisma.projectMember.findFirst({
    where: {
      projectId: member.projectId,
      userId: context.userId,
      role: 'ADMIN'
    }
  });
  
  if (!currentUserMember) throw new Error('Only admins can update member roles');
  
  // Update the member role
  const updated = await context.prisma.projectMember.update({
    where: { id: memberId },
    data: { role },
    include: { user: true }
  });
  
  return updated;
}; 