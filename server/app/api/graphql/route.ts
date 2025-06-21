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
    origin: ['http://localhost:3000', 'http://localhost:3002'], 
    credentials: true,
  },
});

export { yoga as GET, yoga as POST, yoga as OPTIONS };
