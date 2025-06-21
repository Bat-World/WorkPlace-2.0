import { getTasks } from './queries/getTasks'
import { createTask } from './mutations/Task/createTask'
import { createProject } from './mutations/Project/createProject'


export const resolvers = {
  Query: {
    getTasks,
  },
  Mutation: {
    createTask,
    createProject
  },
}
