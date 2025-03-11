import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '@/components/sidebar/types';
import { COLORS } from '@/constants/colors';

interface TaskDetailsModalProps {
  task: Task | null;
  showModal: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onToggleComplete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ 
  task, 
  showModal, 
  onClose, 
  onDelete,
  onToggleComplete,
  onEdit
}) => {
  if (!showModal || !task) return null;

  // Get priority color matching the TaskCard implementation
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return COLORS.error;
      case 'medium': return COLORS.warning;
      case 'low': return COLORS.info;
      default: return COLORS.lightBrown;
    }
  };

  // Get priority text
  const getPriorityText = () => {
    switch (task.priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'No Priority';
    }
  };

  const priorityColor = getPriorityColor();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        style={{ 
          border: `4px solid ${priorityColor}`,
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: [0.19, 1.0, 0.22, 1.0] }}
      >
        {/* Header section */}
        <div className="px-6 pt-5 pb-3 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{task.title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Status badges */}
        <div className="px-6 pb-4 space-y-1.5">
          <div className="flex flex-wrap gap-2">
            {/* Priority badge - using same priority color as the card */}
            {task.priority && (
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: priorityColor }}
              >
                {getPriorityText()}
              </span>
            )}
            
            {/* Completion status badge */}
            <span 
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                task.completed 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}
            >
              {task.completed ? 'Completed' : 'In Progress'}
            </span>
            
            {/* AI scheduled badge */}
            {task.aiScheduled && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                AI Scheduled
              </span>
            )}
          </div>
        </div>
        
        {/* Details section */}
        <div className="px-6 pb-5 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
          {/* Due date */}
          {task.dueDate && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Due Date</span>
                <span className="font-medium">{task.dueDate}</span>
              </div>
            </div>
          )}
          
          {/* Duration */}
          {task.duration && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Duration</span>
                <span className="font-medium">{task.duration} minutes</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-end space-x-3">
          <button 
            onClick={() => onDelete(task.id)}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
          >
            Delete
          </button>
          <button 
            onClick={() => onEdit && onEdit(task)}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
          >
            Edit
          </button>
          <button 
            onClick={onClose}
            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}; 