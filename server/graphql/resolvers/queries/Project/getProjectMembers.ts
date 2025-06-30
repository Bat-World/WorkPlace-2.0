export const getProjectMembers = async (_: any, args: any, context: any) => {
  const { projectId, userId: argUserId } = args;
  const userId = argUserId || context?.userId;
  
  if (!userId) throw new Error('Unauthorized');
  
  // First check if the project exists
  const project = await context.prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, title: true }
  });
  
  if (!project) throw new Error('Project not found');
  
  // Get all project members with user details
  const members = await context.prisma.projectMember.findMany({
    where: { projectId },
    include: { 
      user: true 
    },
    orderBy: { createdAt: 'asc' }
  });
  
  // Check if current user is a member
  const isMember = members.some((m: any) => m.userId === userId);
  if (!isMember && process.env.NODE_ENV === 'production') {
    throw new Error('Not a member of the project');
  }
  
  return members;
};

export const getPendingInvitations = async (_: any, args: any, context: any) => {
  const { projectId, userId: argUserId } = args;
  const userId = argUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');
  
  // Check if user is admin of the project
  const member = await context.prisma.projectMember.findFirst({
    where: { 
      projectId,
      userId,
      role: 'ADMIN'
    }
  });
  
  if (!member) {
    throw new Error('Only admins can view pending invitations');
  }
  
  const invitations = await context.prisma.invitation.findMany({
    where: { 
      projectId,
      accepted: false
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return invitations;
}; 