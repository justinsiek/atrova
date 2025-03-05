import React from 'react';
import { motion } from 'framer-motion';
import { EventType } from '@/types';

interface EventDetailsModalProps {
  event: EventType | null;
  showModal: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const formatRecurringDays = (days: string) => {
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days
    .split('')
    .map((day, index) => day === '1' ? weekdays[index] : null)
    .filter(Boolean)
    .join(', ');
};

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ 
  event, 
  showModal, 
  onClose, 
  onDelete 
}) => {
  if (!showModal || !event) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{event.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          
          {event.isRecurring && (
            <div className="flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <div>Repeats on: {formatRecurringDays(event.recurringDays!)}</div>
                {event.recurringEndDate && (
                  <div className="text-sm text-gray-500">
                    Until: {new Date(event.recurringEndDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {event.description && (
            <div className="text-gray-700">
              <p>{event.description}</p>
            </div>
          )}
          
          {event.aiGenerated && (
            <div className="bg-purple-50 border border-purple-200 rounded-md p-2 text-sm text-purple-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Automatically scheduled by AI
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={() => onDelete(event.id)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50"
          >
            Delete
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}; 