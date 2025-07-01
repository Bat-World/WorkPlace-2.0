import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

export const doneTasksCount = async (_: any, args: { projectId: string, filter?: string }) => {
  const { projectId, filter } = args;

  const where: any = {
    projectId,
    status: "DONE", 
  };

  const now = new Date();

  if (filter === "day") {
    where.doneAt = {
      gte: startOfDay(now),
      lte: endOfDay(now),
    };
  } else if (filter === "week") {
    where.doneAt = {
      gte: startOfWeek(now, { weekStartsOn: 1 }),
      lte: endOfWeek(now, { weekStartsOn: 1 }),
    };
  }

  return prisma.task.count({ where });
};
