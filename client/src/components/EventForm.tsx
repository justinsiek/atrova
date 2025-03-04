import { useState } from "react"

interface CalendarDay {
  day: number
  weekday: string
  isToday: boolean
}

interface EventFormProps {
  showForm: boolean
  setShowForm: (show: boolean) => void
  calendarDays: CalendarDay[]
  onAddEvent: (event: {
    title: string
    startTime: string
    endTime: string
    date: number
    color?: "pink" | "mint" | "blue" | "purple" | "orange"
    description?: string
  }) => void
}

export default function EventForm({ showForm, setShowForm, calendarDays, onAddEvent }: EventFormProps) {
  const [newTitle, setNewTitle] = useState("")
  const [newStartTime, setNewStartTime] = useState("")
  const [newDuration, setNewDuration] = useState("")
  const [newDate, setNewDate] = useState(
    calendarDays.find((day) => day.isToday)?.day.toString() || calendarDays[0].day.toString()
  )
  const [newDescription, setNewDescription] = useState("")

  // Helper to compute end time from a start time and a duration
  const calculateEndTime = (startTime: string, duration: number): string => {
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const totalMinutes = startHour * 60 + startMinute + duration
    const endHour = Math.floor(totalMinutes / 60)
    const endMinute = totalMinutes % 60
    return `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`
  }

  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const durationMinutes = parseInt(newDuration)
    if (!newTitle || !newStartTime || isNaN(durationMinutes)) {
      return
    }
    const newEndTime = calculateEndTime(newStartTime, durationMinutes)
    
    onAddEvent({
      title: newTitle,
      startTime: newStartTime,
      endTime: newEndTime,
      date: parseInt(newDate),
      description: newDescription || undefined,
    })

    // Reset form
    setNewTitle("")
    setNewStartTime("")
    setNewDuration("")
    setNewDescription("")
    setNewDate(calendarDays.find((day) => day.isToday)?.day.toString() || calendarDays[0].day.toString())
    setShowForm(false)
  }

  if (!showForm) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#2C2C2C] bg-opacity-50 z-[50]">
      <div className="bg-[#FAF9F6] p-6 rounded-lg shadow-lg w-[480px] border border-[#E2DFD8]">
        <h2 className="text-2xl font-bold text-[#2C2C2C] mb-4">Add Event</h2>
        <form onSubmit={handleAddEvent}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mt-1 block w-full border border-[#E2DFD8] rounded-lg p-2.5 bg-white focus:outline-none focus:border-[#2C2C2C] transition-colors duration-200"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                Day
              </label>
              <select
                id="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="mt-1 block w-full border border-[#E2DFD8] rounded-lg p-2.5 bg-white focus:outline-none focus:border-[#2C2C2C] transition-colors duration-200"
              >
                {calendarDays.map((day) => (
                  <option key={day.day} value={day.day}>
                    {day.weekday} {day.day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                Start Time
              </label>
              <input
                id="startTime"
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="mt-1 block w-full border border-[#E2DFD8] rounded-lg p-2.5 bg-white focus:outline-none focus:border-[#2C2C2C] transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                Duration (min)
              </label>
              <input
                id="duration"
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="mt-1 block w-full border border-[#E2DFD8] rounded-lg p-2.5 bg-white focus:outline-none focus:border-[#2C2C2C] transition-colors duration-200"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-[#E2DFD8] rounded-lg p-2.5 bg-white focus:outline-none focus:border-[#2C2C2C] transition-colors duration-200 resize-none"
              placeholder="Add details about this event..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 bg-[#E2DFD8] text-[#2C2C2C] rounded-lg hover:bg-[#D8D4CC] transition-colors duration-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2C2C2C] text-[#FAF9F6] rounded-lg hover:bg-[#403F3E] transition-colors duration-200 focus:outline-none"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
