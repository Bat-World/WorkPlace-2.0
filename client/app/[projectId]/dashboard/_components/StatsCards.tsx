'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, FolderKanban, ListChecks, Clock3 } from "lucide-react";
import { DashboardStatsCardsProps } from "@/lib/types";
import { FolderDot } from "lucide-react";
import { CheckCircle } from "lucide-react";


export const DashboardStatsCards = ({
  totalTasks,
  inProgressTasks,
  reviewReadyTasks,
  doneTasks,
}: DashboardStatsCardsProps) => {
  const cards = [
    {
      label: "Нийт таскууд",
      value: totalTasks,
      icon: <ListChecks className="w-5 h-5" />,
    },
    {
      label: "Хийгдэж буй таскууд",
      value: inProgressTasks,
      icon: <Clock3 className="w-5 h-5" />,
    },
    {
      label: "Шалгуурхад бэлэн",
      value: reviewReadyTasks,
      icon: <FolderKanban className="w-5 h-5" />,
    },
    {
      label: "Дууссан таскууд",
      value: doneTasks,
      icon: <CheckCircle className="w-5 h-5" />,
    },
  ];


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[37px] w-full mt-6">
      {cards.map((card, idx) => (
        <Card key={idx}           className="w-[296px] h-[148px] bg-[#141318] border border-[#2A2A2A] flex flex-col justify-between py-3">
          <CardContent className="flex flex-col gap-0">
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-3 text-[18px]">
                <FolderDot className="text-white" />
                <div className="text-white text-[16px] font-medium">{card.label}</div>
              </div>

              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                <ArrowUpRight className="text-black w-4 h-4" />
              </div>

            </div>
            <div className="text-[48px] text-[#FFFFFF]" style={{ fontFamily: "var(--font-unbounded)" }}>
              {card.value}
            </div>

            <div className="text-[12px] text-white/50">Энэ сар (May 2025)</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
