import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Mail, Calendar, Shield, Trash2 } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const MembersTab = ({
  membersData,
  isLoading,
  orgId,
  updateMemberRole,
  removeMember,
  isRemovingMember,
  isUpdatingRole,
  invitations,
  isInvitationsLoading,
  inviteEmail,
  setInviteEmail,
  handleInviteUser,
  isInviting,
}: any) => (
  <div className="space-y-6">
    <Tabs defaultValue="members" className="w-full">
      <TabsList className="w-full bg-[#101014] dark">
        <TabsTrigger value="members" className="dark ">
          <User className="w-4 h-4" />
          Members ({membersData.length})
        </TabsTrigger>
        <TabsTrigger value="invitations">
          <Mail className="w-4 h-4" />
          Invitations ({invitations.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="members" className="mt-6">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500 border border-gray-700 rounded-lg bg-gray-800">
            Loading members...
          </div>
        ) : (
          <div className="space-y-3">
            {membersData.map((member: any) => (
              <div key={member.id} className="p-4 px-6 bg-[#101014] rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                    </Avatar>
                    <div className="flex gap-18">
                      <div className="flex flex-col ml-2">
                        <div className="font-medium text-gray-100">{member.name}</div>
                        <div className="text-sm text-gray-400">{member.email}</div>
                      </div>
                      <p className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        Joined {member.joinedAt || member.joined}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      value={member.role}
                      onValueChange={(value) =>
                        updateMemberRole({ orgId, memberId: member.id, role: value })
                      }
                    >
                      <SelectTrigger className="text-gray-100 border-[#3D3C41] bg-[#141318] mr-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark">
                        <SelectItem value="ADMIN">
                          <div className="flex items-center gap-2">
                            <Shield className="w-3 h-3 text-purple-400" />
                            Admin
                          </div>
                        </SelectItem>
                        <SelectItem value="MEMBER">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-gray-400" />
                            Member
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => removeMember({ orgId, memberId: member.id })}
                      className="h-8 text-[var(--background)]/50 border-red-700 hover:bg-red-900/20 hover:text-red-300"
                      disabled={isRemovingMember}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="invitations" className="mt-6">
        <div className="space-y-4 p-4 bg-[#101014] rounded-2xl">
          <Label htmlFor="invite-email" className="text-[var(--background)] font-semibold">
            Invite New Member
          </Label>
          <div className="flex gap-2 mt-6">
            <Input
              id="invite-email"
              placeholder="user@example.com"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 bg-[#141318] border-[#3D3C41] text-[var(--background)]"
            />
            <Button
              type="button"
              onClick={handleInviteUser}
              variant={"secondary"}
              className="text-[var(--background)] font-semibold px-9"
              disabled={!inviteEmail || !inviteEmail.includes("@") || isInviting}
            >
              {isInviting ? "Урьж байна..." : "Урих"}
            </Button>
          </div>
          {isInvitationsLoading ? (
            <div className="text-center py-8 bg-[#101014] text-[var(--background)]/50 rounded-3xl">
              Уншиж байна...
            </div>
          ) : invitations.length > 0 ? (
            <div className="space-y-3">
              {invitations.map((invite: any) => (
                <div key={invite.id} className="p-4 bg-[#101014] text-[var(--background)]/50 rounded-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-100">{invite.email}</div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-700">
                          {invite.accepted ? "Accepted" : "Pending"}
                        </span>
                        <span className="text-xs text-gray-500">
                          Invited on {invite.createdAt ? new Date(invite.createdAt).toLocaleDateString() : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-[#101014] text-[var(--background)]/50 rounded-3xl">
              <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" strokeWidth={1} />
              <p>Урилга байхгүй байна</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export default MembersTab; 