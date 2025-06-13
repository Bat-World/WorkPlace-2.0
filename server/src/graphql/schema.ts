import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import path from 'path';

const typesArray = loadFilesSync(path.join(__dirname, './typeDefs'), { extensions: ['graphql'] });
const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'), { extensions: ['ts'] });

export const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs(typesArray),
  resolvers: resolversArray,
});
