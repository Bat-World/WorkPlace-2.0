"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useState } from "react";
import { OrgDropdown } from "@/components/header/OrgDropdown";
import { UserProfileMenu } from "@/components/header/UserProfileMenu";
import { Home, Folder, ListChecks, Calendar } from "lucide-react";

export const DashBoardHeader = () => {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const orgId = params?.orgId as string;
  const projectId = params?.projectId as string;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Нүүр", href: `/${orgId}/dashboard` },
    { id: "projects", label: "Төслүүд", href: `/${orgId}/projects` },
    ...(projectId
      ? [
          {
            id: "tasks",
            label: "Таскууд",
            href: `/${orgId}/${projectId}/tasks`,
          },
        ]
      : []),
    { id: "calendar", label: "Календар", href: `/${orgId}/calendar` },
  ].map((item) => ({
    ...item,
    isActive:
      pathname === item.href ||
      (item.id === "tasks" && pathname.includes("/tasks")) ||
      (item.id === "projects" && pathname.includes("/projects")) ||
      (item.id === "dashboard" && pathname.endsWith("/dashboard")) ||
      (item.id === "calendar" && pathname.includes("/calendar")),
  }));

  return (
    <div className="w-full border-[#252429] border-b-1 flex flex-wrap justify-between items-center py-3 px-4 md:px-10 lg:px-28 xl:px-32 gap-y-2 relative">
      <div className="flex gap-8 items-center w-60 min-w-[150px]">
        <p className="text-[var(--background)] text-xl">Remotia</p>
        <OrgDropdown orgId={orgId} />
      </div>
      <nav className="hidden lg:flex justify-center items-center gap-2 md:gap-4 bg-transparent rounded-lg p-1 overflow-x-auto scrollbar-hide min-w-0 flex-1 md:flex-none">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(item.href)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-colors text-sm whitespace-nowrap ${
              item.isActive
                ? "bg-gradient-to-r from-[#141318] to-[#25252b] border border-[#1c1b22] text-white"
                : "text-[#A5A5A9] hover:bg-[#18181C] hover:text-white"
            }`}
          >
            {item.id === "dashboard" && <Home className="w-4 h-4" />}
            {item.id === "projects" && <Folder className="w-4 h-4" />}
            {item.id === "tasks" && <ListChecks className="w-4 h-4" />}
            {item.id === "calendar" && <Calendar className="w-4 h-4" />}
            {item.label}
          </div>
        ))}
      </nav>
      <button
        className="lg:hidden flex items-center justify-center p-2 rounded-full hover:bg-[#18181C] transition-colors ml-2"
        onClick={() => setMobileNavOpen((v) => !v)}
        aria-label="Open navigation menu"
      >
        <span className="w-7 h-7 text-[#A5A5A9]">☰</span>
      </button>
      {mobileNavOpen && (
        <div className="absolute top-full left-0 w-full z-50 bg-[#18181C] border-b border-[#252429] flex flex-col lg:hidden animate-fade-in">
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setMobileNavOpen(false);
                router.push(item.href);
              }}
              className={`flex items-center gap-2 px-6 py-3 cursor-pointer transition-colors text-base border-b border-[#23232A] last:border-b-0 ${
                item.isActive
                  ? "bg-gradient-to-r from-[#141318] to-[#25252b] text-white"
                  : "text-[#A5A5A9] hover:bg-[#23232A] hover:text-white"
              }`}
            >
              {item.id === "dashboard" && <Home className="w-4 h-4" />}
              {item.id === "projects" && <Folder className="w-4 h-4" />}
              {item.id === "tasks" && <ListChecks className="w-4 h-4" />}
              {item.id === "calendar" && <Calendar className="w-4 h-4" />}
              {item.label}
            </div>
          ))}
        </div>
      )}
      <div className="w-60 min-w-[150px] hidden justify-end lg:flex">
        <UserProfileMenu user={user} />
      </div>
    </div>
  );
};
