import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { sendRequest } from '@/lib/sendRequest'

export const useCreateProject = () => {
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (input: {
      title: string
      description: string
      organizationId: string
    }) => {
      const token = await getToken()
      const res = await sendRequest.post(
        '/api/graphql',
        {
          query: `
            mutation CreateProject($input: CreateProjectInput!) {
              createProject(input: $input) {
                id
                title
              }
            }
          `,
          variables: { input },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return res.data.data.createProject
    },
  })
}
