import React, { useState } from 'react';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '@/constants/colors';
import { Calendar, Sparkles, Plus, Loader, Check } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  aiScheduled?: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

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
      className="h-full w-72 p-6 border-r shadow-md flex flex-col"
      style={{ backgroundColor: COLORS.sidebarBg, borderColor: COLORS.sidebarBorder }}
    >
      {/* Header */}
      <div className="mb-6 pb-4 flex items-center" style={{ borderBottom: `1px solid ${COLORS.sidebarBorder}` }}>
        <h1 
          className="text-3xl font-extrabold" 
          style={{ color: COLORS.sidebarText }}
        >
          atrova
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-6">
        <button 
          onClick={onNewEvent}
          className="w-full py-2 px-4 rounded-md transition-transform hover:scale-[1.02] shadow-sm flex items-center justify-center"
          style={{ 
            backgroundColor: COLORS.paperWhite, 
            color: COLORS.darkBrown
          }}
        >
          <Calendar className="w-4 h-4 mr-2" />
          New Event
        </button>

        {/* Add Task Button */}
        <button
          onClick={() => setShowTaskForm(true)}
          className="w-full py-2 px-4 text-white rounded-md transition-transform hover:scale-[1.02] shadow-sm flex items-center justify-center"
          style={{ 
            backgroundColor: COLORS.paperWhite, 
            color: COLORS.darkBrown
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>

        {/* Schedule with AI Button */}
        <button 
          onClick={scheduleWithAI}
          disabled={aiStatus === 'loading'}
          className="w-full py-2 px-4 rounded-md transition-transform hover:scale-[1.02] shadow-sm flex items-center justify-center"
          style={{ 
            backgroundColor: aiStatus === 'loading' ? COLORS.accent3 : COLORS.accent1,
            color: 'white',
            opacity: aiStatus === 'loading' ? 0.7 : 1
          }}
        >
          {aiStatus === 'loading' ? (
            <>
              <Loader className="animate-spin w-4 h-4 mr-2" />
              Scheduling...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Schedule with AI
            </>
          )}
        </button>
        
      </div>

      <hr className="border-t my-4" style={{ borderColor: COLORS.sidebarBorder }} />

      {/* Task Filters */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 
            className="text-lg font-medium" 
            style={{ color: COLORS.sidebarText }}
          >
            Tasks
          </h2>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-xs px-2 py-1 rounded"
            style={{ 
              backgroundColor: showCompleted ? COLORS.accent3 : 'transparent',
              color: showCompleted ? 'white' : COLORS.sidebarText,
              border: `1px solid ${showCompleted ? COLORS.accent3 : COLORS.sidebarText}`
            }}
          >
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </button>
        </div>
        
        <div className="flex space-x-2 mb-2">
          <button 
            className="text-xs py-1 px-2 rounded transition-colors"
            style={{
              backgroundColor: filter === 'all' ? COLORS.accent4 : 'transparent',
              color: filter === 'all' ? COLORS.darkBrown : COLORS.sidebarText,
              border: `1px solid ${filter === 'all' ? COLORS.accent4 : COLORS.sidebarBorder}`
            }}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className="text-xs py-1 px-2 rounded transition-colors"
            style={{
              backgroundColor: filter === 'high' ? COLORS.error : 'transparent',
              color: filter === 'high' ? 'white' : COLORS.sidebarText,
              border: `1px solid ${filter === 'high' ? COLORS.error : COLORS.sidebarBorder}`
            }}
            onClick={() => setFilter('high')}
          >
            High
          </button>
          <button 
            className="text-xs py-1 px-2 rounded transition-colors"
            style={{
              backgroundColor: filter === 'medium' ? COLORS.warning : 'transparent',
              color: filter === 'medium' ? 'white' : COLORS.sidebarText,
              border: `1px solid ${filter === 'medium' ? COLORS.warning : COLORS.sidebarBorder}`
            }}
            onClick={() => setFilter('medium')}
          >
            Medium
          </button>
          <button 
            className="text-xs py-1 px-2 rounded transition-colors"
            style={{
              backgroundColor: filter === 'low' ? COLORS.info : 'transparent',
              color: filter === 'low' ? 'white' : COLORS.sidebarText,
              border: `1px solid ${filter === 'low' ? COLORS.info : COLORS.sidebarBorder}`
            }}
            onClick={() => setFilter('low')}
          >
            Low
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1" style={{ color: COLORS.sidebarText }}>
          <span>{completedTasks} of {totalTasks} completed</span>
          <span>{completionPercentage}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: COLORS.sidebarBorder }}>
          <div 
            className="h-full rounded-full" 
            style={{ 
              width: `${completionPercentage}%`,
              backgroundColor: COLORS.accent1
            }}
          ></div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
        <AnimatePresence initial={false}>
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full"
                style={{
                  backgroundColor: task.priority === 'high' ? COLORS.error : 
                                    task.priority === 'medium' ? COLORS.warning : 
                                    task.priority === 'low' ? COLORS.info : COLORS.lightBrown,
                  opacity: task.completed ? 0.3 : 1
                }}
              ></div>
              <div className="flex items-center ml-3">
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className="shrink-0 w-5 h-5 rounded border flex items-center justify-center mr-2"
                  style={{
                    backgroundColor: task.completed ? COLORS.success : 'transparent',
                    borderColor: task.completed ? COLORS.success : COLORS.sidebarText,
                    color: 'white'
                  }}
                >
                  {task.completed && (
                    <Check className="w-3 h-3" />
                  )}
                </button>
                <div className={task.completed ? 'opacity-50 flex-1' : 'flex-1'}>
                  <TaskCard 
                    title={task.title} 
                    id={task.id} 
                    onDelete={handleDeleteTask}
                    completed={task.completed}
                    aiScheduled={task.aiScheduled}
                    dueDate={task.dueDate}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="text-center py-10 opacity-50" style={{ color: COLORS.sidebarText }}>
            {tasks.length === 0 ? (
              <p>No tasks yet. Add one to get started.</p>
            ) : !showCompleted && completedTasks === totalTasks ? (
              <p>All tasks completed! 🎉</p>
            ) : (
              <p>No tasks match your filters.</p>
            )}
          </div>
        )}
      </div>

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