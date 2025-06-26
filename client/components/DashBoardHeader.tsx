"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  FolderDot,
  House,
  LogOut,
  PackageCheck,
  Plus,
  Settings,
  UserRound,
  Menu,
} from "lucide-react";
import { useState } from "react";

export const DashBoardHeader = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Нүүр", icon: House, href: "/dashboard" },
    { id: "projects", label: "Төслүүд", icon: FolderDot, href: "/projects" },
    { id: "tasks", label: "Таскууд", icon: PackageCheck, href: "/tasks" },
    { id: "calendar", label: "Календар", icon: Calendar, href: "/calendar" },
  ].map((item) => ({
    ...item,
    isActive:
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href)),
  }));

  return (
    <div className="w-full border-[#252429] flex flex-wrap justify-between items-center py-3 px-4 md:px-10 lg:px-28 xl:px-32 gap-y-2 relative">
      <div className="flex gap-8 items-center w-60 min-w-[150px]">
        <p className="text-[var(--background)] text-xl">Remotia</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex gap-3 bg-transparent py-5 text-base text-[var(--background)] border-none hover:bg-transparent hover:text-[var(--background)] focus-visible:ring-0"
            >
              <div
                className="w-6 h-auto aspect-square bg-cover bg-center rounded-sm"
                style={{
                  backgroundImage: `url(https://yt3.googleusercontent.com/ytc/AIdro_ncrXPzrg5_WVvTEx_w3El2dorNHS7r9AMO8Mph8l7Z_dU=s900-c-k-c0x00ffffff-no-rj)`,
                }}
              />
              Tinder
              <ChevronDown className="stroke-[var(--background)]/50 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 bg-[#141318] text-[var(--foreground)] border-[#2A2A2A] dark"
            align="start"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center">
                <div
                  className="w-5 h-auto aspect-square bg-cover bg-center rounded-sm"
                  style={{
                    backgroundImage: `url(https://yt3.googleusercontent.com/ytc/AIdro_ncrXPzrg5_WVvTEx_w3El2dorNHS7r9AMO8Mph8l7Z_dU=s900-c-k-c0x00ffffff-no-rj)`,
                  }}
                />
                <div className="flex flex-col ml-1">
                  Tinder
                  <p className="text-[var(--foreground)]/50 text-[12px] -mt-1">
                    Админ
                  </p>
                </div>
                <DropdownMenuShortcut>
                  <div className="flex gap-1 items-center px-2 py-1 border-1 border-[#2A2A2A] rounded-lg text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-all group cursor-pointer">
                    <Settings className="group-hover:stroke-[var(--foreground)] w-[14px]! transition-all" />
                    <p className="text-sm tracking-normal font-medium">Засах</p>
                  </div>
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="group">
              <div
                className="w-5 h-auto aspect-square bg-cover bg-center rounded-sm"
                style={{
                  backgroundImage: `url(https://yt3.googleusercontent.com/ytc/AIdro_ncrXPzrg5_WVvTEx_w3El2dorNHS7r9AMO8Mph8l7Z_dU=s900-c-k-c0x00ffffff-no-rj)`,
                }}
              />
              Other org
              <DropdownMenuShortcut>
                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-all" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[var(--foreground)]/50 hover:text-[var(--foreground)] group transition-all">
              <div className="w-6 h-6 rounded-full bg-[#2A2A2A] flex justify-center items-center border-1 border-dashed">
                <Plus className="w-3! group-hover:stroke-[var(--foreground)] transition-all" />
              </div>
              Org үүсгэх
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* nav */}
      <nav className="hidden lg:flex justify-center items-center gap-2 md:gap-4 bg-transparent rounded-lg p-1 overflow-x-auto scrollbar-hide min-w-0 flex-1 md:flex-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-colors text-sm whitespace-nowrap
                ${
                  item.isActive
                    ? "bg-gradient-to-r from-[#141318] to-[#25252b] border border-[#1c1b22] text-white"
                    : "text-[#A5A5A9] hover:bg-[#18181C] hover:text-white"
                }`}
            >
              <Icon strokeWidth={1.5} className="w-5" /> {item.label}
            </div>
          );
        })}
      </nav>
      {/* Responsive */}
      <button
        className="lg:hidden flex items-center justify-center p-2 rounded-full hover:bg-[#18181C] transition-colors ml-2"
        onClick={() => setMobileNavOpen((v) => !v)}
        aria-label="Open navigation menu"
      >
        <Menu className="w-7 h-7 text-[#A5A5A9]" />
      </button>
      {/* Responsive dropdown */}
      {mobileNavOpen && (
        <div className="absolute top-full left-0 w-full z-50 bg-[#18181C] border-b border-[#252429] flex flex-col lg:hidden animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setMobileNavOpen(false);
                  router.push(item.href);
                }}
                className={`flex items-center gap-2 px-6 py-3 cursor-pointer transition-colors text-base border-b border-[#23232A] last:border-b-0
                  ${
                    item.isActive
                      ? "bg-gradient-to-r from-[#141318] to-[#25252b] text-white"
                      : "text-[#A5A5A9] hover:bg-[#23232A] hover:text-white"
                  }`}
              >
                <Icon strokeWidth={1.5} className="w-5" /> {item.label}
              </div>
            );
          })}
        </div>
      )}
      <div className="w-60 min-w-[150px] hidden justify-end lg:flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex gap-2 items-center border border-[#26282A] py-2 px-3 rounded-full">
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="text-[var(--background)]">Brookie</p>
              <ChevronDown className="stroke-[var(--background)]/50 w-5 ml-6 cursor-pointer" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-[#141318] text-[var(--foreground)] border-[#2A2A2A] dark"
            align="end"
          >
            <DropdownMenuItem className="flex items-center text-[var(--foreground)]/50 hover:text-[var(--foreground)]/50 transition-all">
              <UserRound />
              Гарах
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center text-[var(--foreground)]/50 hover:text-[var(--foreground)]/50 transition-all">
              <LogOut />
              Гарах
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
