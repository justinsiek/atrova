import React from 'react';
import { Domine } from "next/font/google";

interface Day {
  day: number;
  month: number;
  year: number;
  weekday: string;
  isToday: boolean;
}

interface DaysHeaderProps {
  calendarDays: Day[];
}

const domine = Domine({
  subsets: ['latin'],
  weight: '700',
});

export const DaysHeader: React.FC<DaysHeaderProps> = ({ calendarDays }) => {
  return (
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
            {day.isToday && <div className="w-0.5 h-FULL bg-red-500" />}
          </div>
        </div>
      ))}
    </div>
  );
}; 