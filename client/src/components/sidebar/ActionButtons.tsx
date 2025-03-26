import React from 'react';
import { Calendar, Sparkles, Plus, Loader } from 'lucide-react';
import { COLORS } from '@/constants/colors';

interface ActionButtonsProps {
  onNewEvent: () => void;
  onAddTask: () => void;
  scheduleWithAI: () => void;
  aiStatus: 'idle' | 'loading' | 'success' | 'error';
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onNewEvent, 
  onAddTask, 
  scheduleWithAI, 
  aiStatus 
}) => {
  return (
    <div className="space-y-3 mb-6">
      <button 
        onClick={onNewEvent}
        className="w-full py-2 px-4 rounded-md transition-transform hover:scale-[1.02] shadow-sm flex items-center justify-center"
        style={{ 
          backgroundColor: COLORS.accent1, 
          color: COLORS.paperWhite
        }}
      >
        <Calendar className="w-4 h-4 mr-2" />
        New Event
      </button>

      <button
        onClick={onAddTask}
        className="w-full py-2 px-4 text-white rounded-md transition-transform hover:scale-[1.02] shadow-sm flex items-center justify-center"
        style={{ 
          backgroundColor: COLORS.paperWhite, 
          color: COLORS.darkBrown
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Task
      </button>
    </div>
  );
};

export default ActionButtons; 