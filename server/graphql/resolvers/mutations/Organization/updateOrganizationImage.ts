export const updateOrganizationImage = async (_: any, args: any, context: any) => {
  const { orgId, image } = args.input;
  if (!context?.userId) throw new Error('Unauthorized');

  // Fetch org and check if user is owner (ADMIN)
  const org = await context.prisma.organization.findUnique({
    where: { id: orgId },
  });
  if (!org) throw new Error('Organization not found');
  if (org.ownerId !== context.userId) throw new Error('Only ADMIN can update organization image');

  // Update image
  const updatedOrg = await context.prisma.organization.update({
    where: { id: orgId },
    data: { image },
  });
  return updatedOrg;
}; 