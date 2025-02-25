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
  style 
}) => {
  return (
    <div
      style={{ 
        top: style.top, 
        height: style.height,
        ...style.style
      }}
      className={style.className}
    >
      <div className="flex flex-col h-full">
        <div className="text-xs text-gray-500 mb-1">{startTime}</div>
        <div className="font-medium text-sm">{title}</div>
        {description && (
          <div className="text-xs text-gray-500 mt-1">{description}</div>
        )}
      </div>
    </div>
  )
}

export default Event
