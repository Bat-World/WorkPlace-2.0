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


  try {
    const project = await prisma.$transaction(async (tx: { project: { create: (arg0: { data: { title: string; description: string | undefined; createdById: any; members: { create: { userId: any; role: string; }; }; }; include: { members: boolean; createdBy: boolean; labels: boolean; }; }) => any; update: (arg0: { where: { id: any; }; data: { labels: { connect: { id: any; }[]; }; }; }) => any; findUnique: (arg0: { where: { id: any; }; include: { labels: boolean; }; }) => any; }; label: { findFirst: (arg0: { where: { name: { equals: string; mode: string; }; }; }) => any; create: (arg0: { data: { name: string; color: string; }; }) => any; }; }) => {
      const project = await tx.project.create({
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
          labels: true, 
        },
      });

      if (labels.length > 0) {
        const labelRecords = await Promise.all(
          labels.map(async (labelName) => {
            console.log(`Searching for label: ${labelName}`); 
            let label = await tx.label.findFirst({
              where: { name: { equals: labelName, mode: "insensitive" } },
            });
            if (!label) {
              console.log(`Creating new label: ${labelName}`); 
              label = await tx.label.create({
                data: { name: labelName, color: "#000000" }, 
              });
              console.log(`Created label ID: ${label.id}`); 
            } else {
              console.log(`Found existing label ID: ${label.id}`); 
            }
            return label;
          })
        );

        console.log("Connecting labels:", labelRecords.map((l) => l.id)); 
        await tx.project.update({
          where: { id: project.id },
          data: {
            labels: {
              connect: labelRecords.map((label) => ({ id: label.id })),
            },
          },
        });

        // Verify the connection
        const updatedProject = await tx.project.findUnique({
          where: { id: project.id },
          include: { labels: true },
        });
        console.log("Updated project labels:", updatedProject?.labels);
      }

      return project;
    });

    // Invite members
    await Promise.all(
      invitees.map(async (email) => {
        const token = uuidv4();

        await prisma.invitation.create({
          data: {
            email,
            projectId: project.id,
            invitedById: userId,
            token,
          },
        });

        await sendInviteEmail(email, token);
      })
    );

    return project;
  } catch (error) {
    console.error("Error in createProject:", error);
    throw new Error("Failed to create project due to an unexpected error.");
  }
};
