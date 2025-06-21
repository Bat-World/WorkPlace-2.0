import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as addTaskDefs } from './task.schema';
import { typeDefs as addOrgDefs } from './org.schema';
import { typeDefs as addProject } from './project.schema';

export const typeDefs = mergeTypeDefs([
addTaskDefs,
addOrgDefs,
addProject
])