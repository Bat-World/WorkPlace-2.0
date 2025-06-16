import { createYoga, createSchema } from 'graphql-yoga'
import { typeDefs } from '@/graphql/typeDefs'
import { resolvers } from '@/graphql/resolvers'
import { createContext } from '@/context'

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: '/api/graphql',
  context: createContext,
})

export { yoga as GET, yoga as POST }
