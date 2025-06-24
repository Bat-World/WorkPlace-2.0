import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

export const UserProfileMenu = ({ user }: { user: any }) => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-2 items-center border border-[#26282A] py-2 px-3 rounded-full">
          <Avatar className="cursor-pointer">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
            <AvatarFallback>
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <p className="text-[var(--background)]">{user?.fullName || "User"}</p>
          <ChevronDown className="stroke-[var(--background)]/50 w-5 ml-6 cursor-pointer" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-[#141318] text-[var(--foreground)] border-[#2A2A2A] dark"
        align="end"
      >
        <DropdownMenuItem className="flex items-center text-[var(--foreground)]/50 hover:text-[var(--foreground)]/50 transition-all">
          <UserRound className="mr-2 h-4 w-4" />
          Профайл
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center text-[var(--foreground)]/50 hover:text-[var(--foreground)]/50 transition-all"
          onClick={() => router.push("/sign-out")}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Гарах
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
