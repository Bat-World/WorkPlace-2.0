import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignedTo: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
  } | null;
  project: {
    id: string;
    title: string;
  };
}

interface GetTasksByProjectResponse {
  getTasks: Task[];
}

export const useGetTasksByProject = (projectId: string) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async (): Promise<Task[]> => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      const res = await sendRequest.post<{ data: GetTasksByProjectResponse }>(
        "/api/graphql",
        {
          query: `
            query GetTasksByProject($projectId: ID!, $userId: ID) {
              getTasks(userId: $userId, projectId: $projectId) {
                id
                title
                description
                status
                priority
                dueDate
                createdAt
                updatedAt
                assignedTo {
                  id
                  email
                  name
                  avatarUrl
                }
                project {
                  id
                  title
                }
              }
            }
          `,
          variables: {
            projectId,
            userId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
        }
      );

      return res.data.data.getTasks;
    },
    enabled: !!projectId && !!user?.id,
  });
}; 