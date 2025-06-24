import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

export const useGetOrganizations = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  return useQuery({
    queryKey: ["organizations", user?.id],
    queryFn: async () => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error("User is not loaded or not signed in");
      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            query GetOrganizations($userId: ID) {
              getOrganizations(userId: $userId) {
                id
                name
                image
              }
            }
          `,
          variables: { userId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
        }
      );
      return res.data.data.getOrganizations;
    },
    enabled: !!user?.id,
  });
}; 