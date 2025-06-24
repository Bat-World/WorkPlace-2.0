import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";

interface IContext {
  prisma: PrismaClient;
  userId: string;
}

export const acceptInvite = async (
  _: any,
  { input }: { input: { token: string } },
  { prisma, userId }: IContext
) => {
  const invitation = await prisma.invitation.findUnique({
    where: { token: input.token },
    select: {
      id: true,
      accepted: true,
      organizationId: true,
    },
  });
  if (!invitation || invitation.accepted) {
    throw new GraphQLError("Invalid or already accepted invitation.");
  }
  await prisma.organizationMember.create({
    data: {
      userId,
      organizationId: invitation.organizationId,
      role: "MEMBER",
    },
  });
  const updatedInvitation = await prisma.invitation.update({
    where: { id: invitation.id },
    data: { accepted: true, acceptedAt: new Date() },
  });
  return updatedInvitation;
};
