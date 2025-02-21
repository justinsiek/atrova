'use client'

import React, { useEffect, useState, useRef } from 'react'

const Page = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const slotHeight = 96
  const decimalHour = currentTime.getHours() + (currentTime.getMinutes() / 60)
  const redLineOffset = (decimalHour * slotHeight) + (slotHeight / 2)

  useEffect(() => {
    if (!containerRef.current) return
    
    const viewportHeight = containerRef.current.clientHeight
    const scrollPosition = redLineOffset - (viewportHeight / 2)
    
    containerRef.current.scrollTop = scrollPosition
  }, [redLineOffset]) 

  const hours = Array.from({ length: 24 }, (_, i) => ({
    label: `${i % 12 || 12}`.padStart(2, '0') + ` ${i >= 12 ? 'PM' : 'AM'}`,
    index: i
  }))

  return (
    <div className='flex justify-center items-center w-screen h-screen bg-[#fbf7f4] relative'>
      <div className="w-full max-w-4xl h-[600px] relative">
        <div 
          ref={containerRef}
          className="overflow-y-auto h-[500px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
          <div className="relative" style={{ height: `${hours.length * slotHeight}px` }}>
            {/* Red line and time indicator */}
            <div 
              className="absolute left-0 right-0 border-t-2 border-red-500 z-10" 
              style={{ top: redLineOffset }}
            />
            <div 
              className="absolute left-0 z-20 bg-red-500 text-white p-1 text-sm" 
              style={{ top: redLineOffset, transform: 'translateY(-50%)' }}
            >
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            
            {hours.map(({ label, index }) => (
              <div key={index} className="h-24 flex space-x-4 justify-center items-center">
                <span className="text-sm text-black whitespace-nowrap">{label}</span>
                <div className="left-0 w-full border-t-2 border-black" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page