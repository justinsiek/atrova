import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/TaskCard';
import { COLORS } from '@/constants/colors';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  aiScheduled?: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  duration?: number;
}

interface TasksListProps {
  filteredTasks: Task[];
  tasks: Task[];
  completedTasks: number;
  totalTasks: number;
  showCompleted: boolean;
  handleToggleComplete: (taskId: string) => void;
  handleDeleteTask: (taskId: string) => void;
  getRandomColor: () => "pink" | "mint" | "blue" | "purple" | "orange";
}

const TasksList: React.FC<TasksListProps> = ({ 
  filteredTasks, 
  tasks, 
  completedTasks, 
  totalTasks, 
  showCompleted, 
  handleToggleComplete, 
  handleDeleteTask,
  getRandomColor
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">    
      <div className="flex-1 overflow-y-auto scrollbar-hide pr-1">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-4 text-sm" style={{ color: COLORS.sidebarText }}>
            No tasks found
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                completed={task.completed}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
                priority={task.priority}
                dueDate={task.dueDate}
                duration={task.duration}
                getRandomColor={getRandomColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksList; 