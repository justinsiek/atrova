import React from 'react'

const page = () => {
  const today = new Date()
  const days = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    return {
      number: date.getDate(),
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
    }
  })

  const hours = Array.from({ length: 19 }, (_, i) => {
    const hour = (6 + i) % 12 || 12
    const paddedHour = hour.toString().padStart(2, '0')
    const ampm = i + 6 >= 12 ? 'PM' : 'AM'
    return `${paddedHour} ${ampm}`
  })

  return (
    <div className='flex justify-center items-center w-screen h-screen bg-[#fbf7f4] relative'>
      <div className="w-full max-w-4xl h-[600px] relative">
        <div className="flex justify-between mb-8">
          {days.map((day) => (
            <div key={day.number} className="flex flex-col items-center">
              <span className="text-3xl font-semibold text-black">{day.number}</span>
              <span className="text-sm text-black">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="overflow-y-auto h-[500px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {hours.map((hour, index) => (
            <div key={`${hour}-${index}`} className="h-24 flex space-x-4 justify-center items-center">
              <span className="text-sm text-[#d4d0bd] whitespace-nowrap">{hour}</span>
              <div className="left-0 w-full border-t border-[#d4d0bd] border-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default page