import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";

interface IContext {
  prisma: PrismaClient;
  userId: string;
}

export const updateOrganization = async (
  _: any,
  { orgId, name }: { orgId: string; name: string },
  { prisma, userId }: IContext
) => {
  if (!userId) {
    throw new GraphQLError("Unauthorized", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
  }
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: userId,
        organizationId: orgId,
      },
    },
  });
  if (!membership) {
    throw new GraphQLError("You are not a member of this organization.", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }
  try {
    const updatedOrganization = await prisma.organization.update({
      where: { id: orgId },
      data: { name },
    });
    return updatedOrganization;
  } catch (error) {
    throw new GraphQLError("Failed to update organization.", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
}; 