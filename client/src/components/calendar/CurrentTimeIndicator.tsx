import React from 'react';
import { motion } from 'framer-motion';

interface CurrentTimeIndicatorProps {
  currentTime: Date;
  showIndicator: boolean;
}

export const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({ currentTime, showIndicator }) => {
  if (!showIndicator) return null;

  const getCurrentTimePosition = () => {
    const minutesSinceMidnight = currentTime.getHours() * 60 + currentTime.getMinutes();
    return (minutesSinceMidnight * 2) + 32 - 10;
  };

  return (
    <motion.div 
      className="absolute -left-16 right-0 flex items-center z-[5] pointer-events-none" 
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
  );
}; 