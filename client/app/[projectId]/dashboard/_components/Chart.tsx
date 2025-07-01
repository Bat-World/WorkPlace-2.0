"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "May 1", value: 5 },
  { name: "May 2", value: 10 },
  { name: "May 3", value: 7 },
  { name: "May 4", value: 12 },
  { name: "May 5", value: 9 },
  { name: "May 6", value: 14 },
  { name: "May 7", value: 20 },
];

export default function ClosedTasksAreaChart() {
  return (
    <Card className="bg-[#141318] text-white rounded-2xl border border-[#2a2a2e]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Хаагдсан таскууд</CardTitle>
        <p className="text-sm text-muted-foreground">Өмнөх сараас 12% өссөн байна</p>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              stroke="#8884d8"
              tick={{ fill: '#cbd5e1', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#8884d8"
              tick={{ fill: '#cbd5e1', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f1f1f",
                border: "none",
                borderRadius: "8px",
                boxShadow: "none",
              }}
              cursor={{ stroke: "#4ade80", strokeWidth: 1 }}
              labelStyle={{ color: "#ccc", fontSize: "0.75rem" }}
              itemStyle={{ color: "#4ade80", fontSize: "0.75rem" }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#4ade80"
              fillOpacity={1}
              strokeWidth={2}
              fill="url(#colorUv)"
              dot={false}
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

  );
}
