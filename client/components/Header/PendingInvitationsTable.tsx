"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, RefreshCw } from "lucide-react";
import { formatInvitationDate } from "@/utils/DateFormatter";

interface PendingInvitationsTableProps {
  pendingInvitations: any[];
  loadingInvitations: boolean;
  onResendInvitation: (invitationId: string) => void;
  onCancelInvitation: (invitationId: string) => void;
  resendInvitationPending: boolean;
  cancelInvitationPending: boolean;
}

export const PendingInvitationsTable = ({
  pendingInvitations,
  loadingInvitations,
  onResendInvitation,
  onCancelInvitation,
  resendInvitationPending,
  cancelInvitationPending,
}: PendingInvitationsTableProps) => {
  if (loadingInvitations) {
    return (
      <p className="text-[var(--foreground)]/50 text-sm">
        Loading pending invitations...
      </p>
    );
  }

  if (pendingInvitations?.length === 0) {
    return (
      <p className="text-[var(--foreground)]/50 text-sm">
        Урилга илгээгдээгүй байна.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-[var(--foreground)]/10">
          <TableHead className="text-[var(--foreground)]">Имэйл</TableHead>
          <TableHead className="text-[var(--foreground)]">Цаг</TableHead>
          <TableHead className="text-[var(--foreground)]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingInvitations?.map((invitation: any) => (
          <TableRow
            key={invitation.id}
            className="border-[var(--foreground)]/10"
          >
            <TableCell className="text-[var(--foreground)]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <p>{invitation.email} </p>
              </div>
            </TableCell>
            <TableCell className="text-[var(--foreground)]/70">
              {formatInvitationDate(invitation.createdAt)}
            </TableCell>
            <TableCell>
              <div className="flex gap-2 justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onResendInvitation(invitation.id)}
                  disabled={resendInvitationPending}
                  className="text-[var(--foreground)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/10"
                >
                  <RefreshCw className="h-4 w-4" />
                  {resendInvitationPending
                    ? "Явуулж байна..."
                    : "Дахин явуулах"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCancelInvitation(invitation.id)}
                  disabled={cancelInvitationPending}
                  className="text-[var(--destructive)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
