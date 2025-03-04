import React from 'react'

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

  return (
    <div
      style={{ 
        top: style.top, 
        height: style.height,
        ...style.style,
        borderColor: getBorderColor(),
      }}
      className={`${style.className} overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-2 border-solid`}
    >
      <div className="flex flex-col h-full px-0.5 ">
        <div className="text-xs text-gray-500 truncate">{startTime}</div>
        <div className="font-bold text-sm truncate">{title}</div>
        {description && (
          <div className="text-xs text-gray-500 mt-1 line-clamp-2 overflow-hidden">{description}</div>
        )}
      </div>
    </div>
  )
}

export default Event
