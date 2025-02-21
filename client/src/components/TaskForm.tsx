import { useState } from 'react'

interface TaskFormProps {
  showForm: boolean
  setShowForm: (show: boolean) => void
  onAddTask: (task: { title: string }) => void
}

const TaskForm = ({ showForm, setShowForm, onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) return

    onAddTask({ title: title.trim() })
    setTitle("")
    setShowForm(false)
  }

  if (!showForm) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#2C2C2C] bg-opacity-50 z-[50]">
      <div className="bg-[#FAF9F6] p-8 rounded-lg shadow-lg w-96 border border-[#E2DFD8]">
        <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6">Add Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Task Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-[#E2DFD8] rounded-lg p-3 bg-white focus:outline-none focus:border-[#2C2C2C] transition-colors duration-200"
              placeholder="Enter task title"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 bg-[#E2DFD8] text-[#2C2C2C] rounded-lg hover:bg-[#D8D4CC] transition-colors duration-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#2C2C2C] text-[#FAF9F6] rounded-lg hover:bg-[#403F3E] transition-colors duration-200 focus:outline-none"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm