"use client"

import { MoreVertical, Clock, Paperclip, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  dueDate?: string;
}

interface ProjectTasksProps {
  tasks: Task[];
}

export const ProjectTasks = ({ tasks }: ProjectTasksProps) => {
  const statusMap = {
    TODO: { title: 'Шинэ хүсэлтүүд', color: 'bg-red-500' },
    IN_PROGRESS: { title: 'Хийгдэж байгаа', color: 'bg-yellow-400' },
    REVIEW: { title: 'Шалгуулхад бэлэн', color: 'bg-blue-300' },
    DONE: { title: 'Хаагдсан таскууд', color: 'bg-green-400' },
  };

  // Group tasks by status
  const columns = Object.entries(statusMap).map(([status, meta]) => ({
    title: meta.title,
    color: meta.color,
    tasks: tasks?.filter((task) => task.status === status),
  }));

  return (
    <div className="p-6 max-w-7xl">
      <div className="grid grid-cols-4 gap-6 mb-6">
        {columns.map((column, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 ${column.color} rounded-full`} />
              <span className="text-white font-medium text-base">
                {column.title} {column.tasks?.length}
              </span>
            </div>
            <button className="text-white hover:text-gray-300">
              <MoreVertical size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-6">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="space-y-4">
            {column.tasks?.map((task) => (
              <div
                key={task.id}
                className="bg-[#141318] border border-gray-700 rounded-3xl p-6 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-xl border bg-gray-700 text-white">
                    {task?.priority || 'Тодорхойгүй'}
                  </span>
                  <button className="text-white hover:text-gray-300">
                    <MoreVertical size={16} />
                  </button>
                </div>

                <h3 className="text-white font-semibold text-xl mb-3">{task?.title}</h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {task?.description || 'No description'}
                </p>

                <div className="flex items-center gap-2 mb-6">
                  <Clock size={12} className="text-gray-400" />
                  <span className="text-gray-400 text-sm">
                    {task?.dueDate
                      ? formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })
                      : 'No due date'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Paperclip size={16} className="text-white" />
                      <span className="text-white text-sm">0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle size={16} className="text-white" />
                      <span className="text-white text-sm">0</span>
                    </div>
                  </div>
                  <div className="flex items-center -space-x-2">
                    <div className="w-6 h-6 bg-gray-500 rounded-full border-2 border-gray-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
