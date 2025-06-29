import { v4 as uuidv4 } from "uuid";
import { sendInviteEmail } from "../../../../src/utils/email";

export const createProject = async (
  _: any,
  args: { input: { title: string; description?: string; invitees?: string[]; userId?: string } },
  context: any
) => {
  const { userId: contextUserId, prisma } = context;
  const { title, description, invitees = [], userId: inputUserId } = args.input;
  
  const userId = contextUserId || inputUserId;
  if (!userId) throw new Error("Unauthorized");

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
      members: {
        include: { user: true }
      },
      createdBy: true,
    },
  });

  return project;
};
