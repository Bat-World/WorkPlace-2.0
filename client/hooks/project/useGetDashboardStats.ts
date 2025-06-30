import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

export const useGetDashboardStats = (projectId: string) => {
    const { getToken } = useAuth();
    const { user } = useUser();

    return useQuery({
    queryFn: async () => {
  const token = await getToken();
  const userId = user?.id;

  if (!userId) throw new Error("User is not loaded or not signed in");

  const res = await sendRequest.post(
    "/api/graphql",
    {
      query: `
        query GetDashboardStats($projectId: String!) {
          getDashboardStats(projectId: $projectId) {
            totalTasks
            inProgressTasks
            reviewReadyTasks
          }
        }
      `,
      variables: { projectId },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
    }
  );

  return res.data.data.getDashboardStats;
},
queryKey: ["stats", projectId],
enabled: !!user?.id && !!projectId,

    });
};
