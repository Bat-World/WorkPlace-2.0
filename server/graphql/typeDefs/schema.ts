import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime

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
  tasks(skip: Int, take: Int): [Task!]!
  createdAt: DateTime!
  updatedAt: DateTime!
  createdBy: User!       
  members: [User!]       
invitations: [Invitation!]
}

  type Task {
    id: ID!
    title: String!
    description: String
    status: String
    priority: String
    dueDate: DateTime
    project: Project!
    assignedTo: User
    reviewers: [User!]
    comments(skip: Int, take: Int): [Comment!]
    logs: [Log!]
    labels: [Label!]
    createdAt: DateTime!
    updatedAt: DateTime!
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
    projectId: ID!
    assignedToId: ID
    dueDate: DateTime
    priority: String
    userId: ID
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: String
    dueDate: DateTime
    priority: String
    assignedToId: ID
    userId: ID
  }

input CreateProjectInput {
  title: String!
  description: String
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
    getComments(taskId: ID!, skip: Int, take: Int, userId: ID): [Comment!]!
    getLogs(taskId: ID!, userId: ID): [Log!]!
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(taskId: ID!, input: UpdateTaskInput!): Task!
    approveTask(taskId: ID!, userId: ID): Task!
    assignTask(taskId: ID!, userId: ID!, actingUserId: ID): Task!
    addReviewer(taskId: ID!, userId: ID!, actingUserId: ID): Task!
    addLabel(
      taskId: ID!
      labelId: ID
      labelName: String
      labelColor: String
      actingUserId: ID!
    ): Task!
    addDeadline(taskId: ID!, dueDate: DateTime!, actingUserId: ID): Task!
    addComment(taskId: ID!, content: String!, actingUserId: ID): Comment!
    addLog(taskId: ID!, message: String!, actingUserId: ID): Log!
    uploadFile(taskId: ID!, fileUrl: String!, actingUserId: ID): FileUploadResult!
    createProject(input: CreateProjectInput!): Project!
    inviteMember(input: InviteMemberInput!): Invitation!
   acceptInvite(input: AcceptInviteInput!): AcceptInvitationResult!

  }
`; 