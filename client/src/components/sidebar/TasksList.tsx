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
}

interface TasksListProps {
  filteredTasks: Task[];
  tasks: Task[];
  completedTasks: number;
  totalTasks: number;
  showCompleted: boolean;
  handleToggleComplete: (taskId: string) => void;
  handleDeleteTask: (taskId: string) => void;
}

const TasksList: React.FC<TasksListProps> = ({ 
  filteredTasks, 
  tasks, 
  completedTasks, 
  totalTasks, 
  showCompleted, 
  handleToggleComplete, 
  handleDeleteTask 
}) => {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
      <AnimatePresence initial={false}>
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TaskCard 
              title={task.title} 
              id={task.id} 
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
              completed={task.completed}
              aiScheduled={task.aiScheduled}
              dueDate={task.dueDate}
              priority={task.priority}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {filteredTasks.length === 0 && (
        <div className="text-center py-10 opacity-50" style={{ color: COLORS.sidebarText }}>
          {tasks.length === 0 ? (
            <p>No tasks yet. Add one to get started.</p>
          ) : !showCompleted && completedTasks === totalTasks ? (
            <p>All tasks completed! 🎉</p>
          ) : (
            <p>No tasks match your filters.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TasksList; 