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