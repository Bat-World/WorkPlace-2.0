import { PrismaClient, Role } from "@prisma/client";
import { GraphQLError } from "graphql";

interface IContext {
  prisma: PrismaClient;
  userId: string;
}

export const updateMemberRole = async (
  _: any,
  { orgId, memberId, role }: { orgId: string; memberId: string; role: string },
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
    throw new GraphQLError("You do not have permission to update roles.");
  }
  const updated = await prisma.organizationMember.update({
    where: {
      userId_organizationId: {
        userId: memberId,
        organizationId: orgId,
      },
    },
    data: { role: role as Role },
  });
  return updated;
}; 