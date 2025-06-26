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

  type Organization {
    id: ID!
    name: String!
    image: String
    members(skip: Int, take: Int): [User!]!
    projects: [Project!]!
  }

  type Project {
    id: ID!
    title: String!
    description: String
    tasks(skip: Int, take: Int): [Task!]!
    organization: Organization!
    createdAt: DateTime!
    updatedAt: DateTime!
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
    success: Boolean!
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
    organizationId: ID!
    userId: ID
  }

  input CreateOrganizationInput {
    name: String!
    userId: ID
  }

  input InviteMemberInput {
    orgId: ID!
    email: String!
    userId: ID
  }

  input AcceptInviteInput {
    token: String!
    userId: ID
  }

  input UpdateOrganizationImageInput {
    orgId: ID!
    image: String!
  }

  type Query {
    getTasks(userId: ID): [Task!]!
    getTaskById(taskId: ID!, userId: ID): Task
    getReviewTasks(orgId: ID!, skip: Int, take: Int, userId: ID): [Task!]!
    getProjects(userId: ID): [Project!]!
    getProjectById(projectId: ID!, skip: Int, take: Int, userId: ID): Project
    getOrganizations(userId: ID): [Organization!]!
    getOrganizationById(orgId: ID!, skip: Int, take: Int, userId: ID): Organization
    getMembersByOrgId(orgId: ID!, skip: Int, take: Int, userId: ID): [User!]!
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
    createOrganization(input: CreateOrganizationInput!): Organization!
    inviteMember(input: InviteMemberInput!): InviteResult!
    acceptInvite(input: AcceptInviteInput!): AcceptInviteResult!
    updateOrganizationImage(input: UpdateOrganizationImageInput!): Organization!
  }
`; 