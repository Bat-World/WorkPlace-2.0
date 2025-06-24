'use client';

import { DashboardCard } from "./_components/DashboardCard";
import { TaskItem } from "./_components/TaskItem";
import { Button } from "@/components/ui/button";
import { ArrowUpRight} from "lucide-react";
import { Chart } from "./_components/Chart";
// import { useState } from "react";

const mockTasks = [
  {
    title: "Marketing Script",
    description: "Swipe marketing project",
    dueDate: "Jan 28",
    status: "Энгийн",
    statusColor: {
      bg: "#201302",
      border: "#372B15",
      text: "#F9D769",
    },
    assignees: [
      {
        name: "shadcn",
        src: "https://github.com/shadcn.png",
        fallback: "CN",
      },
      {
        name: "leerob",
        src: "https://github.com/leerob.png",
        fallback: "LR",
      },
    ],
  },
  {
    title: "Landing Page",
    description: "Design and launch homepage",
    dueDate: "Feb 10",
    status: "Яаралтай",
    statusColor: {
      bg: "#450B2B",
      border: "#5A2241",
      text: "#FCC3EC",
    },
    assignees: [
      {
        name: "vercel",
        src: "https://github.com/vercel.png",
        fallback: "VC",
      },
    ],
  },
  {
    title: "Feature Testing",
    description: "Test all core features before release",
    dueDate: "Feb 18",
    status: "Чухал",
    project: "Tinder",
    statusColor: {
      bg: "#112A46",
      border: "#1C3F60",
      text: "#8BE9FD",
    },
    assignees: [],
  },
];
const dashboardStats = [
  {
    title: "Нийт төслүүд",
    value: 14,
    trend: "+2.3%",
    trendColor: "text-green-400",
    subtitle: "Энэ сар (May 2025)",
  },
  {
    title: "Нийт таскууд",
    value: 34,
    subtitle: "Энэ сар (May 2025)",
  },
  {
    title: "Хийгдэж буй таскууд",
    value: 24,
    subtitle: "Энэ сар (May 2025)",
  },
  {
    title: "Шалгуулахад бэлэн",
    value: 4,
    subtitle: "Энэ сар (May 2025)",
  },
];

export default function DashBoardPage () {
    // const [tasks, setTasks] = useState<TaskType[]>([]);

  //   useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const res = await fetch(" "); 
  //       const data = await res.json();
  //       setTasks(data);
  //     } catch (err) {
  //       console.error("Failed to fetch tasks", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTasks();
  // }, []);

    return( 
      <div className="px-20">
        <div className="flex justify-between items-center my-7">
            <div>
            <h1 className="text-lg text-white/50">Өдрийн мэнд, LETRYKA 👋</h1>
            <h2 className="text-4xl font-bold mt-2 text-white">Dashboard Overview</h2>
            </div>
            <Button variant="secondary" className="rounded-full flex flex-row">
              Тайлан гаргах 
              <ArrowUpRight/>
            </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9">
          {dashboardStats.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              trend={card.trend}
              trendColor={card.trendColor}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-9 my-10 ">
          <div className="col-span-2">
            <Chart/>
          </div>
          <div className="space-y-4 bg-[#141318] border border-[#2A2A2A] rounded-2xl p-5">
            <h3 className="text-lg text-yellow-400 flex flex-row gap-2.5">
              • <p className="text-white">Шалгуулахад бэлэн таскууд</p>
            </h3>
            {mockTasks.map((task, index) => (
              <TaskItem key={index} task={task} />
            ))}
          </div>
        </div>
      </div>
        
    )
}
