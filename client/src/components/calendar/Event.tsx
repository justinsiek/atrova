import React, { useRef, useEffect, useState } from 'react'

interface EventProps {
  id: string
  title: string
  startTime: string
  endTime: string
  description?: string
  color: "pink" | "mint" | "blue" | "purple" | "orange"
  style: {
    top: string
    height: string
    className: string
    style?: React.CSSProperties
  }
}

const Event: React.FC<EventProps> = ({ 
  title, 
  startTime, 
  description, 
  style,
  color 
}) => {
  const [displayMode, setDisplayMode] = useState<'full' | 'compact' | 'minimal'>('full');
  const eventRef = useRef<HTMLDivElement>(null);

  // Get border color based on event color
  const getBorderColor = () => {
    if (style.style?.backgroundColor) {
      // Use a darker border based on the event color
      switch (color) {
        case 'pink': return '#e3b3ac';
        case 'mint': return '#bacbb7';
        case 'blue': return '#b6cede';
        case 'purple': return '#c9b8d9';
        case 'orange': return '#e7c3a7';
        default: return '#d6cebf'; // Default to borderMedium
      }
    }
    return undefined;
  };

  // Check the event height and adjust display mode accordingly
  useEffect(() => {
    const checkHeight = () => {
      if (eventRef.current) {
        const eventHeight = eventRef.current.clientHeight;
        if (eventHeight < 40) {
          setDisplayMode('minimal');
        } else if (eventHeight < 50) {
          setDisplayMode('compact');
        } else {
          setDisplayMode('full');
        }
      }
    };
    
    checkHeight();
    window.addEventListener('resize', checkHeight);
    return () => window.removeEventListener('resize', checkHeight);
  }, []);

  return (
    <div
      ref={eventRef}
      style={{ 
        top: style.top, 
        height: style.height,
        ...style.style,
        borderColor: getBorderColor(),
      }}
      className={`${style.className} text-sm overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-2 border-solid`}
    >
      {displayMode === 'minimal' ? (
        // Extremely small height - just show title with minimal or no padding
        <div className="h-full flex items-center px-0.5 py-0 overflow-visible">
          <div className="text-xs font-semibold truncate w-full">{title}</div>
        </div>
      ) : displayMode === 'compact' ? (
        // Compact display - include time and title
        <div className="h-full flex flex-col justify-center px-0.5 py-0 overflow-visible">
          <div className="text-xs text-gray-500 truncate leading-none mb-0.5">{startTime}</div>
          <div className="text-xs font-bold truncate leading-tight">{title}</div>
        </div>
      ) : (
        // Regular display
        <div className="flex flex-col h-full px-0.5">
          <div className="text-xs text-gray-500 truncate">{startTime}</div>
          <div className="font-bold text-sm truncate">{title}</div>
          {description && (
            <div className="text-xs text-gray-500 mt-1 line-clamp-2 overflow-hidden">{description}</div>
          )}
        </div>
      )}
    </div>
  )
}

export default Event
