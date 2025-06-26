
import { getTasks } from './queries/Task/getTasks'
import { getTaskById } from './queries/Task/getTaskById'
import { getReviewTasks } from './queries/Task/getReviewTasks'
import { getProjects } from './queries/Project/getProjects'
import { getProjectById } from './queries/Project/getProjectById'
import { getComments } from './queries/Comment/getComments'
import { getLogs } from './queries/Log/getLogs'

import { createTask } from './mutations/Task/createTask'
import { updateTask } from './mutations/Task/updateTask'
import { approveTask } from './mutations/Task/approveTask'
import { assignTask } from './mutations/Task/assignTask'
import { addReviewer } from './mutations/Task/addReviewer'
import { addLabel } from './mutations/Task/addLabel'
import { addDeadline } from './mutations/Task/addDeadline'
import { addComment } from './mutations/Task/addComment'
import { addLog } from './mutations/Task/addLog'
import { uploadFile } from './mutations/Task/uploadFile'
import { createProject } from './mutations/Project/createProject'


export const resolvers = {
  Query: {
    getTasks,
    getTaskById,
    getReviewTasks,
    getProjects,
    getProjectById,
    getComments,
    getLogs,
  },
  Mutation: {
    createTask,
    updateTask,
    approveTask,
    assignTask,
    addReviewer,
    addLabel,
    addDeadline,
    addComment,
    addLog,
    uploadFile,
    createProject,
  },
  Project: {
    createdBy: async (parent: any, _args: any, context: any) => {
      return context.prisma.user.findUnique({ where: { id: parent.createdById } });
    },
    members: async (parent: any, _args: any, context: any) => {
      return context.prisma.project
        .findUnique({ where: { id: parent.id } })
        .members();
    },
    invitations: async (parent: any, _args: any, context: any) => {
      return context.prisma.invitation.findMany({
        where: { projectId: parent.id },
      });
    },
  },
  Comment: {
    author: async (parent: any, _args: any, context: any) => {
      return context.prisma.user.findUnique({ where: { id: parent.authorId } });
    },
  },
  Log: {
    user: async (parent: any, _args: any, context: any) => {
      return context.prisma.user.findUnique({ where: { id: parent.userId } });
    },
  },
  Task: {
    project: async (parent: any, _args: any, context: any) => {
      return context.prisma.project.findUnique({ where: { id: parent.projectId } });
    },
  },
};
