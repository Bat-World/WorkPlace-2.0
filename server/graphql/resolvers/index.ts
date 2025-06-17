import { getTasks } from './queries/getTasks'
import { createTask } from './mutations/Task/createTask'
import { createOrg } from './mutations/Organization/createOrg'

export const resolvers = {
  Query: {
    getTasks,
  },
  Mutation: {
    createTask,
    createOrg
  },
}
