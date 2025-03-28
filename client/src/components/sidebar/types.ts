export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  duration?: number; // Duration in minutes
} 