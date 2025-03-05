import React from 'react';
import { COLORS } from '@/constants/colors';

interface TaskFiltersProps {
  showCompleted: boolean;
  setShowCompleted: (showCompleted: boolean) => void;
  filter: 'all' | 'high' | 'medium' | 'low';
  setFilter: (filter: 'all' | 'high' | 'medium' | 'low') => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ 
  showCompleted, 
  setShowCompleted, 
  filter, 
  setFilter 
}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 
          className="text-lg font-medium" 
          style={{ color: COLORS.sidebarText }}
        >
          Tasks
        </h2>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="text-xs px-4 py-1 rounded border-solid border-1"
          style={{ 
            color: COLORS.sidebarText,
            border: `1px solid ${COLORS.sidebarBorder}`
          }}
        >
          {showCompleted ? 'Hide Completed' : 'Show Completed'}
        </button>
      </div>
      
      <div className="flex space-x-1">
        <button 
          className="text-xs py-1 flex-1 rounded transition-colors text-center"
          style={{
            backgroundColor: filter === 'all' ? COLORS.accent4 : 'transparent',
            color: filter === 'all' ? COLORS.darkBrown : COLORS.sidebarText,
            border: `1px solid ${filter === 'all' ? COLORS.accent4 : COLORS.sidebarBorder}`,
            minWidth: 0
          }}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className="text-xs py-1 flex-1 rounded transition-colors text-center"
          style={{
            backgroundColor: filter === 'high' ? COLORS.error : 'transparent',
            color: filter === 'high' ? 'white' : COLORS.sidebarText,
            border: `1px solid ${filter === 'high' ? COLORS.error : COLORS.sidebarBorder}`,
            minWidth: 0
          }}
          onClick={() => setFilter('high')}
        >
          High
        </button>
        <button 
          className="text-xs py-1 flex-1 rounded transition-colors text-center"
          style={{
            backgroundColor: filter === 'medium' ? COLORS.warning : 'transparent',
            color: filter === 'medium' ? 'white' : COLORS.sidebarText,
            border: `1px solid ${filter === 'medium' ? COLORS.warning : COLORS.sidebarBorder}`,
            minWidth: 0
          }}
          onClick={() => setFilter('medium')}
        >
          Med
        </button>
        <button 
          className="text-xs py-1 flex-1 rounded transition-colors text-center"
          style={{
            backgroundColor: filter === 'low' ? COLORS.info : 'transparent',
            color: filter === 'low' ? 'white' : COLORS.sidebarText,
            border: `1px solid ${filter === 'low' ? COLORS.info : COLORS.sidebarBorder}`,
            minWidth: 0
          }}
          onClick={() => setFilter('low')}
        >
          Low
        </button>
      </div>
    </div>
  );
};

export default TaskFilters; 