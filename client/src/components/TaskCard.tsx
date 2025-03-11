import React, { useRef, useState } from 'react';
import { COLORS } from '@/constants/colors';
import { Check } from 'lucide-react';
import Event from '@/components/calendar/Event';
import { EventType } from '@/types';
import { Task } from '@/components/sidebar/types';

const eventColorMap = {
  pink: COLORS.eventPink,
  mint: COLORS.eventMint,
  blue: COLORS.eventBlue,
  purple: COLORS.eventPurple,
  orange: COLORS.eventOrange
} as const;

interface TaskCardProps extends Task {
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  getRandomColor: () => "pink" | "mint" | "blue" | "purple" | "orange";
  onTaskClick?: (task: Task) => void;
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
  duration,
  getRandomColor,
  onTaskClick
}) => {
  const dragPreviewRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number, y: number } | null>(null);
  const [eventColor] = useState(getRandomColor());
  
  // Determine priority color for the task card indicator
  const priorityColor = priority === 'high' ? COLORS.error : 
                        priority === 'medium' ? COLORS.warning : 
                        priority === 'low' ? COLORS.info : COLORS.lightBrown;

  // Create a mock event for the preview
  const previewEvent: EventType = {
    id: 'preview',
    title,
    startTime: '00:00',
    endTime: '01:00',
    date: 1,
    color: eventColor,
    description: '',
    isRecurring: false,
    recurringDays: null,
    recurringEndDate: null
  };

  // Get event style for preview
  const previewStyle = {
    top: '0',
    height: `${(duration || 60) * 2}px`,
    className: `absolute rounded-lg p-3 border shadow-sm`,
    style: {
      width: 'calc(100% - 0.5rem)',
      marginLeft: '0.25rem',
      backgroundColor: eventColorMap[eventColor],
      borderColor: COLORS.borderMedium,
      borderStyle: 'solid',
    }
  };

  // Create a task object that can be passed to the click handler
  const taskData: Task = {
    id,
    title,
    completed,
    aiScheduled,
    dueDate,
    priority,
    duration
  };
  
  // Handle drag start event
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Set the drag data with task information
    const taskData = JSON.stringify({
      id,
      title,
      priority,
      duration: duration || 60,
      color: eventColor,
      description: `Task: ${title}`
    });
    
    e.dataTransfer.setData('application/json', taskData);
    e.dataTransfer.effectAllowed = 'copy';

    // Create custom drag image
    if (dragPreviewRef.current) {
      // Position offscreen during drag
      dragPreviewRef.current.style.display = 'block';
      
      // Calculate center point of preview
      const rect = dragPreviewRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Store the offset from the cursor to the center
      setDragOffset({
        x: centerX,
        y: centerY
      });
      
      // Set the drag image centered on cursor
      e.dataTransfer.setDragImage(
        dragPreviewRef.current,
        centerX,
        centerY
      );

      // Also include the drag offset in the data transfer
      const dragData = {
        ...JSON.parse(taskData),
        dragOffset: { x: centerX, y: centerY }
      };
      e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    }
  };

  // Handle drag end event
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Hide the drag preview element
    if (dragPreviewRef.current) {
      dragPreviewRef.current.style.display = 'none';
    }
    setDragOffset(null);
  };
  
  // Handle task card click
  const handleTaskClick = (e: React.MouseEvent) => {
    // Prevent click from triggering if we're clicking on buttons inside the card
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    // Only trigger the click if we have a handler
    if (onTaskClick) {
      onTaskClick(taskData);
    }
  };
  
  return (
    <>
      {/* Hidden drag preview element */}
      <div 
        ref={dragPreviewRef}
        className="fixed left-0 top-0 pointer-events-none"
        style={{ 
          display: 'none', 
          zIndex: -1000,
          width: 'calc((100vw - 18rem - 4rem - 4rem - 4rem) / 7)',
          transform: 'translate(-50%, -50%)' // Center the preview element
        }}
      >
        <Event
          {...previewEvent}
          style={previewStyle}
        />
      </div>

      {/* Actual task card */}
      <div 
        className={`p-3 rounded-md shadow-sm relative ${completed ? 'opacity-70' : ''} flex items-start cursor-pointer`}
        style={{ backgroundColor: '#333232', border: `1px solid ${COLORS.sidebarBorder}` }}
        draggable={!completed && !aiScheduled}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleTaskClick}
      >
        {/* Priority indicator */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-md"
          style={{
            backgroundColor: priorityColor,
            opacity: completed ? 0.3 : 1
          }}
        ></div>
        
        {/* Add a more prominent scheduled badge if task is scheduled */}
        {aiScheduled && (
          <div className="absolute right-1 top-1 bg-purple-500 bg-opacity-90 rounded-full px-1 py-0.5 text-[10px] text-white font-medium">
            <div className="flex items-center">
              <svg className="w-2.5 h-2.5 mr-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              AI
            </div>
          </div>
        )}
        
        {/* Checkbox - now properly centered */}
        <button
          onClick={() => onToggleComplete(id)}
          className="shrink-0 w-5 h-5 rounded border flex items-center justify-center mr-3 self-center"
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
        
        {/* Content - add self-center here */}
        <div className="flex flex-col flex-grow self-center">
          <div className="flex justify-between items-center">
            <h3 
              className={`text-sm font-medium ${completed ? 'line-through opacity-70' : ''}`}
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
          
          {/* Info row - always show duration if available, and due date when needed */}
          <div className="flex items-center text-xs mt-1">
            {duration && (
              <div 
                className="flex items-center opacity-60 mr-3"
                style={{ color: COLORS.sidebarText }}
              >
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {duration}m
              </div>
            )}
            
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
                style={{ color: COLORS.accent4, fontWeight: 'bold' }}
              >
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Scheduled
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
