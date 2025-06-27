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
  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId: input.projectId,
      },
    },
  });

  if (!membership || membership.role !== 'ADMIN') {
    throw new GraphQLError('You do not have permission to invite members.');
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

  await sendInviteEmail(input.email, token);

  return invitation;
};

