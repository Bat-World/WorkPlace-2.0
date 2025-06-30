import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import { sendInviteEmail } from '../../../../src/utils/email';

interface IContext {
  prisma: PrismaClient;
  userId: string;
}

export const inviteMember = async (
  _: any,
  { input }: { input: { projectId: string; email: string } },
  { prisma, userId }: IContext
) => {
  try {
    // Check if user is admin of the project
    const membership = await prisma.projectMember.findFirst({
      where: {
        userId,
        projectId: input.projectId,
        role: 'ADMIN',
      },
    });

    if (!membership) {
      throw new GraphQLError('You do not have permission to invite members.');
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findFirst({
      where: {
        projectId: input.projectId,
        user: {
          email: input.email,
        },
      },
    });

    if (existingMember) {
      throw new GraphQLError('User is already a member of this project.');
    }

    // Check if there's already a pending invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email: input.email,
        projectId: input.projectId,
        accepted: false,
      },
    });

    if (existingInvitation) {
      throw new GraphQLError('An invitation has already been sent to this email.');
    }

    const token = uuidv4();

    const invitation = await prisma.invitation.create({
      data: {
        email: input.email,
        projectId: input.projectId,
        invitedById: userId,
        token,
      },
    });

    // Send email invitation
    try {
      await sendInviteEmail(input.email, token);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Delete the invitation if email fails
      await prisma.invitation.delete({
        where: { id: invitation.id },
      });
      throw new GraphQLError('Failed to send invitation email. Please try again.');
    }

    return invitation;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    console.error('Invite member error:', error);
    throw new GraphQLError('Failed to send invitation. Please try again.');
  }
};

export const resendInvitation = async (
  _: any,
  args: { invitationId: string },
  context: any
) => {
  const { userId, prisma } = context;
  const { invitationId } = args;

  if (!userId) throw new Error("Unauthorized");

  // Get the invitation
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { project: true }
  });

  if (!invitation) {
    throw new Error('Invitation not found');
  }

  // Check if user is admin of the project
  const member = await prisma.projectMember.findFirst({
    where: { 
      projectId: invitation.projectId,
      userId,
      role: 'ADMIN'
    }
  });

  if (!member) {
    throw new Error('Only admins can resend invitations');
  }

  if (invitation.accepted) {
    throw new Error('Invitation has already been accepted');
  }

  // Generate new token
  const newToken = uuidv4();

  // Update invitation with new token
  const updatedInvitation = await prisma.invitation.update({
    where: { id: invitationId },
    data: { token: newToken }
  });

  // Send email with new token
  await sendInviteEmail(invitation.email, newToken);

  return updatedInvitation;
};

export const cancelInvitation = async (
  _: any,
  args: { invitationId: string },
  context: any
) => {
  const { userId, prisma } = context;
  const { invitationId } = args;

  if (!userId) throw new Error("Unauthorized");

  // Get the invitation
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { project: true }
  });

  if (!invitation) {
    throw new Error('Invitation not found');
  }

  // Check if user is admin of the project
  const member = await prisma.projectMember.findFirst({
    where: { 
      projectId: invitation.projectId,
      userId,
      role: 'ADMIN'
    }
  });

  if (!member) {
    throw new Error('Only admins can cancel invitations');
  }

  if (invitation.accepted) {
    throw new Error('Cannot cancel an accepted invitation');
  }

  // Delete the invitation
  await prisma.invitation.delete({
    where: { id: invitationId }
  });

  return true;
};
