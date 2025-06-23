import { DashBoardHeader } from "@/components/DashBoardHeader";
import { TaskHeader } from "@/app/task/[taskId]/_components/TaskHeader";

export default function TaskPage() {
    return (
        <div className="bg-black">
            <DashBoardHeader />
            <TaskHeader />
        </div>
    )
}