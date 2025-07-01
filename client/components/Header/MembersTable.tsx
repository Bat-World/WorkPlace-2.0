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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Crown, ShieldUser, Trash2 } from "lucide-react";

interface MembersTableProps {
  members: any[];
  canManageMembers: boolean;
  onRoleChange: (memberId: string, role: string) => void;
  onRemoveMember: (memberId: string) => void;
  updateMemberRolePending: boolean;
  removeMemberPending: boolean;
}

export const MembersTable = ({
  members,
  canManageMembers,
  onRoleChange,
  onRemoveMember,
  updateMemberRolePending,
  removeMemberPending,
}: MembersTableProps) => {
  if (members?.length === 0) {
    return (
      <TableRow>
        <TableCell
          colSpan={canManageMembers ? 5 : 4}
          className="text-center text-[var(--foreground)]/50"
        ></TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {members?.map((member: any) => (
        <TableRow key={member.id} className="border-[var(--foreground)]/10">
          <TableCell className="text-[var(--foreground)]">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: member.user?.avatarUrl
                    ? `url(${member.user.avatarUrl})`
                    : `url(https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18xbHlXRFppb2JyNjAwQUtVZVFEb1NsckVtb00iLCJyaWQiOiJvcmdfMnlPbDNOWHdQV2tIQ25pM1VxSFhETVkzcnExIiwiaW5pdGlhbHMiOiI0In0?width=80)`,
                }}
              />
              {member.user?.name || "Unknown User"}
            </div>
          </TableCell>
          <TableCell className="text-[var(--foreground)]/70">
            {member.user?.email || "No email"}
          </TableCell>
          <TableCell>
            {canManageMembers ? (
              <Select
                value={member.role}
                onValueChange={(value) => onRoleChange(member.id, value)}
                disabled={updateMemberRolePending}
              >
                <SelectTrigger className="w-32 bg-transparent border-[var(--foreground)]/20 text-[var(--foreground)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark bg-[#191D21]">
                  <SelectItem
                    value="ADMIN"
                    className="text-[var(--foreground)]"
                  >
                    <ShieldUser />
                    Админ
                  </SelectItem>
                  <SelectItem
                    value="MEMBER"
                    className="text-[var(--foreground)]"
                  >
                    Гишүүн
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className="text-[var(--foreground)]">
                {member.role === "ADMIN" ? "Admin" : "Member"}
              </span>
            )}
          </TableCell>
          {canManageMembers && (
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveMember(member.id)}
                disabled={removeMemberPending}
                className="text-[var(--destructive)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );
};
