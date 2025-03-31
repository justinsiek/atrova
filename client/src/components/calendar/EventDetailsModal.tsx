import React from 'react';
import { motion } from 'framer-motion';
import { EventType } from '@/types';
import { COLORS } from '@/constants/colors';

interface EventDetailsModalProps {
  event: EventType | null;
  showModal: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (event: EventType) => void;
}

const formatRecurringDays = (days: string) => {
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days
    .split('')
    .map((day, index) => day === '1' ? weekdays[index] : null)
    .filter(Boolean)
    .join(', ');
};

// Function to get the color value based on event color
const getEventColorValue = (color: EventType['color']) => {
  switch (color) {
    case 'pink': return COLORS.eventPink;
    case 'mint': return COLORS.eventMint;
    case 'blue': return COLORS.eventBlue;
    case 'purple': return COLORS.eventPurple;
    case 'orange': return COLORS.eventOrange;
    default: return COLORS.eventBlue;
  }
};

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ 
  event, 
  showModal, 
  onClose, 
  onDelete,
  onEdit 
}) => {
  if (!showModal || !event) return null;
  
  // Get the event color value
  const eventColorValue = getEventColorValue(event.color);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        style={{ 
          border: `4px solid ${eventColorValue}`,
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: [0.19, 1.0, 0.22, 1.0] }}
      >
        {/* Header section */}
        <div className="px-6 pt-5 pb-3 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{event.title}</h2>
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
        
        {/* Details section */}
        <div className="px-6 pb-5 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
          {/* Time */}
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">Time</span>
              <span className="font-medium">{event.startTime} - {event.endTime}</span>
            </div>
          </div>
          
          {/* Recurring details */}
          {event.isRecurring && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Repeats on</span>
                <span className="font-medium">{formatRecurringDays(event.recurringDays!)}</span>
                <span className="text-sm text-gray-500">
                  Starting: {new Date(event.timestamp).toLocaleDateString()}
                </span>
                {event.recurringEndDate && (
                  <span className="text-sm text-gray-500">
                    Until: {new Date(event.recurringEndDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Description */}
          {event.description && (
            <div className="flex items-start text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Description</span>
                <span className="font-medium">{event.description}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-end space-x-3">
          <button 
            onClick={() => onDelete(event.id)}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
          >
            Delete
          </button>
          <button 
            onClick={() => onEdit(event)}
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