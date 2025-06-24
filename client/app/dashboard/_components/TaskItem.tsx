'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock3 } from "lucide-react";

type AssigneeType = {
  name: string;
  src: string;
  fallback: string;
};

export type TaskType = {
  title: string;
  description: string;
  dueDate: string;
  status?: string;
  statusColor?: {
    bg: string;
    border: string;
    text: string;
  };
  assignees: AssigneeType[];
  project?: string;
};

type TaskItemProps = {
  task: TaskType;
};

export const TaskItem = ({ task }: TaskItemProps) => {
  return (
    <Card className="bg-[#141318] border-[#2A2A2A] text-white hover:bg-[#18181C]">
      <CardContent className="flex flex-row justify-between">
        <div className="flex flex-col justify-between gap-4">
          <div>
            <h4 className="text-lg font-medium">{task.title}</h4>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>
          <div className="flex flex-row w-20 items-center text-xs text-muted-foreground bg-[#3A3A3A] gap-1 px-2 py-1 rounded-md">
            <Clock3 className="w-4"/>
            {task.dueDate}
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-between items-end">
          <div className="flex flex-row gap-2 ">
            {task.status && task.statusColor && (
              <div
                className="px-3 py-1.5 rounded-full text-xs"
                style={{
                  backgroundColor: task.statusColor.bg,
                  border: `1px solid ${task.statusColor.border}`,
                  color: task.statusColor.text,
                }}
              >
                {task.status}
              </div>
            )}
            {task.project && (
              <div className="bg-[#3A3A3A] border border-[#505050] text-white text-xs px-3 py-1.5 rounded-full">
                {task.project}
              </div>
            )}
          </div>
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar] *:data-[slot=avatar]:grayscale">
            {task.assignees.map((user) => (
              <Avatar className="w-7 h-7" key={user.name}>
                <AvatarImage src={user.src} alt={`@${user.name}`} />
                <AvatarFallback>{user.fallback}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
