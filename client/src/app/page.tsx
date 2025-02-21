import React from 'react'

const page = () => {
  const hours = Array.from({ length: 6 }, (_, i) => {
    const hour = (8 + i) % 12 || 12
    const paddedHour = hour.toString().padStart(2, '0')
    const ampm = i + 8 < 12 ? 'AM' : 'PM'
    return `${paddedHour} ${ampm}`
  })

  return (
    <div className='flex justify-center items-center w-screen h-screen bg-[#fbf7f4] relative'>
      <div className="w-full max-w-4xl relative">
        {hours.map((hour, index) => (
          <div key={hour} className="h-24 flex space-x-4 justify-center items-center">
            <span className="text-sm text-[#d4d0bd] whitespace-nowrap">{hour}</span>
            <div className="left-0 w-full border-t border-[#ede6d6] border-2" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default page