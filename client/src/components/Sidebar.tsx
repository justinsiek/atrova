import React, { useState } from 'react';
import TaskForm from './TaskForm';
import { COLORS } from '@/constants/colors';
import { Task } from './sidebar/types';

// Import new component modules
import SidebarHeader from './sidebar/SidebarHeader';
import ActionButtons from './sidebar/ActionButtons';
import TaskFilters from './sidebar/TaskFilters';
import TaskProgressBar from './sidebar/TaskProgressBar';
import TasksList from './sidebar/TasksList';

interface SidebarProps {
  onNewEvent: () => void;
  scheduleWithAI: () => void;
  aiStatus: 'idle' | 'loading' | 'success' | 'error';
  unscheduledTasks: number;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewEvent, scheduleWithAI, aiStatus, unscheduledTasks }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const handleAddTask = (task: { 
    title: string, 
    priority?: 'low' | 'medium' | 'high',
    dueDate?: string 
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: task.title,
      completed: false,
      priority: task.priority,
      dueDate: task.dueDate
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    // First filter by completion status
    if (!showCompleted && task.completed) return false;
    
    // Then filter by priority if needed
    if (filter !== 'all' && task.priority !== filter) return false;
    
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div 
      className="h-full w-72 p-6 border-r shadow-md flex flex-col justify-center"
      style={{ backgroundColor: COLORS.slate, borderColor: COLORS.sidebarBorder }}
    >
      {/* Header */}
      <SidebarHeader />

      {/* Action Buttons */}
      <ActionButtons 
        onNewEvent={onNewEvent} 
        onAddTask={() => setShowTaskForm(true)} 
        scheduleWithAI={scheduleWithAI} 
        aiStatus={aiStatus} 
      />

      <hr className="border-t my-4" style={{ borderColor: COLORS.sidebarBorder }} />

      {/* Task Filters */}
      <TaskFilters 
        showCompleted={showCompleted} 
        setShowCompleted={setShowCompleted} 
        filter={filter} 
        setFilter={setFilter} 
      />

      {/* Progress Bar */}
      <TaskProgressBar 
        completedTasks={completedTasks} 
        totalTasks={totalTasks} 
        completionPercentage={completionPercentage} 
      />

      {/* Tasks List */}
      <TasksList 
        filteredTasks={filteredTasks}
        tasks={tasks}
        completedTasks={completedTasks}
        totalTasks={totalTasks}
        showCompleted={showCompleted}
        handleToggleComplete={handleToggleComplete}
        handleDeleteTask={handleDeleteTask}
      />

      {/* Task Form Modal */}
      <TaskForm 
        showForm={showTaskForm} 
        setShowForm={setShowTaskForm} 
        onAddTask={handleAddTask} 
      />
    </div>
  );
};

export default Sidebar;