"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, FolderDot } from "lucide-react";

type Props = {
  title: string;
  value: number;
  subtitle?: string;
  trend?: string;
  trendColor?: string;
};

export const DashboardCard = ({ title, value, subtitle, trend, trendColor }: Props) => {
  return (
    <Card className="min-w-[290px] bg-[#141318] border-[#2A2A2A] hover:bg-[#18181C] transition-colors duration-200 cursor-pointer">
      <CardContent className="flex flex-row justify-between">
        <div>
          <p className="text-lg text-white flex flex-row gap-2 items-center font-unbounded">
          <FolderDot className="w-4.5"/>
          {title}
          </p>
          <div className="text-5xl font-bold flex gap-2 items-center mt-2 text-white">
            {value}
            {trend && <span className={`${trendColor} text-sm`}>{trend}</span>}
          </div>
          {subtitle && <p className="text-xs text-white/60 mt-1">{subtitle}</p>}
        </div>
        <div className="w-8 h-8 bg-white flex items-center justify-center rounded-full -mt-2"><ArrowUpRight className="text-black"/></div>
      </CardContent>
    </Card>
  );
}
