import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Building, UsersRound } from "lucide-react";
import { useUpdateOrganization } from "@/hooks/project/useUpdateOrganization";
import { useUpdateOrganizationImage } from "@/hooks/project/useUpdateOrganizationImage";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { useParams } from "next/navigation";
import { useGetMembersByOrgId } from "@/hooks/project/useGetMembersByOrgId";
import { useUpdateMemberRole } from "@/hooks/project/useUpdateMemberRole";
import { useRemoveMember } from "@/hooks/project/useRemoveMember";
import { useInviteMember } from "@/hooks/project/useInviteMember";
import { useGetInvitationsByOrgId } from "@/hooks/project/useGetInvitationsByOrgId";
import SidebarNav from "./SidebarNav";
import MembersTab from "./MembersTab";
import OrgProfileSection from "./OrgProfileSection";

const sidebarItems = [
  { id: "profile", label: "General", icon: Building },
  { id: "members", label: "Members", icon: UsersRound },
];

const ManageOrg = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [orgName, setOrgName] = useState("");
  const [orgImage, setOrgImage] = useState<string>("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [logoInputRef, setLogoInputRef] = useState<HTMLInputElement | null>(
    null
  );

  const params = useParams();
  const orgId = (params?.orgId as string) || "mock-org-id";

  const { mutate: updateOrg, isPending: isUpdatingOrg } =
    useUpdateOrganization();
  const { mutate: updateOrgImage, isPending: isUpdatingImage } =
    useUpdateOrganizationImage();
  const { data: membersData = [], isLoading: isMembersLoading } =
    useGetMembersByOrgId(orgId);
  const { mutate: updateMemberRole, isPending: isUpdatingRole } =
    useUpdateMemberRole();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember();
  const { mutate: inviteMember, isPending: isInviting } = useInviteMember();
  const { data: invitations = [], isLoading: isInvitationsLoading } =
    useGetInvitationsByOrgId(orgId);

  const handleInviteUser = () => {
    if (inviteEmail && inviteEmail.includes("@")) {
      inviteMember({ orgId, email: inviteEmail });
      setInviteEmail("");
    }
  };

  const handleLogoButtonClick = () => {
    logoInputRef?.click();
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadToCloudinary(file);
        setOrgImage(url);
      } catch (err) {
        alert("Image upload failed");
      }
    }
  };

  const handleSaveChanges = () => {
    if (!orgId) return;
    if (orgName) {
      updateOrg({ orgId, name: orgName });
    }
    if (orgImage) {
      updateOrgImage({ orgId, image: orgImage });
    }
  };

  return (
    <div className="dark">
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center gap-1 px-3 py-1 rounded-sm bg-[var(--background)]/30 cursor-pointer my-2">
            <Settings className="!w-3.5" />
            <p className="text-xs font-semibold tracking-normal">Manage</p>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[55rem] max-h-[90rem] overflow-hidden bg-[#141318] border-[#3D3C41] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-gray-100">
              Organization
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Manage your organization
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-6 mt-4 h-[600px]">
            <SidebarNav
              items={sidebarItems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <div className="flex-1 overflow-auto">
              {activeTab === "members" && (
                <MembersTab
                  membersData={membersData}
                  isLoading={isMembersLoading}
                  orgId={orgId}
                  updateMemberRole={updateMemberRole}
                  removeMember={removeMember}
                  isRemovingMember={isRemovingMember}
                  isUpdatingRole={isUpdatingRole}
                  invitations={invitations}
                  isInvitationsLoading={isInvitationsLoading}
                  inviteEmail={inviteEmail}
                  setInviteEmail={setInviteEmail}
                  handleInviteUser={handleInviteUser}
                  isInviting={isInviting}
                />
              )}

              {activeTab === "profile" && (
                <OrgProfileSection
                  orgName={orgName}
                  setOrgName={setOrgName}
                  orgImage={orgImage}
                  setOrgImage={setOrgImage}
                  logoInputRef={logoInputRef}
                  setLogoInputRef={setLogoInputRef}
                  handleLogoButtonClick={handleLogoButtonClick}
                  handleLogoChange={handleLogoChange}
                  handleSaveChanges={handleSaveChanges}
                  isUpdatingOrg={isUpdatingOrg}
                  isUpdatingImage={isUpdatingImage}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageOrg;
