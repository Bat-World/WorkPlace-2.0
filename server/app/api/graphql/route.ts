import { createYoga, createSchema } from "graphql-yoga";
import { typeDefs } from "@/graphql/typeDefs";
import { resolvers } from "@/graphql/resolvers";
import { NextRequest } from "next/server";
import { createContext, IContext } from "@/context";

const yoga = createYoga<{
  req: NextRequest;
}>({
  graphqlEndpoint: "/api/graphql",
  schema: createSchema<IContext>({
    typeDefs,
    resolvers,
  }),
  context: async ({ req }) => {
    const customContext = await createContext(req);
    return {
      req,
      ...customContext,
    };
  },
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://remotia-client.vercel.app",
    ],
    credentials: true,
  },
});

export const POST = async (req: NextRequest) => {
  return yoga.handleRequest(req, { req });
};

export const GET = async (req: NextRequest) => {
  return yoga.handleRequest(req, { req });
};

export const OPTIONS = async (req: NextRequest) => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": req.headers.get("origin") || "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id",
      "Access-Control-Allow-Credentials": "true",
    },
  });
};
