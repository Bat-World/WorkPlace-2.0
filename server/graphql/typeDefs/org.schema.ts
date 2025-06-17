import { gql } from 'graphql-tag';

export const typeDefs = gql`
type Org {
  id: ID!
  name: String!
  description: String
}


  type Mutation {
    createOrg(name: String!, userId: String!): Org!
  }
`;
