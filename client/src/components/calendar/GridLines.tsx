import React from 'react';

interface Day {
  day: number;
  month: number;
  year: number;
  weekday: string;
  isToday: boolean;
}

interface GridLinesProps {
  calendarDays: Day[];
}

const GRID_HOURS = Array.from({ length: 24 }, (_, i) => i);

export const GridLines: React.FC<GridLinesProps> = ({ calendarDays }) => {
  return (
    <div className="absolute inset-x-0 top-8 grid grid-cols-7 gap-0 pointer-events-none">
      {calendarDays.map((day) => (
        <div key={day.day} className="relative">
          {GRID_HOURS.map((i) => (
            <div key={i} className="absolute left-0 right-0 h-[120px]" style={{ top: `${i * 120}px` }}>
              <div className={`border-t border-[#ceccc3] w-full`} />
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
  );
}; 