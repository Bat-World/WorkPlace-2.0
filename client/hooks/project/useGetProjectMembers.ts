import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

export interface ProjectMember {
  id: string;
  role: string;
  userId: string;
  user: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  };
}

export const useGetProjectMembers = (projectId: string) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: async (): Promise<ProjectMember[]> => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error("User is not authenticated.");
      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            query GetProjectMembers($projectId: ID!, $userId: ID) {
              getProjectMembers(projectId: $projectId, userId: $userId) {
                id
                role
                userId
                user {
                  id
                  email
                  name
                  avatarUrl
                }
              }
            }
          `,
          variables: { projectId, userId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
        }
      );
      return res.data.data.getProjectMembers || [];
    },
    enabled: !!projectId && !!user?.id,
  });
}; 