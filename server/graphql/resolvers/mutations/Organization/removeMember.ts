import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";

interface IContext {
  prisma: PrismaClient;
  userId: string;
}

export const removeMember = async (
  _: any,
  { orgId, memberId }: { orgId: string; memberId: string },
  { prisma, userId }: IContext
) => {
  const actingMembership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: orgId,
      },
    },
  });
  if (!actingMembership || (actingMembership.role !== "ADMIN" && actingMembership.role !== "DIRECTOR")) {
    throw new GraphQLError("You do not have permission to remove members.");
  }
  await prisma.organizationMember.delete({
    where: {
      userId_organizationId: {
        userId: memberId,
        organizationId: orgId,
      },
    },
  });
  return true;
}; 