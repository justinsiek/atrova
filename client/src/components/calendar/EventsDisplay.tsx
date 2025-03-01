import React from 'react';
import Event from './Event';
import { EventType } from '@/types';
import { COLORS } from '@/constants/colors';

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
}

export const EventsDisplay: React.FC<EventsDisplayProps> = ({ 
  calendarDays, 
  events, 
  onEventClick 
}) => {
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

  return (
    <>
      {calendarDays.map((day) => (
        <div key={day.day} className="relative h-[2880px]">
          {events
            .filter((event) => {
              // Find events that match this day's date
              const eventDate = new Date(day.year, day.month, event.date);
              const dayDate = new Date(day.year, day.month, day.day);
              return eventDate.getDate() === dayDate.getDate() &&
                     eventDate.getMonth() === dayDate.getMonth() &&
                     eventDate.getFullYear() === dayDate.getFullYear();
            })
            .map((event) => (
              <div 
                key={event.id} 
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