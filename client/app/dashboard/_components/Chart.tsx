"use client";
import { useState } from "react";
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartDataMap = {
  "24H": [
    { date: "10AM", tasks: 2 },
    { date: "12PM", tasks: 4 },
    { date: "2PM", tasks: 3 },
    { date: "4PM", tasks: 6 },
    { date: "6PM", tasks: 5 },
    { date: "8PM", tasks: 7 },
    { date: "10PM", tasks: 9 },
  ],
  "1W": [
    { date: "Mon", tasks: 5 },
    { date: "Tue", tasks: 7 },
    { date: "Wed", tasks: 6 },
    { date: "Thu", tasks: 8 },
    { date: "Fri", tasks: 9 },
    { date: "Sat", tasks: 11 },
    { date: "Sun", tasks: 12 },
  ],
  "1M": Array.from({ length: 12 }, (_, i) => ({
    date: `May ${i + 1}`,
    tasks: Math.floor(Math.random() * 20) + 1,
  })),
  "1Y": [
    { date: "Jan", tasks: 32 },
    { date: "Feb", tasks: 28 },
    { date: "Mar", tasks: 45 },
    { date: "Apr", tasks: 50 },
    { date: "May", tasks: 38 },
    { date: "Jun", tasks: 44 },
    { date: "Jul", tasks: 55 },
    { date: "Aug", tasks: 63 },
    { date: "Sep", tasks: 48 },
    { date: "Oct", tasks: 51 },
    { date: "Nov", tasks: 47 },
    { date: "Dec", tasks: 60 },
  ],
  "ALL": [
    { date: "2022", tasks: 120 },
    { date: "2023", tasks: 305 },
    { date: "2024", tasks: 420 },
    { date: "2025", tasks: 275 },
  ],
};

const timeRangeLabels: Record<string, string> = {
  "24H": "24 цагаар",
  "1W": "7 хоногоор",
  "1M": "1 сараар",
  "1Y": "1 жилээр",
  "ALL": "Бүгд",
};

const timeRanges = ["24H", "1W", "1M", "1Y", "ALL"] as const;
type TimeRange = (typeof timeRanges)[number];

export const Chart = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1W");

  const chartData = chartDataMap[selectedRange];
  const label = timeRangeLabels[selectedRange];

  return (
    <Card className="bg-[#141318] text-white border-[#2A2A2A] rounded-2xl px-6 pb-4">
      <div className="flex flex-row justify-between pt-6">
        <div>
          <CardTitle className="text-white text-xl font-semibold">
            Хаагдсан таскууд
          </CardTitle>
          <p className="text-sm text-white/60 mt-1">
            Өмнөх сараас <span className="text-green-400">12%</span> өссөн байна
          </p>
        </div>
        <div className="flex items-center justify-between gap-7">
          <div className="flex gap-5 text-sm text-white/60">
            {timeRanges.map((range) => (
              <span
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`cursor-pointer ${
                  selectedRange === range ? "text-green-400 font-semibold" : ""
                }`}
              >
                {range}
              </span>
            ))}
          </div>
          <div className="bg-[#1E1E1E] text-white text-sm px-5 py-2.5 rounded-full bg-gradient-to-r from-[#141318] to-[#25252b] border border-[#1c1b22]">
            {label}
          </div>
        </div>
      </div>

      <CardContent className="h-[280px] mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: "white", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f1f" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1E1E1E", border: "none" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
            />
            <Area
              type="monotone"
              dataKey="tasks"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#colorTasks)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
