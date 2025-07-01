export interface Project {
  id: string;
  title: string;
  description?: string;
  avatarUrl?: string;
  createdAt: string;
  createdBy: {
    id: string;
    user?: {
      name?: string;
      avatarUrl?: string;
    };
  };
  tasks?: any[];
  members?: {
    id: string;
    role: string;
    user?: {
      name?: string;
      avatarUrl?: string;
    };
  }[];
labels: {
  id: string;
  name: string;
}[];

}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignees: Array<{
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
  }>;
  project: {
    id: string;
    title: string;
  };
  labels: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

export interface DashboardStatsCardsProps {
  totalTasks: number;
  inProgressTasks: number;
  reviewReadyTasks: number;
  doneTasks: number;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  parentId?: string;
  author: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
  replies?: Comment[];
  likeCount: number;
  isLikedByUser: boolean;
}

export interface GetCommentsResponse {
  getComments: Comment[];
}

export interface FormState {
  title: string;
  description: string;
  priority: string;
  status: string;
  assignee: string[];
  labels: string[];
  labelInput: string;
  date: Date | undefined;
}