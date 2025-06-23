import { createYoga, createSchema } from 'graphql-yoga';
import { typeDefs } from '@/graphql/typeDefs';
import { resolvers } from '@/graphql/resolvers';
import { NextRequest } from 'next/server';
import { createContext } from '@/context';

const yoga = createYoga<{
  req: NextRequest
}>({
  graphqlEndpoint: '/api/graphql',
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: async ({ request }) => await createContext(request),
cors: {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://remotia-client.vercel.app'],
  credentials: true,
}
});

export const POST = async (req: NextRequest) => {
  return yoga.handleRequest(req, { req });
};

export const GET = async (req: NextRequest) => {
  return yoga.handleRequest(req, { req });
};


