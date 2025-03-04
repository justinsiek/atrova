import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import { COLORS } from '@/constants/colors';
import { Task } from './sidebar/types';
import SidebarHeader from './sidebar/SidebarHeader';
import ActionButtons from './sidebar/ActionButtons';
import TaskFilters from './sidebar/TaskFilters';
import TaskProgressBar from './sidebar/TaskProgressBar';
import TasksList from './sidebar/TasksList';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/services/api';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from the backend on component mount
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (error) {
        setError('Failed to load tasks. Please try again later.');
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleAddTask = async (task: { 
    title: string, 
    priority?: 'low' | 'medium' | 'high',
    dueDate?: string,
    duration?: number  // Add duration here
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const newTask: Omit<Task, 'id'> = {
        title: task.title,
        completed: false,
        priority: task.priority,
        dueDate: task.dueDate,
        duration: task.duration  // Add duration here
      };
      
      const response = await createTask(newTask);
      setTasks(prevTasks => [response.task, ...prevTasks]);
    } catch (error) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (taskToUpdate) {
        const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
        await updateTask(taskId, updatedTask);
        setTasks(prevTasks => prevTasks.map(task => 
          task.id === taskId ? updatedTask : task
        ));
      }
    } catch (error) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    // First filter by completion status and priority
    if (!showCompleted && task.completed) return false;
    
    // Then filter by priority if needed
    if (filter !== 'all' && task.priority !== filter) return false;
    
    return true;
  }).sort((a, b) => {
    // First sort by deadline (if available)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (a.dueDate) {
      return -1; // a has dueDate, b doesn't, so a comes first
    } else if (b.dueDate) {
      return 1; // b has dueDate, a doesn't, so b comes first
    }
    
    // Then sort by priority (high > medium > low)
    const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3 };
    const aPriority = a.priority || 'undefined';
    const bPriority = b.priority || 'undefined';
    
    return priorityOrder[aPriority] - priorityOrder[bPriority];
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
      <hr className="border-t mb-4" style={{ borderColor: COLORS.sidebarBorder }} />

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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

      {/* Tasks List with loading state */}
      {isLoading && tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading tasks...</div>
        </div>
      ) : (
        <TasksList 
          filteredTasks={filteredTasks}
          tasks={tasks}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          showCompleted={showCompleted}
          handleToggleComplete={handleToggleComplete}
          handleDeleteTask={handleDeleteTask}
        />
      )}

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