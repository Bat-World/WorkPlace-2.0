import { v4 as uuidv4 } from 'uuid';
import { sendInviteEmail } from '../../../../src/utils/email';

export const inviteMember = async (_: any, args: any, context: any) => {
  const { orgId, email, userId: inputUserId } = args.input;
  const userId = inputUserId || context?.userId;
  if (!userId) throw new Error('Unauthorized');

  // Check if user is ADMIN of org (pseudo-code, adjust as needed)
  const org = await context.prisma.organization.findUnique({
    where: { id: orgId },
    include: { owner: true },
  });
  if (!org || org.ownerId !== userId) throw new Error('Only ADMIN can invite');

  // Create invitation
  const token = uuidv4();
  await context.prisma.invitation.create({
    data: {
      email,
      organizationId: orgId,
      invitedById: userId,
      token,
    },
  });

  // Send email with token
  await sendInviteEmail(email, token);

  return { success: true };
}; 