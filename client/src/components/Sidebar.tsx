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
    <div className="h-full w-64 bg-[#2C2C2C] p-4 border-r border-[#403F3E]">
      {/* App Name */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#FAF9F6]">atrova</h1>
      </div>
      
      {/* New Event Button */}
      <div className="mb-4">
        <button 
          onClick={onNewEvent}
          className="w-full bg-[#FAF9F6] text-[#2C2C2C] py-2 px-4 rounded-lg hover:bg-[#E2DFD8] transition-colors duration-200 focus:outline-none"
        >
          New Event
        </button>
      </div>

      {/* New Task Button */}
      <div className="mb-4">
        <button 
          onClick={() => setShowTaskForm(true)} 
          className="w-full bg-[#FAF9F6] text-[#2C2C2C] py-2 px-4 rounded-lg hover:bg-[#E2DFD8] transition-colors duration-200 focus:outline-none"
        >
          New Task
        </button>
      </div>
      
      {/* Tasks List */}
      <div>
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