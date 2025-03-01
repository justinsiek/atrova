import React from 'react';
import { COLORS } from '@/constants/colors';

interface TaskProgressBarProps {
  completedTasks: number;
  totalTasks: number;
  completionPercentage: number;
}

const TaskProgressBar: React.FC<TaskProgressBarProps> = ({ 
  completedTasks, 
  totalTasks, 
  completionPercentage 
}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs mb-1" style={{ color: COLORS.sidebarText }}>
        <span>{completedTasks} of {totalTasks} completed</span>
        <span>{completionPercentage}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: COLORS.sidebarBorder }}>
        <div 
          className="h-full rounded-full" 
          style={{ 
            width: `${completionPercentage}%`,
            backgroundColor: COLORS.accent1
          }}
        ></div>
      </div>
    </div>
  );
};

export default TaskProgressBar; 