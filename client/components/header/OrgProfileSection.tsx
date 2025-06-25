import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";

const OrgProfileSection = ({
  orgName,
  setOrgName,
  orgImage,
  setOrgImage,
  logoInputRef,
  setLogoInputRef,
  handleLogoButtonClick,
  handleLogoChange,
  handleSaveChanges,
  isUpdatingOrg,
  isUpdatingImage,
}: any) => (
  <div className="flex flex-col gap-6">
    <div className="flex justify-between items-center">
      <p className="text-[var(--background)] font-semibold text-base">
        Orgazination Profile
      </p>
      <div className="flex items-center gap-4 w-60">
        <Avatar className="h-16 w-16 bg-gray-400 rounded-xl">
          <AvatarImage
            src={orgImage}
            alt="Org Logo"
            className="h-full w-full object-cover rounded-full"
          />
        </Avatar>
        <p className="text-[var(--background)] font-semibold text-base">
          {orgName}
        </p>
      </div>
      <Button
        className="bg-[var(--background)]/1 hover:bg-[var(--background)]/5 text-[#58C4A0]"
        onClick={handleLogoButtonClick}
        disabled={isUpdatingImage}
      >
        {isUpdatingImage ? "Уншиж байна." : "Зураг оруулах"}
      </Button>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={(ref) => setLogoInputRef(ref)}
        onChange={handleLogoChange}
      />
    </div>
    <Separator className="my-3 dark" />
    <div className="flex justify-between items-center">
      <p className="text-[var(--background)] font-semibold text-base">
        Orgazination Name
      </p>
      <div className="flex items-center gap-4 w-70">
        <Input
          id="org-name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          className="text-lg font-medium text-[var(--background)] border-transparent bg-[#101014] p-5 focus-visible:ring-0"
          placeholder={orgName}
        />
      </div>
      <Button
        type="submit"
        variant={"secondary"}
        className="text-[var(--background)] font-semibold"
        onClick={handleSaveChanges}
        disabled={isUpdatingOrg || isUpdatingImage}
      >
        {isUpdatingOrg || isUpdatingImage ? "Хадгалж байна..." : "Хадгалах"}
      </Button>
    </div>
    <Separator className="my-3 dark" />
    <div className="flex justify-cente items-center gap-10">
      <p className="text-[var(--background)] font-semibold text-base">
        Leave orgazination
      </p>
      <Button className="bg-[var(--background)]/1 hover:bg-[var(--background)]/5 text-[var(--destructive)]">
        Organization-оос гарах
      </Button>
    </div>
  </div>
);

export default OrgProfileSection;
