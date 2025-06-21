import { getTasks } from './queries/getTasks'
import { createTask } from './mutations/Task/createTask'


export const resolvers = {
  Query: {
    getTasks,
  },
  Mutation: {
    createTask,
  },
}
