"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

interface InviteMemberFormProps {
  inviteEmail: string;
  onInviteEmailChange: (email: string) => void;
  onInviteMember: () => void;
  isPending: boolean;
}

export const InviteMemberForm = ({
  inviteEmail,
  onInviteEmailChange,
  onInviteMember,
  isPending,
}: InviteMemberFormProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onInviteMember();
    }
  };

  return (
    <div className="w-full flex flex-col">
      <p className="text-[var(--foreground)] text-base font-medium">
        Шинэ гишүүд урих
      </p>
      <p className="text-[var(--foreground)]/50 text-sm">
        Урих гэж буй гишүүний мэйл хаягийг явуулж урилга илгээх боломжтой.
      </p>
      <Input
        value={inviteEmail}
        onChange={(e) => onInviteEmailChange(e.target.value)}
        placeholder="гишүүн@mail.com"
        className="text-[var(--foreground)] mt-5 bg-transparent border-[var(--foreground)]/20"
        onKeyDown={handleKeyDown}
      />
      <div className="w-full flex justify-end mt-3">
        <Button
          onClick={onInviteMember}
          disabled={isPending}
          className="bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 text-[var(--foreground)] px-8"
        >
          <Mail className="w-4" />
          {isPending ? "Урьж байна..." : "Урих"}
        </Button>
      </div>
    </div>
  );
};
