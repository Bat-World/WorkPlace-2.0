'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, FolderKanban, ListChecks, Clock3 } from "lucide-react";

interface DashboardStatsCardsProps {
  totalTasks: number;
  inProgressTasks: number;
  reviewReadyTasks: number;
}

export const DashboardStatsCards = ({
  totalTasks,
  inProgressTasks,
  reviewReadyTasks,
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
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mt-6">
      {cards.map((card, idx) => (
        <Card key={idx} className="bg-[#141318] border border-[#2A2A2A] p-5">
          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="text-white text-sm font-medium">{card.label}</div>
              <ArrowUpRight className="text-white/40 w-4 h-4" />
            </div>
            <div className="text-4xl font-unbounded text-white">{card.value}</div>
            <div className="text-xs text-white/50">Энэ сар (May 2025)</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
