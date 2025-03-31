import { useState, useEffect } from "react"
import { COLORS } from "@/constants/colors"
import { EventType } from "@/types"

interface CalendarDay {
  day: number
  weekday: string
  isToday: boolean
  month: number
  year: number
}

interface EventFormProps {
  showForm: boolean
  setShowForm: (show: boolean) => void
  calendarDays: CalendarDay[]
  onAddEvent: (event: {
    title: string
    startTime: string
    endTime: string
    timestamp?: number
    color?: "pink" | "mint" | "blue" | "purple" | "orange"
    description?: string
    isRecurring?: boolean
    recurringDays?: string
    recurringEndDate?: string | null
  }) => void
  eventToEdit?: EventType | null
  onUpdateEvent?: (id: string, event: Omit<EventType, 'id'>) => void
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

// Helper function to format a Date object to YYYY-MM-DD format for date inputs
const formatDateForInput = (dateObj: Date | null): string => {
  if (!dateObj) return ""
  // Format as YYYY-MM-DD for date input
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0') // +1 because months are 0-indexed
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function EventForm({ showForm, setShowForm, calendarDays, onAddEvent, eventToEdit, onUpdateEvent }: EventFormProps) {
  const [newTitle, setNewTitle] = useState("")
  const [newStartTime, setNewStartTime] = useState("")
  const [newDuration, setNewDuration] = useState("")
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDateForInput(new Date())
  )
  const [newDescription, setNewDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState<"pink" | "mint" | "blue" | "purple" | "orange">("blue")
  const [isRecurring, setIsRecurring] = useState(false)
  const [selectedDays, setSelectedDays] = useState<boolean[]>(Array(7).fill(false))
  const [recurringEndDate, setRecurringEndDate] = useState("")
  
  // Update form when eventToEdit changes
  useEffect(() => {
    if (eventToEdit) {
      console.log('Setting form data from event:', eventToEdit);
      setNewTitle(eventToEdit.title || "")
      setNewStartTime(eventToEdit.startTime || "")
      setNewDuration(calculateDuration(eventToEdit.startTime, eventToEdit.endTime))
      
      // Convert timestamp to date string for input
      if (eventToEdit.timestamp) {
        setSelectedDate(formatDateForInput(new Date(eventToEdit.timestamp)))
      }
      
      setNewDescription(eventToEdit.description || "")
      setSelectedColor(eventToEdit.color || "blue")
      setIsRecurring(eventToEdit.isRecurring || false)
      setSelectedDays(getBooleanDays(eventToEdit.recurringDays))
      setRecurringEndDate(formatDateForInput(eventToEdit.recurringEndDate ? new Date(eventToEdit.recurringEndDate) : null))
    } else {
      resetForm()
    }
  }, [eventToEdit])

  // Reset form when it's closed
  useEffect(() => {
    if (!showForm) {
      // Reset only if form is closing
      resetForm();
    }
  }, [showForm]);

  const calculateDuration = (start: string, end: string): string => {
    const [startHour, startMinute] = start.split(":").map(Number)
    const [endHour, endMinute] = end.split(":").map(Number)
    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute
    return (endMinutes - startMinutes).toString()
  }

  const getBooleanDays = (binaryDays?: string | null): boolean[] => {
    if (!binaryDays) return Array(7).fill(false)
    return binaryDays.split('').map(day => day === '1')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const durationMinutes = parseInt(newDuration)
    if (!newTitle || !newStartTime || isNaN(durationMinutes) || !selectedDate) {
      return
    }
    const newEndTime = calculateEndTime(newStartTime, durationMinutes)
    
    // Parse the selected date
    const dateObj = new Date(selectedDate + "T12:00:00") // Use noon time to avoid timezone issues
    const timestamp = dateObj.getTime()
    
    if (eventToEdit && onUpdateEvent) {
      // Update existing event
      onUpdateEvent(eventToEdit.id, {
        title: newTitle,
        startTime: newStartTime,
        endTime: newEndTime,
        timestamp: timestamp,
        description: newDescription || undefined,
        color: selectedColor,
        isRecurring,
        recurringDays: isRecurring ? getBinaryDays() : null,
        recurringEndDate: isRecurring && recurringEndDate 
          ? new Date(recurringEndDate + "T12:00:00").getTime().toString() 
          : null
      });
    } else {
      // Create new event
      onAddEvent({
        title: newTitle,
        startTime: newStartTime,
        endTime: newEndTime,
        timestamp,
        description: newDescription || undefined,
        color: selectedColor,
        isRecurring,
        recurringDays: isRecurring ? getBinaryDays() : undefined,
        recurringEndDate: isRecurring && recurringEndDate 
          ? new Date(recurringEndDate + "T12:00:00").getTime().toString() 
          : undefined
      });
    }

    // Reset form
    resetForm();
    setShowForm(false);
  }
  
  const resetForm = () => {
    setNewTitle("")
    setNewStartTime("")
    setNewDuration("")
    setNewDescription("")
    setSelectedColor("blue")
    setIsRecurring(false)
    setSelectedDays(Array(7).fill(false))
    setRecurringEndDate("")
    setSelectedDate(formatDateForInput(new Date()))
  }

  const formTitle = eventToEdit ? "Edit Event" : "Add Event"
  const submitButtonText = eventToEdit ? "Update" : "Add"

  // Helper to compute end time from a start time and a duration
  const calculateEndTime = (startTime: string, duration: number): string => {
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const totalMinutes = startHour * 60 + startMinute + duration
    const endHour = Math.floor(totalMinutes / 60)
    const endMinute = totalMinutes % 60
    return `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`
  }

  const handleDayToggle = (index: number) => {
    const newSelectedDays = [...selectedDays]
    newSelectedDays[index] = !newSelectedDays[index]
    setSelectedDays(newSelectedDays)
  }

  const getBinaryDays = (): string => {
    return selectedDays.map(day => day ? "1" : "0").join("")
  }

  if (!showForm) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#2C2C2C] bg-opacity-50 z-[50]">
      <div className="bg-[#FAF9F6] p-6 rounded-lg shadow-lg w-[480px] border border-[#E2DFD8]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#2C2C2C]">{formTitle}</h2>
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className="text-sm text-[#2C2C2C]">Recurring</span>
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="form-checkbox h-4 w-4 text-[#2C2C2C]"
            />
          </label>
        </div>
        <form onSubmit={handleSubmit}>
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
                {isRecurring ? "Start Date" : "Date"}
              </label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 block w-full border border-[#E2DFD8] rounded-lg p-2.5 bg-white focus:outline-none focus:border-[#2C2C2C] transition-colors duration-200"
              />
            </div>
            
            {isRecurring && (
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                  Repeat on
                </label>
                <div className="flex flex-wrap gap-1">
                  {WEEKDAYS.map((day, index) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(index)}
                      className={`w-8 h-8 text-xs rounded-full flex items-center justify-center transition-colors ${
                        selectedDays[index]
                          ? "bg-[#2C2C2C] text-white"
                          : "bg-white text-[#2C2C2C] border border-[#E2DFD8]"
                      }`}
                    >
                      {day.substring(0, 1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
          {isRecurring && (
            <div className="mb-4">
              <label htmlFor="endDate" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="endDate"
                value={recurringEndDate}
                onChange={(e) => setRecurringEndDate(e.target.value)}
                className="mt-1 block w-full border border-[#E2DFD8] rounded-lg p-2.5 bg-white focus:outline-none focus:border-[#2C2C2C] transition-colors duration-200"
              />
            </div>
          )}
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
          <div className="mb-5">
            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Color
            </label>
            <div className="flex gap-3">
              <ColorOption 
                color="pink" 
                bgColor={COLORS.eventPink} 
                selectedColor={selectedColor} 
                onSelect={setSelectedColor} 
              />
              <ColorOption 
                color="mint" 
                bgColor={COLORS.eventMint} 
                selectedColor={selectedColor} 
                onSelect={setSelectedColor} 
              />
              <ColorOption 
                color="blue" 
                bgColor={COLORS.eventBlue} 
                selectedColor={selectedColor} 
                onSelect={setSelectedColor} 
              />
              <ColorOption 
                color="purple" 
                bgColor={COLORS.eventPurple} 
                selectedColor={selectedColor} 
                onSelect={setSelectedColor} 
              />
              <ColorOption 
                color="orange" 
                bgColor={COLORS.eventOrange} 
                selectedColor={selectedColor} 
                onSelect={setSelectedColor} 
              />
            </div>
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
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface ColorOptionProps {
  color: "pink" | "mint" | "blue" | "purple" | "orange"
  bgColor: string
  selectedColor: string
  onSelect: (color: "pink" | "mint" | "blue" | "purple" | "orange") => void
}

function ColorOption({ color, bgColor, selectedColor, onSelect }: ColorOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(color)}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
        selectedColor === color ? "ring-2 ring-[#2C2C2C]" : ""
      }`}
      style={{ backgroundColor: bgColor }}
    >

    </button>
  )
}
