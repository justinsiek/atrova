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
          className="text-xs px-2 py-1 rounded"
          style={{ 
            backgroundColor: showCompleted ? COLORS.accent3 : 'transparent',
            color: showCompleted ? 'white' : COLORS.sidebarText,
            border: `1px solid ${showCompleted ? COLORS.accent3 : COLORS.sidebarText}`
          }}
        >
          {showCompleted ? 'Hide Completed' : 'Show Completed'}
        </button>
      </div>
      
      <div className="flex space-x-2 mb-2">
        <button 
          className="text-xs py-1 px-2 rounded transition-colors"
          style={{
            backgroundColor: filter === 'all' ? COLORS.accent4 : 'transparent',
            color: filter === 'all' ? COLORS.darkBrown : COLORS.sidebarText,
            border: `1px solid ${filter === 'all' ? COLORS.accent4 : COLORS.sidebarBorder}`
          }}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className="text-xs py-1 px-2 rounded transition-colors"
          style={{
            backgroundColor: filter === 'high' ? COLORS.error : 'transparent',
            color: filter === 'high' ? 'white' : COLORS.sidebarText,
            border: `1px solid ${filter === 'high' ? COLORS.error : COLORS.sidebarBorder}`
          }}
          onClick={() => setFilter('high')}
        >
          High
        </button>
        <button 
          className="text-xs py-1 px-2 rounded transition-colors"
          style={{
            backgroundColor: filter === 'medium' ? COLORS.warning : 'transparent',
            color: filter === 'medium' ? 'white' : COLORS.sidebarText,
            border: `1px solid ${filter === 'medium' ? COLORS.warning : COLORS.sidebarBorder}`
          }}
          onClick={() => setFilter('medium')}
        >
          Medium
        </button>
        <button 
          className="text-xs py-1 px-2 rounded transition-colors"
          style={{
            backgroundColor: filter === 'low' ? COLORS.info : 'transparent',
            color: filter === 'low' ? 'white' : COLORS.sidebarText,
            border: `1px solid ${filter === 'low' ? COLORS.info : COLORS.sidebarBorder}`
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