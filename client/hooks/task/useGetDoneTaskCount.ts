import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

export const useDoneTasksCount = (projectId: string, filter?: "day" | "week") => {
  const { user } = useUser();
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["doneTasksCount", projectId, filter],
    queryFn: async (): Promise<number> => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) throw new Error("User not authenticated");

      const res = await sendRequest.post<{ data: { doneTasksCount: number } }>(
        "/api/graphql",
        {
          query: `
            query DoneTasksCount($projectId: String!, $filter: String) {
              doneTasksCount(projectId: $projectId, filter: $filter)
            }
          `,
          variables: {
            projectId,
            filter,
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

      return res.data.data.doneTasksCount;
    },
    enabled: !!projectId && !!user?.id,
  });
};
