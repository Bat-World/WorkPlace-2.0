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
  { input }: { input: { orgId: string; email: string } },
  { prisma, userId }: IContext
) => {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: input.orgId,
      },
    },
  });
  if (!membership || (membership.role !== 'ADMIN' && membership.role !== 'DIRECTOR')) {
    throw new GraphQLError('You do not have permission to invite members.');
  }
  const token = uuidv4();
  const invitation = await prisma.invitation.create({
    data: {
      email: input.email,
      organizationId: input.orgId,
      invitedById: userId,
      token,
    },
  });
  await sendInviteEmail(input.email, token);
  return invitation;
}; 