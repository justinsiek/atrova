import React, { useState } from 'react';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';

interface Task {
  id: string;
  title: string;
}

interface SidebarProps {
  onNewEvent: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewEvent }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleAddTask = (task: { title: string }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: task.title,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="h-full w-64 bg-[#2C2C2C] p-6 border-r border-[#403F3E] shadow-md flex flex-col">
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-[#403F3E]">
        <h1 className="text-3xl font-extrabold text-[#FAF9F6]">atrova</h1>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button 
          onClick={onNewEvent}
          className="w-full bg-[#FAF9F6] text-[#2C2C2C] py-2 px-4 rounded-md transition-transform transform focus:outline-none hover:bg-[#E2DFD8] duration-200 shadow-sm"
        >
          New Event
        </button>

        <button 
          onClick={() => setShowTaskForm(true)}
          className="w-full bg-[#FAF9F6] text-[#2C2C2C] py-2 px-4 rounded-md transition-transform transform focus:outline-none hover:bg-[#E2DFD8] duration-200 shadow-sm"
        >
          New Task
        </button>
      </div>

      <hr className="border-t border-[#403F3E] my-4" />

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xl font-semibold text-[#FAF9F6] mb-2">Tasks</h2>
        <ul className="space-y-2">
          {tasks.length === 0 ? (
            <li className="text-[#9A9A9A]">No tasks available</li>
          ) : (
            tasks.map(task => (
              <li key={task.id}>
                <TaskCard
                  id={task.id}
                  title={task.title}
                  onDelete={handleDeleteTask}
                />
              </li>
            ))
          )}
        </ul>
      </div>

      <TaskForm 
        showForm={showTaskForm}
        setShowForm={setShowTaskForm}
        onAddTask={handleAddTask}
      />
    </div>
  );
};

export default Sidebar;