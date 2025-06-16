import { getTasks } from './queries/getTasks'
import { createTask } from './mutations/createTask'

export const resolvers = {
  Query: {
    getTasks,
  },
  Mutation: {
    createTask,
  },
}
