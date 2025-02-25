import { useState } from 'react'
import { COLORS } from "@/constants/colors"

interface TaskFormProps {
  showForm: boolean
  setShowForm: (show: boolean) => void
  onAddTask: (task: {
    title: string
    priority?: 'low' | 'medium' | 'high'
    dueDate?: string
  }) => void
}

const TaskForm = ({ showForm, setShowForm, onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('')
  const [dueDate, setDueDate] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) return

    onAddTask({ 
      title: title.trim(),
      priority: priority || undefined,
      dueDate: dueDate || undefined
    })
    
    // Reset form
    setTitle("")
    setPriority("")
    setDueDate("")
    setShowForm(false)
  }

  if (!showForm) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-[50]">
      <div 
        className="p-8 rounded-lg shadow-lg w-96"
        style={{ backgroundColor: COLORS.paperWhite, border: `1px solid ${COLORS.borderLight}` }}
      >
        <h2 
          className="text-2xl font-bold mb-6"
          style={{ color: COLORS.darkBrown }}
        >
          Add Task
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="title" 
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.darkBrown }}
            >
              Task Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border rounded-lg p-3 bg-white focus:outline-none transition-colors duration-200"
              style={{ 
                borderColor: COLORS.borderMedium,
                color: COLORS.darkBrown
              }}
              placeholder="Enter task title"
            />
          </div>

          <div className="mb-4">
            <label 
              htmlFor="priority" 
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.darkBrown }}
            >
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`text-sm py-2 px-3 rounded-md transition-colors`}
                style={{
                  backgroundColor: priority === 'low' ? COLORS.info : COLORS.accent5,
                  color: priority === 'low' ? 'white' : COLORS.darkBrown,
                  border: `1px solid ${priority === 'low' ? COLORS.info : COLORS.borderLight}`
                }}
              >
                Low
              </button>
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`text-sm py-2 px-3 rounded-md transition-colors`}
                style={{
                  backgroundColor: priority === 'medium' ? COLORS.warning : COLORS.accent5,
                  color: priority === 'medium' ? 'white' : COLORS.darkBrown,
                  border: `1px solid ${priority === 'medium' ? COLORS.warning : COLORS.borderLight}`
                }}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`text-sm py-2 px-3 rounded-md transition-colors`}
                style={{
                  backgroundColor: priority === 'high' ? COLORS.error : COLORS.accent5,
                  color: priority === 'high' ? 'white' : COLORS.darkBrown,
                  border: `1px solid ${priority === 'high' ? COLORS.error : COLORS.borderLight}`
                }}
              >
                High
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label 
              htmlFor="dueDate" 
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.darkBrown }}
            >
              Due Date (Optional)
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full border rounded-lg p-3 bg-white focus:outline-none transition-colors duration-200"
              style={{ 
                borderColor: COLORS.borderMedium,
                color: COLORS.darkBrown
              }}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 rounded-lg transition-colors duration-200 focus:outline-none"
              style={{ 
                backgroundColor: COLORS.borderLight,
                color: COLORS.darkBrown
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg transition-colors duration-200 focus:outline-none text-white"
              style={{ backgroundColor: COLORS.accent2 }}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm