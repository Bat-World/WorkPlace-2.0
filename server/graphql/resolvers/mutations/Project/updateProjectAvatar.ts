export const updateProjectAvatar = async (_: any, { projectId, avatarUrl }: { projectId: string, avatarUrl: string }, context: any) => {
  if (!context?.userId) throw new Error('Unauthorized');
  // Optionally: check if user is a member/admin of the project
  const updated = await context.prisma.project.update({
    where: { id: projectId },
    data: { avatarUrl },
  });
  return updated;
}; 