import { getTasks } from './queries/Task/getTasks'
import { getTaskById } from './queries/Task/getTaskById'
import { getReviewTasks } from './queries/Task/getReviewTasks'
import { getProjects } from './queries/Project/getProjects'
import { getProjectById } from './queries/Project/getProjectById'
import { getProjectMembers } from './queries/Project/getProjectMembers'
import { getPendingInvitations } from './queries/Project/getProjectMembers'
import { getComments } from './queries/Comment/getComments'
import { getLogs } from './queries/Log/getLogs'
import { getDashboardStats } from './queries/Project/getDashboardStats'
import { getReviewTasksByProject } from './queries/Project/getInReviewTasks'
import { doneTasksCount } from './queries/Task/getDoneTaksCount'

import { createTask } from './mutations/Task/createTask'
import { updateTask } from './mutations/Task/updateTask'
import { deleteTask } from './mutations/Task/deleteTask'
import { approveTask } from './mutations/Task/approveTask'
import { assignTask } from './mutations/Task/assignTask'
import { addReviewer } from './mutations/Task/addReviewer'
import { manageReviewers } from './mutations/Task/manageReviewers'
import { addLabel } from './mutations/Task/addLabel'
import { addDeadline } from './mutations/Task/addDeadline'
import { addComment } from './mutations/Task/addComment'
import { likeComment } from './mutations/Task/likeComment'
import { unlikeComment } from './mutations/Task/unlikeComment'
import { addLog } from './mutations/Task/addLog'
import { uploadFile } from './mutations/Task/uploadFile'
import { createProject } from './mutations/Project/createProject'
import { inviteMember } from './mutations/Project/inviteMembers'
import { resendInvitation } from './mutations/Project/inviteMembers'
import { cancelInvitation } from './mutations/Project/inviteMembers'
import { acceptInvitation as acceptInvite } from './mutations/Project/acceptInvitation'
import { updateProjectAvatar } from './mutations/Project/updateProjectAvatar'
import { updateProject } from './mutations/Project/updateProject'
import { updateMemberRole } from './mutations/Project/updateMemberRole'
import { removeMember } from './mutations/Project/removeMember'
import { declineInvite } from './mutations/Project/declineInvite'
import { manageAssignees } from './mutations/Task/manageAssignees'
import { getInvitationByToken } from './mutations/Project/getInvitationByToken'


export const resolvers = {
  Query: {
    getTasks,
    getTaskById,
    getReviewTasks,
    getProjects,
    getProjectById,
    getProjectMembers,
    getPendingInvitations,
    getComments,
    getLogs,
    getInvitationByToken,
    getDashboardStats,
    getReviewTasksByProject,
    doneTasksCount
  },
  Mutation: {
    createTask,
    updateTask,
    deleteTask,
    approveTask,
    assignTask,
    addReviewer,
    manageReviewers,
    addLabel,
    addDeadline,
    addComment,
    likeComment,
    unlikeComment,
    addLog,
    uploadFile,
    createProject,
    updateProject,
    inviteMember,
    resendInvitation,
    cancelInvitation,
    acceptInvite,
    updateProjectAvatar,
    updateMemberRole,
    removeMember,
    declineInvite,
    manageAssignees,
  },
  Project: {
    createdBy: async (parent: any, _args: any, context: any) => {
      return context.prisma.user.findUnique({ where: { id: parent.createdById } });
    },
    members: async (parent: any, _args: any, context: any) => {
      return context.prisma.projectMember.findMany({
        where: { projectId: parent.id },
        include: { user: true }
      });
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
    createdBy: async (parent: any, _args: any, context: any) => {
      return context.prisma.user.findUnique({ where: { id: parent.createdById } });
    },
  },
};
