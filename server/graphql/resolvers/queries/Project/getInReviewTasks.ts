import { prisma } from "@/lib/prisma";

export const getReviewTasksByProject = async (
    _: any,
    args: { projectId: string; userId?: string },
    context: { prisma: any; userId?: string }
) => {
    const { projectId, userId: argUserId } = args;
    const userId = argUserId || context?.userId;
    if (!userId) throw new Error('Unauthorized');

    const project = await context.prisma.project.findUnique({
        where: { id: projectId },
        include: {
            members: true,
        },
    });

    if (!project) throw new Error('Project not found');
    const isMember = project.members.some((m: any) => m.userId === userId);
    if (!isMember && process.env.NODE_ENV === "production") {
        throw new Error("Unauthorized");
    }


    const tasks = await prisma.task.findMany({
        where: {
            projectId,
            status: 'REVIEW',
        },
        include: {
            reviewers: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                },
            },
            assignees: {
                select: {
                    id: true,
                    avatarUrl: true,
                },
            },
            labels: {
                select: {
                    id: true,
                    name: true,
                    color: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return tasks;
}