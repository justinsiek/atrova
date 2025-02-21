"use client"

import { useState, useEffect } from "react"
import { Domine } from "next/font/google"
import EventForm from './EventForm'
import Event from './Event'

interface Event {
  id: string
  title: string
  startTime: string
  endTime: string
  date: number
  color: "pink" | "mint" | "blue"
  description?: string
}

const EVENTS: Event[] = []

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
}

export default function Calendar({ showForm, setShowForm }: CalendarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Scroll to the current time when the component mounts.
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

  // Calculate the most recent Monday.
  const diffToMonday = currentTime.getDay() === 0 ? 6 : currentTime.getDay() - 1
  const monday = new Date(currentTime)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(monday.getDate() - diffToMonday)

  // Build calendar days (Monday to Sunday).
  const calendarDays = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(monday)
    date.setDate(date.getDate() + offset)
    return {
      day: date.getDate(),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      isToday: date.toDateString() === currentTime.toDateString(),
    }
  })

  // State for events.
  const [events, setEvents] = useState<Event[]>(EVENTS)

  // Helper to scroll to a specific time/event.
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

  // Update handleAddEvent to:
  const handleAddEvent = (newEventData: {
    title: string
    startTime: string
    endTime: string
    date: number
    color: "pink" | "mint" | "blue"
  }) => {
    const newEventObj = {
      id: Date.now().toString(),
      ...newEventData,
    }
    setEvents((prev) => [...prev, newEventObj])
    scrollToEvent(newEventData.startTime)
  }

  // Get positioning style for an event.
  const getEventStyle = (event: Event) => {
    const [startHour, startMinute] = event.startTime.split(":").map(Number)
    const [endHour, endMinute] = event.endTime.split(":").map(Number)

    const startOffset = (startHour * 60 + startMinute) * 2
    const duration = ((endHour - startHour) * 60 + (endMinute - startMinute)) * 2

    const colors = {
      pink: "bg-pink-100",
      mint: "bg-green-100",
      blue: "bg-blue-100",
    }

    return {
      top: `${startOffset}px`,
      height: `${duration}px`,
      className: `absolute left-1 right-1 rounded-lg p-3 ${colors[event.color]}`,
    }
  }

  const getCurrentTimePosition = () => {
    const minutesSinceMidnight = currentTime.getHours() * 60 + currentTime.getMinutes()
    return (minutesSinceMidnight * 2) + 32 - 10
  }

  return (
    <div className="w-full h-[calc(100vh-32px)] mx-auto p-8 relative bg-[#fbf7f4]">
      {/* Header */}
      <div className="grid grid-cols-7 gap-4 mb-4 ml-16">
        {calendarDays.map((day) => (
          <div key={day.day} className="text-center">
            <div className={`text-4xl font-bold ${domine.className} ${day.isToday ? "text-black" : "text-gray-300"}`}>
              {day.day}
            </div>
            <div className={`text-sm ${day.isToday ? "text-black" : "text-gray-300"}`}>
              {day.weekday}
            </div>
            <div className="h-4 flex justify-center">
              {day.isToday && <div className="w-0.5 h-full bg-red-500" />}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="h-[calc(100vh-160px)] overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] calendar-scroll">
        <div className="relative ml-16">
          {/* Time Labels */}
          <div className="absolute -left-16 top-8 text-sm text-gray-400 transform -translate-y-2.5">
            {HOURS.map((hour, i) => (
              <div key={`hour-${i}`} style={{ position: "absolute", top: `${i * 120}px` }}>
                {hour}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-4 pt-8">
            {/* Grid Lines */}
            <div className="absolute inset-x-0 top-8 grid grid-cols-7 gap-0 pointer-events-none">
              {calendarDays.map((day) => (
                <div key={day.day} className="relative">
                  {GRID_HOURS.map((i) => (
                    <div key={i} className="absolute left-0 right-0 h-[120px]" style={{ top: `${i * 120}px` }}>
                      <div className="border-t border-gray-300 w-full" />
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

            {/* Current Time Indicator */}
            <div className="absolute -left-16 right-0 flex items-center z-[5]" style={{ top: `${getCurrentTimePosition()}px` }}>
              <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: false,
                  hourCycle: "h23",
                })}
              </div>
              <div className="flex-1 h-px bg-red-500" />
            </div>

            {/* Events */}
            {calendarDays.map((day) => (
              <div key={day.day} className="relative h-[2880px]">
                {events
                  .filter((event) => event.date === day.day)
                  .map((event) => (
                    <Event
                      key={event.id}
                      {...event}
                      style={getEventStyle(event)}
                    />
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
    </div>
  )
}
