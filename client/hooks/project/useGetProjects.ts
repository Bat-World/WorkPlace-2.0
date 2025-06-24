import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

export const useGetProjects = (orgId?: string) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  return useQuery({
    queryKey: ["projects", orgId],
    queryFn: async () => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not loaded or not signed in");
      }

      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            query GetProjectsWithTasks($orgId: ID) {
              getProjects(orgId: $orgId) {
                id
                title
                description
                createdAt
                tasks {
                  id
                  title
                  assignedTo {
                    id
                    name
                    email
                    avatarUrl
                  }
                  reviewers {
                    id
                    name
                    email
                    avatarUrl
                  }
                }
              }
            }
          `,
          variables: { orgId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
        }
      );

      console.log("GraphQL response:", res.data);

      return res.data.data.getProjects;
    },
    enabled: !!user?.id && !!orgId,
  });
};
