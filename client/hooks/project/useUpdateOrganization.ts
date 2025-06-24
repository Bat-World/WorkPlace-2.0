import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendRequest } from "@/lib/sendRequest";
import { useAuth, useUser } from "@clerk/nextjs";

export const useUpdateOrganization = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, name }: { orgId: string; name: string }) => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error("User is not loaded or not signed in");
      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            mutation UpdateOrganization($orgId: ID!, $name: String!) {
              updateOrganization(orgId: $orgId, name: $name) {
                id
                name
              }
            }
          `,
          variables: { orgId, name },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
        }
      );
      return res.data.data.updateOrganization;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organizations", user?.id] });

      const previousOrgs = queryClient.getQueryData<any[]>(["organizations", user?.id]);
      if (previousOrgs) {
        const newOrgs = previousOrgs.map(org => 
          org.id === variables.orgId ? { ...org, name: variables.name } : org
        );
        queryClient.setQueryData(["organizations", user?.id], newOrgs);
      }
      
      alert("Organization name updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update organization:", error);
      alert(`Failed to update organization: ${error.message}`);
    },
  });
}; 