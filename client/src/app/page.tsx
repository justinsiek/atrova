"use client"

import { useState, useEffect } from "react"

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

export default function Page() {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Add useEffect to update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // 60000 ms = 1 minute

    return () => clearInterval(timer) // Cleanup on unmount
  }, [])

  // Add useEffect to handle scroll positioning
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
  }, []) // Empty dependency array means this runs once on mount

  // Calculate the most recent Monday as the start of the week.
  const diffToMonday = currentTime.getDay() === 0 ? 6 : currentTime.getDay() - 1
  const monday = new Date(currentTime)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(monday.getDate() - diffToMonday)

  // Generate the calendar days from Monday to Sunday.
  const calendarDays = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(monday)
    date.setDate(date.getDate() + offset)
    return {
      day: date.getDate(),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      isToday: date.toDateString() === currentTime.toDateString(),
    }
  })

  // State for events
  const [events, setEvents] = useState<Event[]>(EVENTS)

  // State for the Add Event modal form.
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newStartTime, setNewStartTime] = useState("")
  const [newDuration, setNewDuration] = useState("")
  // Set default day to today's day (number) initially.
  const [newDate, setNewDate] = useState(
    calendarDays.find((day) => day.isToday)?.day.toString() || calendarDays[0].day.toString()
  )

  // Helper function to compute the end time string by adding a duration (in minutes) to startTime.
  const calculateEndTime = (startTime: string, duration: number): string => {
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const totalMinutes = startHour * 60 + startMinute + duration
    const endHour = Math.floor(totalMinutes / 60)
    const endMinute = totalMinutes % 60
    return `${endHour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")}`
  }

  // Add this helper function to scroll to an event
  const scrollToEvent = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const minutesSinceMidnight = hours * 60 + minutes
    const position = (minutesSinceMidnight * 2) + 32 // Same calculation as event positioning
    
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

  // Modify the handleAddEvent function
  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const durationMinutes = parseInt(newDuration)
    if (!newTitle || !newStartTime || isNaN(durationMinutes)) {
      return
    }
    const newEndTime = calculateEndTime(newStartTime, durationMinutes)
    const newEventObj: Event = {
      id: Date.now().toString(),
      title: newTitle,
      startTime: newStartTime,
      endTime: newEndTime,
      date: parseInt(newDate),
      color: "blue",
    }

    setEvents((prev) => [...prev, newEventObj])
    setNewTitle("")
    setNewStartTime("")
    setNewDuration("")
    setNewDate(calendarDays.find((day) => day.isToday)?.day.toString() || calendarDays[0].day.toString())
    setShowForm(false)
    
    // Add this line to scroll to the new event
    scrollToEvent(newStartTime)
  }

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
    return (minutesSinceMidnight * 2) + 32 - 10 // Subtract half the height of the time label (approximately 20px)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-8 relative">
      {/* Header */}
      <div className="grid grid-cols-7 gap-4 mb-4 ml-16">
        {calendarDays.map((day) => (
          <div key={day.day} className="text-center">
            <div
              className={`text-4xl font-light ${
                day.isToday ? "text-black" : "text-gray-300"
              }`}
            >
              {day.day}
            </div>
            <div
              className={`text-sm ${
                day.isToday ? "text-black" : "text-gray-300"
              }`}
            >
              {day.weekday}
            </div>
            <div className="h-4 flex justify-center">
              {day.isToday && <div className="w-0.5 h-full bg-black" />}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Grid - Adding scroll container */}
      <div className="h-[600px] overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] calendar-scroll">
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
                    <div
                      key={i}
                      className="absolute left-0 right-0 h-[120px]"
                      style={{ top: `${i * 120}px` }}
                    >
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

            {/* Current Time Indicator - Lower z-index */}
            <div
              className="absolute -left-16 right-0 flex items-center z-[5]"
              style={{ top: `${getCurrentTimePosition()}px` }}
            >
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
                  .map((event) => {
                    const style = getEventStyle(event)
                    return (
                      <div
                        key={event.id}
                        style={{ top: style.top, height: style.height }}
                        className={style.className}
                      >
                        <div className="flex flex-col h-full">
                          <div className="text-xs text-gray-500 mb-1">
                            {event.startTime}
                          </div>
                          <div className="font-medium text-sm">{event.title}</div>
                          {event.description && (
                            <div className="text-xs text-gray-500 mt-1">
                              {event.description}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Event Modal - Higher z-index */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[50]">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Add Event</h2>
            <form onSubmit={handleAddEvent}>
              <div className="mb-3">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              </div>
              {/* Select Day */}
              <div className="mb-3">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Day
                </label>
                <select
                  id="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                >
                  {calendarDays.map((day) => (
                    <option key={day.day} value={day.day}>
                      {day.weekday} {day.day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>
                <input
                  id="startTime"
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration (min)
                </label>
                <input
                  id="duration"
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plus Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-black hover:bg-gray-800 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl"
        title="Add Event"
      >
        +
      </button>
    </div>
  )
}

