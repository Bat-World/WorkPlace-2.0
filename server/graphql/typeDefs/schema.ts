import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime

  enum TaskStatus {
    TODO
    DOING
    REVIEW
    APPROVED
    DONE
  }

  enum Priority {
    LOW
    MEDIUM
    HIGH
  }

  enum Role {
    ADMIN
    MEMBER
    DIRECTOR
  }

  enum ProjectStatus {
    NOT_STARTED
    IN_PROGRESS
    REVIEW
    APPROVED
    DONE
  }

  type User {
    id: ID!
    email: String!
    name: String
    avatarUrl: String
    role: String
  }

type Project {
  id: ID!
  title: String!
  description: String
  avatarUrl: String
  tasks(skip: Int, take: Int): [Task!]
  createdAt: DateTime!
  updatedAt: DateTime!
  createdBy: User!
  members: [ProjectMember!]!
  invitations: [Invitation!]
}

type ProjectMember {
  id: ID!
  role: String!
  userId: ID!
  user: User
}



  type Task {
    id: ID!
    title: String!
    description: String
    body: String
    attachments: [String!]!
    status: TaskStatus!
    priority: Priority!
    dueDate: String
    createdAt: String!
    updatedAt: String!
    project: Project!
    createdBy: User!
    assignees: [User!]!
    reviewers: [User!]!
    labels: [Label!]!
    comments: [Comment!]!
    logs: [Log!]!
  }


type Invitation {
  id: String!
  email: String!
  token: String!
  accepted: Boolean!
  createdAt: String!
}

  type Comment {
    id: ID!
    content: String!
    author: User!
    createdAt: DateTime!
    parentId: ID
    replies: [Comment!]
    likes: [CommentLike!]
    likeCount: Int!
    isLikedByUser: Boolean!
  }

  type CommentLike {
    id: ID!
    user: User!
    comment: Comment!
    createdAt: DateTime!
  }

  type Log {
    id: ID!
    message: String!
    user: User!
    createdAt: DateTime!
  }

  type Label {
    id: ID!
    name: String!
    color: String!
  }

  type InviteResult {
    success: Boolean!
  }

  type AcceptInviteResult {
    message: String!
    projectId: String!
  }

  type FileUploadResult {
    success: Boolean!
    fileUrl: String!
  }

  input CreateTaskInput {
    title: String!
    description: String
    body: String
    attachments: [String!]
    projectId: ID!
    assigneeIds: [ID!]
    dueDate: DateTime
    priority: String
    status: String
    userId: ID
    labels: [String!]
  }

  input UpdateTaskInput {
    title: String
    description: String
    body: String
    attachments: [String!]
    status: String
    dueDate: DateTime
    priority: String
    assigneeIds: [ID!]
    userId: ID
  }

input CreateProjectInput {
  title: String!
  description: String
  invitees: [String!]
  userId: ID
}



input InviteMemberInput {
  projectId: String!
  email: String!
}

type AcceptInviteResult {
  message: String!
  projectId: String!
}



input AcceptInviteInput {
  token: String!
}
  


  type Query {
    getTasks(userId: ID, projectId: ID): [Task!]!
    getTaskById(taskId: ID!, userId: ID): Task
    getReviewTasks(orgId: ID!, skip: Int, take: Int, userId: ID): [Task!]!
    getProjects(userId: ID): [Project!]!
    getProjectById(projectId: ID!, skip: Int, take: Int, userId: ID): Project
    getProjectMembers(projectId: ID!, userId: ID): [ProjectMember!]!
    getPendingInvitations(projectId: ID!, userId: ID): [Invitation!]!
    getComments(taskId: ID!, skip: Int, take: Int, userId: ID): [Comment!]!
    getLogs(taskId: ID!, userId: ID): [Log!]!
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(taskId: ID!, input: UpdateTaskInput!): Task!
    deleteTask(taskId: ID!, userId: ID): Task!
    approveTask(taskId: ID!, userId: ID): Task!
    assignTask(taskId: ID!, userId: ID!, actingUserId: ID): Task!
    manageAssignees(taskId: ID!, assigneeIds: [ID!]!, actingUserId: ID): Task!
    addReviewer(taskId: ID!, userId: ID!, actingUserId: ID): Task!
    manageReviewers(taskId: ID!, reviewerIds: [ID!]!, actingUserId: ID): Task!
    addLabel(
      taskId: ID!
      labelId: ID
      labelName: String
      labelColor: String
      actingUserId: ID!
    ): Task!
    addDeadline(taskId: ID!, dueDate: DateTime!, actingUserId: ID): Task!
    addComment(taskId: ID!, content: String!, actingUserId: ID, parentId: ID): Comment!
    likeComment(commentId: ID!, actingUserId: ID): CommentLike!
    unlikeComment(commentId: ID!, actingUserId: ID): Boolean!
    addLog(taskId: ID!, message: String!, actingUserId: ID): Log!
    uploadFile(taskId: ID!, fileUrl: String!, actingUserId: ID): FileUploadResult!
    createProject(input: CreateProjectInput!): Project!
    updateProject(projectId: ID!, title: String!): Project!
    inviteMember(input: InviteMemberInput!): Invitation!
    acceptInvite(input: AcceptInviteInput!): AcceptInviteResult!
    updateProjectAvatar(projectId: ID!, avatarUrl: String!): Project!
    updateMemberRole(memberId: ID!, role: String!): ProjectMember!
    removeMember(memberId: ID!): ProjectMember!
    declineInvite(input: AcceptInviteInput!): AcceptInviteResult!
    resendInvitation(invitationId: ID!): Invitation!
    cancelInvitation(invitationId: ID!): Boolean!
  }
`; 