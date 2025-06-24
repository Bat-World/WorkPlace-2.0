export interface Assignee { id: string; name: string; avatarUrl?: string; }
export interface Task { id: string; title: string; description: string; priority: "low"|"medium"|"high"; label: string; comments: number; attachments: number; assignees: Assignee[]; }
export interface Column { id: string; title: string; taskIds: string[]; } 