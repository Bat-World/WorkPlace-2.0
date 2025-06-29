export const updateProject = async (_: any, { projectId, title }: { projectId: string, title: string }, context: any) => {
  if (!context?.userId) throw new Error('Unauthorized');
  
  const updated = await context.prisma.project.update({
    where: { id: projectId },
    data: { title },
  });
  return updated;
}; 