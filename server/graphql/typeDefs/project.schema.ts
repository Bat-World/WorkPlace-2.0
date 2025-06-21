

export const typeDefs = `#graphql
  type Project {
    id: ID!
    title: String!
    description: String
    createdAt: String!
    updatedAt: String!
  }

  input CreateProjectInput {
    title: String!
    description: String
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project!
  }
`;
