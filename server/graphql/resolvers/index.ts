// Queries
import { getTasks } from './queries/Task/getTasks'
import { getTaskById } from './queries/Task/getTaskById'
import { getReviewTasks } from './queries/Task/getReviewTasks'
import { getProjects } from './queries/Project/getProjects'
import { getProjectById } from './queries/Project/getProjectById'
import { getOrganizations } from './queries/Organization/getOrganizations'
import { getOrganizationById } from './queries/Organization/getOrganizationById'
import { getMembersByOrgId } from './queries/Organization/getMembersByOrgId'
import { getComments } from './queries/Comment/getComments'
import { getLogs } from './queries/Log/getLogs'

// Mutations
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
import { createOrganization } from './mutations/Organization/createOrganization'
import { inviteMember } from './mutations/Organization/inviteMember'
import { acceptInvite } from './mutations/Organization/acceptInvite'
import { updateOrganizationImage } from './mutations/Organization/updateOrganizationImage'

export const resolvers = {
  Query: {
    getTasks,
    getTaskById,
    getReviewTasks,
    getProjects,
    getProjectById,
    getOrganizations,
    getOrganizationById,
    getMembersByOrgId,
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
    createOrganization,
    inviteMember,
    acceptInvite,
    updateOrganizationImage,
  },
  Organization: {
    members: async (
      parent: { id: string },
      args: { skip?: number; take?: number },
      context: any
    ) => {
      return (
        (await context.prisma.organization
          .findUnique({ where: { id: parent.id } })
          ?.members({
            skip: args?.skip || 0,
            take: args?.take || 10,
          })) || []
      );
    },
  },
  Project: {
    organization: async (parent: { organizationId: string }, _args: any, context: any) => {
      return context.prisma.organization.findUnique({ where: { id: parent.organizationId } });
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
}
