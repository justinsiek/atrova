"use client"

import { useState, useEffect } from "react"
import { Domine } from "next/font/google"
import EventForm from './EventForm'
import Event from './Event'
import { CalendarToolbar } from './CalendarToolbar'
import { motion } from 'framer-motion'
import { AI_STATUS } from '../types'
import { COLORS } from '@/constants/colors'

interface Event {
  id: string
  title: string
  startTime: string
  endTime: string
  date: number
  color: "pink" | "mint" | "blue" | "purple" | "orange"
  description?: string
  aiGenerated?: boolean
}

const EVENTS: Event[] = [
  {
    id: "1",
    title: "Morning meditation",
    startTime: "07:30",
    endTime: "08:00",
    date: 0, // Monday
    color: "mint",
    description: "Focus on breathing and setting intentions for the day"
  },
  {
    id: "2",
    title: "Weekly team meeting",
    startTime: "10:00",
    endTime: "11:30",
    date: 0, // Monday
    color: "blue",
    description: "Discuss project progress and upcoming deadlines"
  },
  {
    id: "3",
    title: "Lunch with Alex",
    startTime: "12:30",
    endTime: "13:30",
    date: 1, // Tuesday
    color: "orange",
    description: "Meet at Cafe Rosemary"
  },
  {
    id: "4",
    title: "Dentist appointment",
    startTime: "15:00",
    endTime: "16:00",
    date: 2, // Wednesday
    color: "pink",
    description: "Annual checkup - bring insurance card"
  },
  {
    id: "5",
    title: "Gym session",
    startTime: "18:00",
    endTime: "19:30",
    date: 2, // Wednesday
    color: "purple",
    description: "Focus on upper body and core"
  },
  {
    id: "6",
    title: "Project deadline",
    startTime: "14:00",
    endTime: "15:00",
    date: 3, // Thursday
    color: "blue",
    description: "Submit final deliverables to client",
    aiGenerated: true
  },
  {
    id: "7",
    title: "Coffee chat with mentor",
    startTime: "09:00",
    endTime: "10:00",
    date: 4, // Friday
    color: "orange",
    description: "Discuss career growth opportunities"
  },
  {
    id: "8",
    title: "Weekend planning",
    startTime: "16:30",
    endTime: "17:00",
    date: 4, // Friday
    color: "mint",
    description: "Organize activities and prepare for weekend"
  },
  {
    id: "9",
    title: "Farmer's market",
    startTime: "10:00",
    endTime: "12:00",
    date: 5, // Saturday
    color: "pink",
    description: "Shop for fresh produce and artisanal goods"
  },
  {
    id: "10",
    title: "Family dinner",
    startTime: "18:00",
    endTime: "20:30",
    date: 6, // Sunday
    color: "purple",
    description: "Make pasta from scratch together"
  }
]

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
}

export default function Calendar({ showForm, setShowForm, scheduleWithAI, aiStatus }: CalendarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [events, setEvents] = useState<Event[]>(EVENTS)
  const [view, setView] = useState<'week' | 'day'>('week')
  const [weekOffset, setWeekOffset] = useState(0)
  const [showTimeLabels, setShowTimeLabels] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showEventDetails, setShowEventDetails] = useState(false)

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
  const baseDate = new Date(currentTime)
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

  const handleAddEvent = (newEventData: {
    title: string
    startTime: string
    endTime: string
    date: number
    color: "pink" | "mint" | "blue" | "purple" | "orange"
    description?: string
  }) => {
    const newEventObj = {
      id: Date.now().toString(),
      ...newEventData,
      aiGenerated: false
    }
    setEvents((prev) => [...prev, newEventObj])
    scrollToEvent(newEventData.startTime)
  }

  // Get positioning style for an event
  const getEventStyle = (event: Event) => {
    const [startHour, startMinute] = event.startTime.split(":").map(Number)
    const [endHour, endMinute] = event.endTime.split(":").map(Number)

    const startOffset = (startHour * 60 + startMinute) * 2
    const duration = ((endHour - startHour) * 60 + (endMinute - startMinute)) * 2

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
    }
  }

  const getCurrentTimePosition = () => {
    const minutesSinceMidnight = currentTime.getHours() * 60 + currentTime.getMinutes()
    return (minutesSinceMidnight * 2) + 32 - 10
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setShowEventDetails(true)
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id))
    setShowEventDetails(false)
  }

  return (
    <div className="w-full h-[calc(100vh-32px)] mx-auto p-4 md:p-8 relative bg-[#fbf7f4]">
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
      
      {/* Header */}
      <div className="grid grid-cols-7 gap-4 mb-4 ml-16">
        {calendarDays.map((day) => (
          <div key={day.day} className="text-center">
            <div className={`text-4xl font-bold ${domine.className} ${day.isToday ? "text-black" : "text-[#ceccc3]"}`}>
              {day.day}
            </div>
            <div className={`text-sm ${day.isToday ? "text-black" : "text-[#ceccc3]"}`}>
              {day.weekday}
            </div>
            <div className="h-4 flex justify-center">
              {day.isToday && <div className="w-0.5 h-full bg-red-500" />}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="h-[calc(100vh-200px)] overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] calendar-scroll">
        <div className="relative ml-16">
          {/* Time Labels */}
          {showTimeLabels && (
            <div className="absolute -left-16 top-8 text-sm text-gray-400 transform -translate-y-2.5">
              {HOURS.map((hour, i) => (
                <div key={`hour-${i}`} style={{ position: "absolute", top: `${i * 120}px` }}>
                  {hour}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-7 gap-4 pt-8">
            {/* Grid Lines */}
            <div className="absolute inset-x-0 top-8 grid grid-cols-7 gap-0 pointer-events-none">
              {calendarDays.map((day) => (
                <div key={day.day} className="relative">
                  {GRID_HOURS.map((i) => (
                    <div key={i} className="absolute left-0 right-0 h-[120px]" style={{ top: `${i * 120}px` }}>
                      <div className={`border-t ${i % 3 === 0 ? 'border-gray-300' : 'border-gray-200'} w-full`} />
                      {i === 23 && (
                        <div className="absolute bottom-0 left-0 right-0">
                          <div className="border-t border-gray-300 w-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Current Time Indicator - Only show if week contains today */}
            {calendarDays.some(day => day.isToday) && (
              <motion.div 
                className="absolute -left-16 right-0 flex items-center z-[5]" 
                style={{ top: `${getCurrentTimePosition()}px` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false,
                    hourCycle: "h23",
                  })}
                </div>
                <div className="flex-1 h-0.5 bg-red-500" />
              </motion.div>
            )}

            {/* Events */}
            {calendarDays.map((day) => (
              <div key={day.day} className="relative h-[2880px]">
                {events
                  .filter((event) => {
                    // Find events that match this day's date
                    const eventDate = new Date(day.year, day.month, event.date)
                    const dayDate = new Date(day.year, day.month, day.day)
                    return eventDate.getDate() === dayDate.getDate() &&
                           eventDate.getMonth() === dayDate.getMonth() &&
                           eventDate.getFullYear() === dayDate.getFullYear()
                  })
                  .map((event) => (
                    <div 
                      key={event.id} 
                      onClick={() => handleEventClick(event)}
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
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
              <button onClick={() => setShowEventDetails(false)} className="text-gray-500 hover:text-gray-700">
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
                <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
              </div>
              
              {selectedEvent.description && (
                <div className="text-gray-700">
                  <p>{selectedEvent.description}</p>
                </div>
              )}
              
              {selectedEvent.aiGenerated && (
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
                onClick={() => handleDeleteEvent(selectedEvent.id)}
                className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50"
              >
                Delete
              </button>
              <button 
                onClick={() => setShowEventDetails(false)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
