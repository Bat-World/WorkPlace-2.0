import { v4 as uuidv4 } from "uuid";
import { sendInviteEmail } from "../../../../src/utils/email";

export const createProject = async (
  _: any,
  args: { input: { title: string; description?: string; invitees?: string[] } },
  context: any
) => {
  const { userId, prisma } = context;
  if (!userId) throw new Error("Unauthorized");

  const { title, description, invitees = [] } = args.input;

  const project = await prisma.project.create({
    data: {
      title,
      description,
      createdById: userId,
      members: {
        create: {
          userId,
          role: "ADMIN",
        },
      },
    },
    include: {
      members: true,
      createdBy: true,
    },
  });


  // Ensure the creator is a member (ADMIN)
  const existingMember = await context.prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId: newProject.id,
      },
    },
  });
  if (!existingMember) {
    await context.prisma.projectMember.create({

      data: {
        email,
        token,
        projectId: project.id,
        invitedById: userId,
      },
    });

  }

  return project;
};
