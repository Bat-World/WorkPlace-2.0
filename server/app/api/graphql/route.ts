import { createYoga, createSchema } from 'graphql-yoga';
import { typeDefs } from '@/graphql/typeDefs';
import { resolvers } from '@/graphql/resolvers';
import { NextRequest } from 'next/server';
import { createContext } from '@/context'; 

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: createContext,
  graphqlEndpoint: '/api/graphql',
});

export const POST = async (req: NextRequest) => {
  return yoga.handleRequest(req, {});
};

export const GET = async (req: NextRequest) => {
  return yoga.handleRequest(req, {});
};
