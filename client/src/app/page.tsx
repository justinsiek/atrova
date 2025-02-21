"use client"

import { useState } from "react"

interface Event {
  id: string
  title: string
  startTime: string
  endTime: string
  date: number
  color: "pink" | "mint" | "blue"
  description?: string
}

const DAYS = [
  { day: 17, weekday: "Mon" },
  { day: 18, weekday: "Tue" },
  { day: 19, weekday: "Wed" },
  { day: 20, weekday: "Thu" },
  { day: 21, weekday: "Fri" },
  { day: 22, weekday: "Sat" },
]

const EVENTS: Event[] = []

const HOURS = Array.from({ length: 25 }, (_, i) => {
  return `${i.toString().padStart(2, "0")}:00`
})

export default function Page() {
  const [currentTime] = useState(new Date())
  const currentHour = currentTime.getHours()
  const currentMinute = currentTime.getMinutes()

  // Set up events state so we can add new events dynamically.
  const [events, setEvents] = useState<Event[]>(EVENTS)

  // State for the Add Event modal form.
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newStartTime, setNewStartTime] = useState("")
  const [newDuration, setNewDuration] = useState("")
  // New state to choose the day for the event. Default set to "18" (Tuesday).
  const [newDate, setNewDate] = useState("18")

  // Helper function to compute the end time string by adding duration (in minutes) to startTime.
  const calculateEndTime = (startTime: string, duration: number): string => {
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const totalMinutes = startHour * 60 + startMinute + duration
    const endHour = Math.floor(totalMinutes / 60)
    const endMinute = totalMinutes % 60
    return `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`
  }

  // Handle the form submission: Create a new event and update the state.
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
      date: parseInt(newDate), // Use selected day.
      color: "blue", // Default color.
    }

    setEvents(prev => [...prev, newEventObj])
    setNewTitle("")
    setNewStartTime("")
    setNewDuration("")
    setNewDate("18")
    setShowForm(false)
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
    return (currentHour * 60 + currentMinute) * 2
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-8 relative">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 mb-4">
        {DAYS.map((day) => (
          <div key={day.day} className="text-center">
            <div className={`text-4xl font-light ${day.day === 18 ? "text-black" : "text-gray-300"}`}>
              {day.day}
            </div>
            <div className={`text-sm ${day.day === 18 ? "text-black" : "text-gray-300"}`}>
              {day.weekday}
            </div>
            <div className="h-4 flex justify-center">
              {day.day === 18 && <div className="w-0.5 h-full bg-black" />}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="relative grid grid-cols-6 gap-4">
        {/* Time Labels */}
        <div className="absolute -left-16 top-0 text-sm text-gray-400 transform -translate-y-2.5">
          {HOURS.map((hour, i) => (
            <div key={hour} style={{ position: "absolute", top: `${i * 120}px` }}>
              {hour}
            </div>
          ))}
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-6 gap-4 pointer-events-none">
          {DAYS.map((day) => (
            <div key={day.day} className="relative">
              {HOURS.map((_, i) => (
                <div key={i} className="absolute left-0 right-0 h-[120px]" style={{ top: `${i * 120}px` }}>
                  <div className="border-t border-gray-100 w-full" />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Current Time Indicator */}
        <div
          className="absolute left-0 right-0 flex items-center z-10"
          style={{ top: `${getCurrentTimePosition()}px` }}
        >
          <div className="bg-red-500 text-white text-xs px-1 py-0.5 rounded">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: false,
            })}
          </div>
          <div className="flex-1 h-px bg-red-500" />
        </div>

        {/* Events */}
        {DAYS.map((day) => (
          <div key={day.day} className="relative h-[3000px]">
            {events
              .filter((event) => event.date === day.day)
              .map((event) => {
                const style = getEventStyle(event)
                return (
                  <div key={event.id} style={{ top: style.top, height: style.height }} className={style.className}>
                    <div className="flex flex-col h-full">
                      <div className="text-xs text-gray-500 mb-1">{event.startTime}</div>
                      <div className="font-medium text-sm">{event.title}</div>
                      {event.description && (
                        <div className="text-xs text-gray-500 mt-1">{event.description}</div>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Add Event</h2>
            <form onSubmit={handleAddEvent}>
              <div className="mb-3">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Day
                </label>
                <select
                  id="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                >
                  {DAYS.map((day) => (
                    <option key={day.day} value={day.day}>
                      {day.weekday} {day.day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
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
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl"
        title="Add Event"
      >
        +
      </button>
    </div>
  )
}

