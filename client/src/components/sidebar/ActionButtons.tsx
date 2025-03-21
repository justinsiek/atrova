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
          backgroundColor: COLORS.paperWhite, 
          color: COLORS.darkBrown
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

      <button 
        onClick={scheduleWithAI}
        disabled={aiStatus === 'loading'}
        className="w-full py-2 px-4 rounded-md transition-transform hover:scale-[1.02] shadow-sm flex items-center justify-center"
        style={{ 
          backgroundColor: aiStatus === 'loading' ? COLORS.accent3 : COLORS.accent1,
          color: 'white',
          opacity: aiStatus === 'loading' ? 0.7 : 1
        }}
      >
        {aiStatus === 'loading' ? (
          <>
            <Loader className="animate-spin w-4 h-4 mr-2" />
            Scheduling...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Schedule with AI
          </>
        )}
      </button>
    </div>
  );
};

export default ActionButtons; 