import React from 'react';
import { MoreVertical, Clock, Paperclip, MessageCircle } from 'lucide-react';

export const ProjectTasks = () => {
  const columns = [
    {
      title: "Шинэ хүсэлтүүд",
      count: 6,
      color: "bg-red-500",
      tasks: [
        {
          id: 1,
          title: "Marketing ad script",
          description: "Lets do the exact opposite of the first concept. Light theme, minimalism and the...",
          priority: "Яаралтай",
          priorityColor: "bg-pink-900 border-pink-700 text-pink-300",
          category: "Tinder",
          date: "Jan 28",
          attachments: 5,
          comments: 2,
          avatars: [
            { bg: "bg-gray-300" },
            { bg: "bg-gray-500" }
          ]
        }
      ]
    },
    {
      title: "Хийгдэж байгаа",
      count: 6,
      color: "bg-yellow-400",
      tasks: [
        {
          id: 2,
          title: "Marketing ad script",
          description: "Lets do the exact opposite of the first concept. Light theme, minimalism and the...",
          priority: "Чухал",
          priorityColor: "bg-yellow-900 border-yellow-700 text-yellow-400",
          category: "Tinder",
          date: "Jan 28",
          attachments: 5,
          comments: 2,
          avatars: [
            { bg: "bg-gray-300" },
            { bg: "bg-gray-500" }
          ]
        }
      ]
    },
    {
      title: "Шалгуулхад бэлэн",
      count: 6,
      color: "bg-blue-300",
      tasks: [
        {
          id: 3,
          title: "Marketing ad script",
          description: "Lets do the exact opposite of the first concept. Light theme, minimalism and the...",
          priority: "Энгийн",
          priorityColor: "bg-blue-900 border-blue-700 text-blue-300",
          category: "Tinder",
          date: "Jan 28",
          attachments: 5,
          comments: 2,
          avatars: [
            { bg: "bg-gray-300" },
            { bg: "bg-gray-500" }
          ]
        }
      ]
    },
    {
      title: "Хаагдсан таскууд",
      count: 6,
      color: "bg-green-400",
      tasks: [
        {
          id: 4,
          title: "Marketing ad script",
          description: "Lets do the exact opposite of the first concept. Light theme, minimalism and the...",
          priority: "Яаралтай",
          priorityColor: "bg-pink-900 border-pink-700 text-pink-300",
          category: "Tinder",
          date: "Jan 28",
          attachments: 5,
          comments: 2,
          avatars: [
            { bg: "bg-gray-300" },
            { bg: "bg-gray-500" }
          ]
        }
      ]
    }
  ];

  return (
    <div className="p-6">
      
      <div className="grid grid-cols-4 gap-6 mb-6">
        {columns.map((column, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 ${column.color} rounded-full`}></div>
              <span className="text-white font-medium text-base">
                {column.title} {column.count}
              </span>
            </div>
            <button className="text-white hover:text-gray-300">
              <MoreVertical size={18} />
            </button>
          </div>
        ))}
      </div>

      
      <div className="grid grid-cols-4 gap-6">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-4">
            {column.tasks.map((task) => (
              <div
                key={task.id}
                className="bg-[#141318] border border-gray-700 rounded-3xl p-6 hover:border-gray-600 transition-colors"
              >
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-xl text-xs font-semibold border ${task.priorityColor}`}>
                      {task.priority}
                    </span>
                    <span className="px-3 py-1 bg-gray-700 rounded-xl text-xs font-semibold text-white">
                      {task.category}
                    </span>
                  </div>
                  <button className="text-white hover:text-gray-300">
                    <MoreVertical size={16} />
                  </button>
                </div>

                
                <h3 className="text-white font-semibold text-xl mb-3">
                  {task.title}
                </h3>

                {/* Task Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {task.description}
                </p>

                {/* Date */}
                <div className="flex items-center gap-2 mb-6">
                  <Clock size={12} className="text-gray-400" />
                  <span className="text-gray-400 text-sm">{task.date}</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Paperclip size={16} className="text-white" />
                      <span className="text-white text-sm">{task.attachments}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle size={16} className="text-white" />
                      <span className="text-white text-sm">{task.comments}</span>
                    </div>
                  </div>
                  <div className="flex items-center -space-x-2">
                    {task.avatars.map((avatar, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 ${avatar.bg} rounded-full border-2 border-gray-800`}
                      ></div>
                    ))}
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

