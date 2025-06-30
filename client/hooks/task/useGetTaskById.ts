import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

export interface TaskDetail {
  id: string;
  title: string;
  description: string | null;
  body: string | null;
  attachments: string[];
  status: string;
  priority: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignees: Array<{
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
  }>;
  reviewers: Array<{
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
  }>;
  createdBy: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
  };
  project: {
    id: string;
    title: string;
  };
  labels: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

interface GetTaskByIdResponse {
  getTaskById: TaskDetail;
}

interface GraphQLResponse {
  data?: GetTaskByIdResponse;
  errors?: any[];
}

export const useGetTaskById = (taskId: string) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async (): Promise<TaskDetail> => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      const res = await sendRequest.post<GraphQLResponse>(
        "/api/graphql",
        {
          query: `
            query GetTaskById($taskId: ID!, $userId: ID) {
              getTaskById(taskId: $taskId, userId: $userId) {
                id
                title
                description
                body
                attachments
                status
                priority
                dueDate
                createdAt
                updatedAt
                assignees {
                  id
                  email
                  name
                  avatarUrl
                }
                reviewers {
                  id
                  email
                  name
                  avatarUrl
                }
                createdBy {
                  id
                  email
                  name
                  avatarUrl
                }
                project {
                  id
                  title
                }
                labels {
                  id
                  name
                  color
                }
              }
            }
          `,
          variables: {
            taskId,
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
      
      if (!res.data.data) {
        throw new Error(`GraphQL error: ${JSON.stringify(res.data.errors || res.data)}`);
      }

      if (!res.data.data.getTaskById) {
        throw new Error(`getTaskById not found in response: ${JSON.stringify(res.data.data)}`);
      }

      return res.data.data.getTaskById;
    },
    enabled: !!taskId && !!user?.id,
  });
}; 