import React from 'react';

interface TimeLabelsProps {
  showTimeLabels: boolean;
}

const HOURS = Array.from({ length: 25 }, (_, i) => {
  if (i === 24) return "00:00"
  return `${i.toString().padStart(2, "0")}:00`
})

export const TimeLabels: React.FC<TimeLabelsProps> = ({ showTimeLabels }) => {
  if (!showTimeLabels) return null;
  
  return (
    <div className="absolute -left-16 top-8 text-sm text-[#ceccc3] transform -translate-y-2.5">
      {HOURS.map((hour, i) => (
        <div key={`hour-${i}`} style={{ position: "absolute", top: `${i * 120}px` }}>
          {hour}
        </div>
      ))}
    </div>
  );
}; 