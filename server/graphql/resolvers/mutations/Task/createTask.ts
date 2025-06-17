export const createTask = async (_: any, { title }: { title: string }) => {
  return { id: Date.now().toString(), title }
}
