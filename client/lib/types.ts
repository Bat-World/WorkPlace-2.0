export interface Project {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  tasks?: any[];  
  members?: {
    id: string;
    role: string;
    user?: {
      name?: string;
      avatarUrl?: string;
    };
  }[];
}