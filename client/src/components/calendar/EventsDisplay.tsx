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
}

export const EventsDisplay: React.FC<EventsDisplayProps> = ({ 
  calendarDays, 
  events, 
  onEventClick,
  onEventAdd
}) => {
  // Track which day is being dragged over
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);
  // Track the current Y position for the drop preview
  const [dropPosition, setDropPosition] = useState<{y: number, duration: number} | null>(null);
  // Track the drag data for showing preview
  const [dragData, setDragData] = useState<{
    title: string, 
    duration: number,
    color: "pink" | "mint" | "blue" | "purple" | "orange"
  } | null>(null);
  
  // Use a ref to store drag data between events
  const dragDataRef = useRef<any>(null);
  // Use a throttle timer ref to prevent too many updates
  const throttleTimerRef = useRef<any>(null);

  // Get positioning style for an event
  const getEventStyle = (event: EventType) => {
    const [startHour, startMinute] = event.startTime.split(":").map(Number);
    const [endHour, endMinute] = event.endTime.split(":").map(Number);

    const startOffset = (startHour * 60 + startMinute) * 2;
    const duration = ((endHour - startHour) * 60 + (endMinute - startMinute)) * 2;

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
        borderColor: event.aiGenerated ? COLORS.accent1 : COLORS.borderMedium,
        borderStyle: event.aiGenerated ? 'dashed' : 'solid',
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
      // Get the drop position (time) based on Y coordinate
      const dropRect = e.currentTarget.getBoundingClientRect();
      const dropY = e.clientY - dropRect.top;
      
      // Calculate the time (in minutes since start of day)
      const minutesSinceMidnight = Math.floor(dropY / 2);
      const dropHour = Math.floor(minutesSinceMidnight / 60);
      const dropMinute = minutesSinceMidnight % 60;
      
      // Format as HH:MM
      const startTime = `${String(dropHour).padStart(2, '0')}:${String(dropMinute).padStart(2, '0')}`;
      
      // Get task data
      const taskData = extractTaskData(e.dataTransfer);
      
      if (!taskData) {
        console.error('No valid task data found in drop');
        return;
      }
      
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
        description: `Task converted from "${taskData.title}"`,
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
          className="relative h-[2880px]"
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
              className="absolute left-1 right-1 rounded-lg p-3 border shadow-sm pointer-events-none"
              style={{
                top: `${dropPosition.y}px`,
                height: `${dropPosition.duration * 2}px`,
                backgroundColor: dragData.color === 'pink' ? COLORS.eventPink :
                               dragData.color === 'mint' ? COLORS.eventMint :
                               dragData.color === 'blue' ? COLORS.eventBlue :
                               dragData.color === 'purple' ? COLORS.eventPurple : 
                               COLORS.eventOrange,
                borderColor: COLORS.borderMedium,
                opacity: 0.7
              }}
            >
              <div className="text-sm font-medium text-white">
                {dragData.title}
              </div>
              <div className="text-xs text-white opacity-80">
                {dragData.duration || 60} min
              </div>
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