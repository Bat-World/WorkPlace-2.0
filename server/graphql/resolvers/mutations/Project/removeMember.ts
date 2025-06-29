export const removeMember = async (_: any, { memberId }: { memberId: string }, context: any) => {
  if (!context?.userId) throw new Error('Unauthorized');
  
  // Get the member to be removed
  const member = await context.prisma.projectMember.findUnique({
    where: { id: memberId },
    include: { project: true, user: true }
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
  
  if (!currentUserMember) throw new Error('Only admins can remove members');
  
  // Prevent removing the last admin
  if (member.role === 'ADMIN') {
    const adminCount = await context.prisma.projectMember.count({
      where: {
        projectId: member.projectId,
        role: 'ADMIN'
      }
    });
    
    if (adminCount <= 1) {
      throw new Error('Cannot remove the last admin from the project');
    }
  }
  
  // Remove the member
  const removed = await context.prisma.projectMember.delete({
    where: { id: memberId },
    include: { user: true }
  });
  
  return removed;
}; 