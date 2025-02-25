"use client"

import { Domine } from "next/font/google"

const domine = Domine({
  subsets: ['latin'],
  weight: '700',
})

interface CalendarDay {
  day: number
  weekday: string
  isToday: boolean
}

interface CalHeaderProps {
  calendarDays: CalendarDay[]
}

export default function CalHeader({ calendarDays }: CalHeaderProps) {
  return (
    <div className="grid grid-cols-7 gap-4 mb-4 ml-16">
      {calendarDays.map((day) => (
        <div key={day.day} className="text-center">
          <div className={`text-4xl font-bold ${domine.className} ${day.isToday ? "text-black" : "text-amber-300"}`}>
            {day.day}
          </div>
          <div className={`text-sm ${day.isToday ? "text-black" : "text-amber-400"}`}>
            {day.weekday}
          </div>
          <div className="h-4 flex justify-center">
            {day.isToday && <div className="w-0.5 h-full bg-red-500" />}
          </div>
        </div>
      ))}
    </div>
  )
}
