import React from 'react';
import { COLORS } from '@/constants/colors';
import { Check } from 'lucide-react';

interface TaskCardProps {
  id: string;
  title: string;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  completed: boolean;
  aiScheduled?: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  duration?: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  id, 
  title, 
  onDelete,
  onToggleComplete,
  completed,
  aiScheduled,
  dueDate,
  priority,
  duration
}) => {
  // Determine priority color
  const priorityColor = priority === 'high' ? COLORS.error : 
                        priority === 'medium' ? COLORS.warning : 
                        priority === 'low' ? COLORS.info : COLORS.lightBrown;
  
  return (
    <div 
      className={`p-3 rounded-md shadow-sm relative ${completed ? 'opacity-70' : ''} flex`}
      style={{ backgroundColor: '#333232', border: `1px solid ${COLORS.sidebarBorder}` }}
    >
      {/* Priority indicator */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-md"
        style={{
          backgroundColor: priorityColor,
          opacity: completed ? 0.3 : 1
        }}
      ></div>
      
      {/* Checkbox */}
      <button
        onClick={() => onToggleComplete(id)}
        className="shrink-0 w-5 h-5 rounded border flex items-center justify-center mr-3 mt-0.5"
        style={{
          backgroundColor: completed ? COLORS.success : 'transparent',
          borderColor: completed ? COLORS.success : COLORS.sidebarText,
          color: 'white'
        }}
      >
        {completed && (
          <Check className="w-3 h-3" />
        )}
      </button>
      
      {/* Content */}
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 
            className={`text-sm font-medium mb-1 ${completed ? 'line-through opacity-70' : ''}`}
            style={{ color: COLORS.sidebarText }}
          >
            {title}
          </h3>
          <button 
            onClick={() => onDelete(id)}
            className="opacity-40 hover:opacity-100 ml-2"
            style={{ color: COLORS.sidebarText }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="flex items-center text-xs mt-2">
          {dueDate && (
            <div 
              className="flex items-center opacity-60 mr-3"
              style={{ color: COLORS.sidebarText }}
            >
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {dueDate}
            </div>
          )}
          
          {aiScheduled && (
            <div 
              className="text-xs flex items-center"
              style={{ color: COLORS.accent4 }}
            >
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Scheduled
            </div>
          )}
          
          {duration && (
            <div 
              className="flex items-center opacity-60 mr-3"
              style={{ color: COLORS.sidebarText }}
            >
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {duration} min
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
