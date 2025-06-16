import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
  }

  type Query {
    getTasks: [Task!]!
  }

  type Mutation {
    createTask(title: String!): Task!
  }
`
