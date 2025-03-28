import React, { useState, useRef } from 'react';
import Event from './Event';
import { EventType } from '@/types';
import { COLORS } from '@/constants/colors';
import { v4 as uuidv4 } from 'uuid';

interface Day {
  day: number;
  month: number;
  year: number;
  weekday: string;
  isToday: boolean;
}

interface EventsDisplayProps {
  calendarDays: Day[];
  events: EventType[];
  onEventClick: (event: EventType) => void;
  onEventAdd?: (event: EventType) => void;
  hourHeight?: number;
}

export const EventsDisplay: React.FC<EventsDisplayProps> = ({ 
  calendarDays, 
  events, 
  onEventClick,
  onEventAdd,
  hourHeight = 80
}) => {
  // Track which day is being dragged over
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);
  // Track the current Y position for the drop preview
  const [dropPosition, setDropPosition] = useState<{y: number, duration: number} | null>(null);
  // Track the drag data for showing preview
  const [dragData, setDragData] = useState<{
    title: string, 
    duration: number,
    color: "pink" | "mint" | "blue" | "purple" | "orange",
    displayMode?: 'full' | 'compact' | 'minimal'
  } | null>(null);
  
  // Use a ref to store drag data between events
  const dragDataRef = useRef<any>(null);
  // Use a throttle timer ref to prevent too many updates
  const throttleTimerRef = useRef<any>(null);

  // Get positioning style for an event
  const getEventStyle = (event: EventType) => {
    const [startHour, startMinute] = event.startTime.split(":").map(Number);
    const [endHour, endMinute] = event.endTime.split(":").map(Number);

    const startOffset = (startHour * 60 + startMinute) * hourHeight/60;
    const duration = ((endHour - startHour) * 60 + (endMinute - startMinute)) * hourHeight/60;

    return {
      top: `${startOffset}px`,
      height: `${duration}px`,
      className: `absolute left-1 right-1 rounded-lg p-3 border shadow-sm hover:shadow-md transition-shadow duration-200`,
      style: {
        backgroundColor: event.color === 'pink' ? COLORS.eventPink :
                        event.color === 'mint' ? COLORS.eventMint :
                        event.color === 'blue' ? COLORS.eventBlue :
                        event.color === 'purple' ? COLORS.eventPurple : 
                        COLORS.eventOrange,
      }
    };
  };

  const shouldShowEvent = (event: EventType, day: Day) => {
    if (!event.isRecurring) {
      return event.date === day.day;
    }

    // For recurring events
    const dayDate = new Date(day.year, day.month, day.day);
    
    // Check if event has ended
    if (event.recurringEndDate && dayDate > new Date(event.recurringEndDate)) {
      return false;
    }

    // Get day of week (0 = Monday, 6 = Sunday)
    const weekday = dayDate.getDay();
    const adjustedWeekday = weekday === 0 ? 6 : weekday - 1;

    return event.recurringDays?.[adjustedWeekday] === '1';
  };

  // Extract task data from dataTransfer
  const extractTaskData = (dataTransfer: DataTransfer) => {
    try {
      const jsonData = dataTransfer.getData('application/json');
      if (jsonData) {
        return JSON.parse(jsonData);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
    return null;
  };

  // Handle drop event - convert task to event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: Day) => {
    e.preventDefault();
    
    try {
      // Get task data
      const taskData = extractTaskData(e.dataTransfer);
      
      if (!taskData) {
        console.error('No valid task data found in drop');
        return;
      }

      // Use the taskData's hourHeight if available, otherwise use the component prop
      const taskHourHeight = taskData.hourHeight || hourHeight;

      // Get the drop position (time) based on Y coordinate
      const dropRect = e.currentTarget.getBoundingClientRect();
      let dropY = e.clientY - dropRect.top;
      
      // Adjust for the drag offset if it was provided
      if (taskData.dragOffset?.y) {
        dropY -= taskData.dragOffset.y;
      }
      
      // Calculate the time (in minutes since start of day)
      const minutesSinceMidnight = Math.floor(dropY / (taskHourHeight/60));
      const dropHour = Math.floor(minutesSinceMidnight / 60);
      const dropMinute = minutesSinceMidnight % 60;
      
      // Format as HH:MM
      const startTime = `${String(dropHour).padStart(2, '0')}:${String(dropMinute).padStart(2, '0')}`;
      
      // Calculate end time based on duration
      const durationMinutes = taskData.duration || 60; // Default to 1 hour if no duration
      const endMinutes = minutesSinceMidnight + durationMinutes;
      const endHour = Math.floor(endMinutes / 60);
      const endMinute = endMinutes % 60;
      const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
      
      // Create the new event
      const newEvent: EventType = {
        id: uuidv4(),
        title: taskData.title,
        startTime,
        endTime,
        date: day.day,
        color: taskData.color || 'blue',
        description: undefined,
        isRecurring: false,
        recurringDays: null,
        recurringEndDate: null
      };
      
      console.log('Created new event:', newEvent);
      
      // Add the event
      if (onEventAdd) {
        onEventAdd(newEvent);
      } else {
        console.error('onEventAdd callback is not defined');
      }
    } catch (error) {
      console.error('Error handling dropped task:', error);
    }
  };

  // Handle drag over to enable dropping
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, day: Day) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    
    // Calculate drop position
    const dropRect = e.currentTarget.getBoundingClientRect();
    const dropY = e.clientY - dropRect.top;
    
    // Try to get task data if we don't have it yet
    if (!dragData) {
      const taskData = extractTaskData(e.dataTransfer);
      if (taskData) {
        setDragData(taskData);
      }
    }
    
    // Update drop position
    if (dragData) {
      setDragOverDay(day.day);
      setDropPosition({
        y: dropY,
        duration: dragData.duration || 60
      });
    }
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only reset if we're leaving the container (not entering a child)
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    
    setDragOverDay(null);
    setDropPosition(null);
  };

  // Handle drag end to clean up
  const handleDragEnd = () => {
    setDragOverDay(null);
    setDropPosition(null);
    setDragData(null);
  };

  return (
    <>
      {calendarDays.map((day) => (
        <div 
          key={day.day} 
          className="relative" 
          style={{ height: `${24 * hourHeight}px` }}
          onDrop={(e) => {
            handleDrop(e, day);
            handleDragEnd();
          }}
          onDragOver={(e) => handleDragOver(e, day)}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
        >
          {/* Drop preview */}
          {dragOverDay === day.day && dropPosition && dragData && (
            <div 
              className="absolute left-1 right-1 rounded-lg border-2 border-solid shadow-sm pointer-events-none"
              style={{
                top: `${dropPosition.y}px`,
                height: `${dropPosition.duration * hourHeight/60}px`,
                backgroundColor: dragData.color === 'pink' ? COLORS.eventPink :
                               dragData.color === 'mint' ? COLORS.eventMint :
                               dragData.color === 'blue' ? COLORS.eventBlue :
                               dragData.color === 'purple' ? COLORS.eventPurple : 
                               COLORS.eventOrange,
                borderColor: dragData.color === 'pink' ? '#e3b3ac' :
                            dragData.color === 'mint' ? '#bacbb7' :
                            dragData.color === 'blue' ? '#b6cede' :
                            dragData.color === 'purple' ? '#c9b8d9' :
                            dragData.color === 'orange' ? '#e7c3a7' : '#d6cebf',
                opacity: 0.9
              }}
            >
              {dragData.displayMode === 'minimal' ? (
                // Extremely small height - just show title with minimal or no padding
                <div className="h-full flex items-center px-0.5 py-0 overflow-visible">
                  <div className="text-xs font-semibold truncate w-full">{dragData.title}</div>
                </div>
              ) : dragData.displayMode === 'compact' ? (
                // Compact display - include time and title
                <div className="h-full flex flex-col justify-center px-0.5 py-0 overflow-visible">
                  <div className="text-xs text-gray-500 truncate leading-none mb-0.5">Task</div>
                  <div className="text-xs font-bold truncate leading-tight">{dragData.title}</div>
                </div>
              ) : (
                // Regular display
                <div className="flex flex-col h-full px-0.5">
                  <div className="text-xs text-gray-500 truncate">Task</div>
                  <div className="font-bold text-sm truncate">{dragData.title}</div>
                  {dragData.duration && (
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2 overflow-hidden">{dragData.duration}m</div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {events
            .filter((event) => shouldShowEvent(event, day))
            .map((event) => (
              <div 
                key={`${event.id}-${day.day}`}
                onClick={() => onEventClick(event)}
                className="cursor-pointer"
              >
                <Event
                  {...event}
                  style={getEventStyle(event)}
                />
              </div>
            ))}
        </div>
      ))}
    </>
  );
}; 