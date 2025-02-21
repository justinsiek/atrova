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

const EVENTS: Event[] = [
  {
    id: "1",
    title: "Call with John",
    startTime: "08:00",
    endTime: "08:45",
    date: 17,
    color: "pink",
  },
  {
    id: "2",
    title: "Make logo bigger",
    startTime: "10:30",
    endTime: "11:00",
    date: 17,
    color: "blue",
  },
  {
    id: "3",
    title: "Make final layout improvements",
    startTime: "08:30",
    endTime: "13:00",
    date: 18,
    color: "mint",
  },
  {
    id: "4",
    title: "Discussing the project feedback",
    startTime: "08:00",
    endTime: "10:30",
    date: 19,
    color: "pink",
  },
  {
    id: "5",
    title: "Design Onboarding",
    startTime: "08:30",
    endTime: "17:30",
    date: 20,
    color: "blue",
    description: "Urgent preparation of onboarding flow for the web app",
  },
  {
    id: "6",
    title: "Interview with John C.",
    startTime: "08:00",
    endTime: "09:00",
    date: 22,
    color: "pink",
  },
  {
    id: "7",
    title: "Test App prototypes",
    startTime: "11:30",
    endTime: "13:30",
    date: 22,
    color: "mint",
  },
  {
    id: "8",
    title: "Team Lunch",
    startTime: "12:00",
    endTime: "13:00",
    date: 17,
    color: "mint",
  },
  {
    id: "9",
    title: "Client Meeting",
    startTime: "14:00",
    endTime: "15:30",
    date: 18,
    color: "blue",
  },
  {
    id: "10",
    title: "Code Review",
    startTime: "16:00",
    endTime: "17:00",
    date: 19,
    color: "mint",
  },
  {
    id: "11",
    title: "Project Planning",
    startTime: "18:00",
    endTime: "19:30",
    date: 20,
    color: "pink",
  },
  {
    id: "12",
    title: "Evening Standup",
    startTime: "20:00",
    endTime: "20:30",
    date: 21,
    color: "blue",
  },
  {
    id: "13",
    title: "Late Night Deploy",
    startTime: "22:00",
    endTime: "23:00",
    date: 22,
    color: "mint",
  },
]

const HOURS = Array.from({ length: 25 }, (_, i) => {
  return `${i.toString().padStart(2, "0")}:00`
})

export default function Page() {
  const [currentTime] = useState(new Date())
  const currentHour = currentTime.getHours()
  const currentMinute = currentTime.getMinutes()

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
    <div className="w-full max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 mb-4">
        {DAYS.map((day) => (
          <div key={day.day} className="text-center">
            <div className={`text-4xl font-light ${day.day === 18 ? "text-black" : "text-gray-300"}`}>{day.day}</div>
            <div className={`text-sm ${day.day === 18 ? "text-black" : "text-gray-300"}`}>{day.weekday}</div>
            <div className="h-4 flex justify-center">{day.day === 18 && <div className="w-0.5 h-full bg-black" />}</div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="relative grid grid-cols-6 gap-4">
        {/* Time Labels */}
        <div className="absolute -left-16 top-0 space-y-[110px] text-sm text-gray-400">
          {HOURS.map((hour) => (
            <div key={hour}>{hour}</div>
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
            {EVENTS.filter((event) => event.date === day.day).map((event) => {
              const style = getEventStyle(event)
              return (
                <div key={event.id} style={style} className={style.className}>
                  <div className="flex flex-col h-full">
                    <div className="text-xs text-gray-500 mb-1">{event.startTime}</div>
                    <div className="font-medium text-sm">{event.title}</div>
                    {event.description && <div className="text-xs text-gray-500 mt-1">{event.description}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

