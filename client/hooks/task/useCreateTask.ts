import { useMutation } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";

interface CreateTaskInput {
  title: string;
  description?: string;
  projectId: string;
  assignedToId?: string;
  dueDate?: Date;
  priority?: string;
}

export const useCreateTask = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const token = await getToken();
      const userId = user?.id;

      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      let dueDate = input.dueDate;
      if (typeof dueDate === "string" && dueDate) {
        dueDate = new Date(dueDate);
      }

      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
            mutation CreateTask($input: CreateTaskInput!) {
              createTask(input: $input) {
                id
                title
                description
                dueDate
                priority
                createdAt
              }
            }
          `,
          variables: {
            input: {
              ...input,
              dueDate: dueDate || undefined,
              userId, 
            },
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

      return res.data.data.createTask;
    },
  });
};
