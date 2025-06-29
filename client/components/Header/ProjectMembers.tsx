"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { sendRequest } from "@/lib/sendRequest";
import { toast } from "react-toastify";
import { useGetPendingInvitations } from "@/hooks/project/useGetPendingInvitations";
import { useResendInvitation } from "@/hooks/project/useResendInvitation";
import { useCancelInvitation } from "@/hooks/project/useCancelInvitation";
import { MembersTable } from "./MembersTable";
import { PendingInvitationsTable } from "./PendingInvitationsTable";
import { InviteMemberForm } from "./InviteMemberForm";

interface ProjectMembersProps {
  currentProject: any;
  projectId: string;
  queryClient: any;
}

export const ProjectMembers = ({
  currentProject,
  projectId,
  queryClient,
}: ProjectMembersProps) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [inviteEmail, setInviteEmail] = useState("");

  const inviteMember = useMutation({
    mutationFn: async (email: string) => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error("User is not signed in");

      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
          mutation InviteMember($input: InviteMemberInput!) {
            inviteMember(input: $input) {
              id
              email
              token
              accepted
              createdAt
            }
          }
        `,
          variables: { input: { projectId, email } },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
          },
        }
      );
      return res.data.data.inviteMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({
        queryKey: ["pendingInvitations", projectId],
      });
      toast.success("Invitation sent successfully!");
    },
  });

  const updateMemberRole = useMutation({
    mutationFn: async ({
      memberId,
      role,
    }: {
      memberId: string;
      role: string;
    }) => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error("User is not signed in");

      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
          mutation UpdateMemberRole($memberId: ID!, $role: String!) {
            updateMemberRole(memberId: $memberId, role: $role) {
              id
              role
              userId
              user {
                id
                name
                email
                avatarUrl
              }
            }
          }
        `,
          variables: { memberId, role },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
          },
        }
      );
      return res.data.data.updateMemberRole;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success("Member role updated successfully!");
    },
  });

  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const token = await getToken();
      const userId = user?.id;
      if (!userId) throw new Error("User is not signed in");

      const res = await sendRequest.post(
        "/api/graphql",
        {
          query: `
          mutation RemoveMember($memberId: ID!) {
            removeMember(memberId: $memberId) {
              id
            }
          }
        `,
          variables: { memberId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
          },
        }
      );
      return res.data.data.removeMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success("Member removed successfully!");
    },
  });

  const currentUserRole =
    currentProject?.members?.find((m: any) => m.user?.id === user?.id)?.role ||
    "MEMBER";
  const canManageMembers = currentUserRole === "ADMIN";

  const { data: pendingInvitations, isLoading: loadingInvitations } =
    useGetPendingInvitations({ projectId });
  const resendInvitation = useResendInvitation({ projectId });
  const cancelInvitation = useCancelInvitation({ projectId });

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    try {
      await inviteMember.mutateAsync(inviteEmail);
      setInviteEmail("");
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Failed to send invitation");
    }
  };

  const handleRoleChange = async (memberId: string, role: string) => {
    try {
      await updateMemberRole.mutateAsync({ memberId, role });
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update member role");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      try {
        await removeMember.mutateAsync(memberId);
      } catch (error) {
        console.error("Error removing member:", error);
        toast.error("Failed to remove member");
      }
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      await resendInvitation.mutateAsync(invitationId);
      toast.success("Invitation resent successfully!");
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast.error("Failed to resend invitation");
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (confirm("Are you sure you want to cancel this invitation?")) {
      try {
        await cancelInvitation.mutateAsync(invitationId);
        toast.success("Invitation cancelled successfully!");
      } catch (error) {
        console.error("Error cancelling invitation:", error);
        toast.error("Failed to cancel invitation");
      }
    }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="bg-[var(--foreground)]/5">
            <TabsTrigger value="members" className="text-[var(--foreground)]">
              Гишүүд
            </TabsTrigger>
            <TabsTrigger
              value="invitation"
              className="text-[var(--foreground)]"
            >
              Урилга
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-6">
            <Table>
              <TableHeader>
                <TableRow className="border-[var(--foreground)]/10">
                  <TableHead className="text-[var(--foreground)]">
                    Профайл
                  </TableHead>
                  <TableHead className="text-[var(--foreground)]">
                    Имэйл
                  </TableHead>
                  <TableHead className="text-[var(--foreground)]">
                    Role
                  </TableHead>
                  {canManageMembers && (
                    <TableHead className="text-[var(--foreground)]"></TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                <MembersTable
                  members={currentProject?.members || []}
                  canManageMembers={canManageMembers}
                  onRoleChange={handleRoleChange}
                  onRemoveMember={handleRemoveMember}
                  updateMemberRolePending={updateMemberRole.isPending}
                  removeMemberPending={removeMember.isPending}
                />
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="invitation" className="mt-6">
            <div className="w-full flex flex-col gap-8">
              <InviteMemberForm
                inviteEmail={inviteEmail}
                onInviteEmailChange={setInviteEmail}
                onInviteMember={handleInviteMember}
                isPending={inviteMember.isPending}
              />

              {canManageMembers && (
                <div className="w-full flex flex-col">
                  <p className="text-[var(--foreground)] text-base font-medium mb-4">
                    Хүлээгдэж буй урилгууд
                  </p>
                  <PendingInvitationsTable
                    pendingInvitations={pendingInvitations || []}
                    loadingInvitations={loadingInvitations}
                    onResendInvitation={handleResendInvitation}
                    onCancelInvitation={handleCancelInvitation}
                    resendInvitationPending={resendInvitation.isPending}
                    cancelInvitationPending={cancelInvitation.isPending}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
