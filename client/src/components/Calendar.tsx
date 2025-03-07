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
import { fetchEvents, createEvent, deleteEvent } from '@/services/api'
import { EventType } from '@/types'

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
}

export default function Calendar({ showForm, setShowForm, scheduleWithAI, aiStatus, getRandomColor }: CalendarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [events, setEvents] = useState<EventType[]>([])
  const [view, setView] = useState<'week' | 'day'>('week')
  const [weekOffset, setWeekOffset] = useState(0)
  const [showTimeLabels, setShowTimeLabels] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        setError('Failed to load events. Please try again later.');
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

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
      const scrollTo = currentTimePosition - (containerHeight / 2)
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
    const position = (minutesSinceMidnight * 2) + 32
    
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
    date?: number;
    color?: "pink" | "mint" | "blue" | "purple" | "orange";
    description?: string;
    isRecurring?: boolean;
    recurringDays?: string;
    recurringEndDate?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('handleAddEvent called with data:', newEventData);
      
      const newEventObj = {
        ...newEventData,
        date: newEventData.date || calendarDays[0].day,
        color: newEventData.color || getRandomColor(),
        aiGenerated: false,
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
    return (minutesSinceMidnight * 2) + 32 - 10
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
        addEvent={() => setShowForm(true)}
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
          <TimeLabels showTimeLabels={showTimeLabels} />

          <div className="grid grid-cols-7 pt-8">
            {/* Grid Lines */}
            <GridLines calendarDays={calendarDays} />

            {/* Current Time Indicator */}
            <CurrentTimeIndicator 
              currentTime={currentTime} 
              showIndicator={calendarDays.some(day => day.isToday)} 
            />

            {/* Loading state */}
            {isLoading && events.length === 0 ? (
              <div className="col-span-7 flex justify-center items-center mt-10">
                <div className="text-gray-500">Loading events...</div>
              </div>
            ) : (
              /* Events Display */
              <EventsDisplay 
                calendarDays={calendarDays}
                events={events}
                onEventClick={handleEventClick}
                onEventAdd={(newEvent) => {
                  handleAddEvent({
                    title: newEvent.title,
                    startTime: newEvent.startTime,
                    endTime: newEvent.endTime,
                    date: newEvent.date,
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
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        showModal={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        onDelete={handleDeleteEvent}
      />
    </div>
  )
}
