"use client"

import { useState, useEffect } from "react"
import { Domine } from "next/font/google"
import EventForm from './EventForm'
import { CalendarToolbar } from './CalendarToolbar' 
import { AI_STATUS } from '../types'
import { DaysHeader } from './calendar/DaysHeader'
import { TimeLabels } from './calendar/TimeLabels'
import { GridLines } from './calendar/GridLines'
import { CurrentTimeIndicator } from './calendar/CurrentTimeIndicator'
import { EventsDisplay } from './calendar/EventsDisplay'
import { EventDetailsModal } from './calendar/EventDetailsModal'
import { createEvent, deleteEvent, updateEvent } from '@/services/api'
import { EventType } from '@/types'
import { COLORS } from '@/constants/colors'

const HOURS = Array.from({ length: 25 }, (_, i) => {
  if (i === 24) return "00:00"
  return `${i.toString().padStart(2, "0")}:00`
})

// For grid lines, we'll use just 24 lines
const GRID_HOURS = Array.from({ length: 24 }, (_, i) => i)

const domine = Domine({
  subsets: ['latin'],
  weight: '700',
})

interface CalendarProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  scheduleWithAI: () => void;
  aiStatus: AI_STATUS;
  getRandomColor: () => "pink" | "mint" | "blue" | "purple" | "orange";
  initialEvents: EventType[];
  hourHeight?: number; // Optional to maintain backwards compatibility
}

export default function Calendar({ 
  showForm, 
  setShowForm, 
  scheduleWithAI, 
  aiStatus, 
  getRandomColor, 
  initialEvents,
  hourHeight = 80 // Default to 80 if not provided
}: CalendarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [events, setEvents] = useState<EventType[]>(initialEvents || [])
  const [view, setView] = useState<'week' | 'day'>('week')
  const [weekOffset, setWeekOffset] = useState(0)
  const [showTimeLabels, setShowTimeLabels] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [eventToEdit, setEventToEdit] = useState<EventType | null>(null)

  // Update events when initialEvents changes
  useEffect(() => {
    if (initialEvents) {
      setEvents(initialEvents);
    }
  }, [initialEvents]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Scroll to the current time when the component mounts
  useEffect(() => {
    const scrollContainer = document.querySelector('.calendar-scroll')
    if (scrollContainer) {
      const currentTimePosition = getCurrentTimePosition()
      const containerHeight = scrollContainer.clientHeight
      const scrollTo = currentTimePosition - (containerHeight / 4)
      scrollContainer.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      })
    }
  }, [])

  // Navigate to previous week
  const previousWeek = () => {
    setWeekOffset(prev => prev - 1)
  }

  // Navigate to next week
  const nextWeek = () => {
    setWeekOffset(prev => prev + 1)
  }

  // Navigate to today
  const goToToday = () => {
    setWeekOffset(0)
    // Scroll to current time
    const scrollContainer = document.querySelector('.calendar-scroll')
    if (scrollContainer) {
      const currentTimePosition = getCurrentTimePosition()
      const containerHeight = scrollContainer.clientHeight
      const scrollTo = currentTimePosition - (containerHeight / 2)
      scrollContainer.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      })
    }
  }

  // Calculate the most recent Monday with week offset
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() + (weekOffset * 7))
  
  const diffToMonday = baseDate.getDay() === 0 ? 6 : baseDate.getDay() - 1
  const monday = new Date(baseDate)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(monday.getDate() - diffToMonday)

  // Build calendar days (Monday to Sunday)
  const calendarDays = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(monday)
    date.setDate(date.getDate() + offset)
    return {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      isToday: date.toDateString() === new Date().toDateString(),
    }
  })

  // Helper to scroll to a specific time/event
  const scrollToEvent = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const minutesSinceMidnight = hours * 60 + minutes
    const position = (minutesSinceMidnight * hourHeight/60) + 32
    
    const scrollContainer = document.querySelector('.calendar-scroll')
    if (scrollContainer) {
      const containerHeight = scrollContainer.clientHeight
      const scrollTo = position - (containerHeight / 2)
      scrollContainer.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      })
    }
  }

  const handleAddEvent = async (newEventData: {
    title: string;
    startTime: string;
    endTime: string;
    timestamp?: number;
    color?: "pink" | "mint" | "blue" | "purple" | "orange";
    description?: string;
    isRecurring?: boolean;
    recurringDays?: string;
    recurringEndDate?: string | null;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('handleAddEvent called with data:', newEventData);
      
      // Generate timestamp for the selected day if not provided
      const defaultTimestamp = new Date(
        calendarDays[0].year, 
        calendarDays[0].month, 
        calendarDays[0].day,
        12, 0, 0  // Add noon time to avoid timezone boundary issues
      ).getTime();
      
      const newEventObj = {
        ...newEventData,
        timestamp: newEventData.timestamp || defaultTimestamp,
        color: newEventData.color || getRandomColor(),
        isRecurring: newEventData.isRecurring || false,
        recurringDays: newEventData.recurringDays || null,
        recurringEndDate: newEventData.recurringEndDate || null
      };
      
      console.log('Sending new event to API:', newEventObj);
      
      // For debugging - immediately display without waiting for API
      const tempId = `temp-${Date.now()}`;
      const tempEvent = {
        ...newEventObj,
        id: tempId
      };
      
      // Add immediately to UI for responsive feel
      setEvents(prev => [...prev, tempEvent as EventType]);
      
      // Then update with actual API result
      const response = await createEvent(newEventObj);
      
      // Replace temp event with real one from API
      setEvents(prev => prev.map(event => 
        event.id === tempId ? response.event : event
      ));
      
      scrollToEvent(newEventData.startTime);
    } catch (error) {
      setError('Failed to add event. Please try again.');
      console.error('Error adding event:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const getCurrentTimePosition = () => {
    const minutesSinceMidnight = currentTime.getHours() * 60 + currentTime.getMinutes()
    return (minutesSinceMidnight * hourHeight/60) + 32 - 10
  }

  const handleEventClick = (event: EventType) => {
    setSelectedEvent(event)
    setShowEventDetails(true)
  }

  const handleDeleteEvent = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      setShowEventDetails(false);
    } catch (error) {
      setError('Failed to delete event. Please try again.');
      console.error('Error deleting event:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditEvent = (event: EventType) => {
    setEventToEdit(event);
    setShowEventDetails(false);
    setShowForm(true);
  };

  const handleUpdateEvent = async (id: string, updatedEventData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // Optimistic UI update
      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...updatedEventData } : event
      ));
      
      // Update on the server
      await updateEvent(id, updatedEventData);
      
      // Clear editing state
      setEventToEdit(null);
    } catch (error) {
      setError('Failed to update event. Please try again.');
      console.error('Error updating event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-32px)] mx-auto p-4 md:pb-8relative bg-[#fbf7f4]">
      {/* Calendar Toolbar */}
      <CalendarToolbar 
        view={view}
        setView={setView}
        previousWeek={previousWeek}
        nextWeek={nextWeek}
        goToToday={goToToday}
        showTimeLabels={showTimeLabels}
        setShowTimeLabels={setShowTimeLabels}
        addEvent={() => {
          setEventToEdit(null);
          setShowForm(true);
        }}
        weekOffset={weekOffset}
      />
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Days Header */}
      <DaysHeader calendarDays={calendarDays} />

      {/* Calendar Grid */}
      <div className="h-[calc(100vh-200px)] overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] calendar-scroll">
        <div className="relative ml-16">
          {/* Time Labels */}
          <TimeLabels showTimeLabels={showTimeLabels} hourHeight={hourHeight} />

          <div className="grid grid-cols-7 pt-8">
            {/* Grid Lines */}
            <GridLines calendarDays={calendarDays} hourHeight={hourHeight} />

            {/* Current Time Indicator */}
            <CurrentTimeIndicator 
              currentTime={currentTime} 
              showIndicator={calendarDays.some(day => day.isToday)}
              hourHeight={hourHeight}
            />

            {/* Loading state */}
            {isLoading && events.length === 0 ? (
              <div className="col-span-7 flex justify-center items-center mt-10">
                <div className="flex space-x-2">
                  {/* Four colored squares in a row */}
                  <div 
                    className="h-4 w-4 rounded-md animate-pulse"
                    style={{ 
                      backgroundColor: COLORS.eventPink,
                      border: '2px solid #e3b3ac',
                      animationDelay: '0ms',
                      animationDuration: '1500ms'
                    }}
                  />
                  <div 
                    className="h-4 w-4 rounded-md animate-pulse"
                    style={{ 
                      backgroundColor: COLORS.eventMint,
                      border: '2px solid #bacbb7',
                      animationDelay: '300ms',
                      animationDuration: '1500ms'
                    }}
                  />
                  <div 
                    className="h-4 w-4 rounded-md animate-pulse"
                    style={{ 
                      backgroundColor: COLORS.eventBlue,
                      border: '2px solid #b6cede',
                      animationDelay: '600ms',
                      animationDuration: '1500ms'
                    }}
                  />
                  <div 
                    className="h-4 w-4 rounded-md animate-pulse"
                    style={{ 
                      backgroundColor: COLORS.eventOrange,
                      border: '2px solid #e7c3a7',
                      animationDelay: '900ms',
                      animationDuration: '1500ms'
                    }}
                  />
                </div>
              </div>
            ) : (
              /* Events Display */
              <EventsDisplay 
                calendarDays={calendarDays}
                events={events}
                onEventClick={handleEventClick}
                hourHeight={hourHeight}
                onEventAdd={(newEvent) => {
                  handleAddEvent({
                    title: newEvent.title,
                    startTime: newEvent.startTime,
                    endTime: newEvent.endTime,
                    timestamp: newEvent.timestamp,
                    color: newEvent.color,
                    description: newEvent.description,
                    isRecurring: newEvent.isRecurring,
                    recurringDays: newEvent.recurringDays || undefined,
                    recurringEndDate: newEvent.recurringEndDate || undefined
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <EventForm 
        showForm={showForm}
        setShowForm={setShowForm}
        calendarDays={calendarDays}
        onAddEvent={handleAddEvent}
        eventToEdit={eventToEdit}
        onUpdateEvent={handleUpdateEvent}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        showModal={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        onDelete={handleDeleteEvent}
        onEdit={handleEditEvent}
      />
    </div>
  )
}
