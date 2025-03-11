import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/TaskCard';
import { TaskDetailsModal } from '@/components/TaskDetailsModal';
import { COLORS } from '@/constants/colors';
import { Task } from '@/components/sidebar/types';

interface TasksListProps {
  filteredTasks: Task[];
  tasks: Task[];
  completedTasks: number;
  totalTasks: number;
  showCompleted: boolean;
  handleToggleComplete: (taskId: string) => void;
  handleDeleteTask: (taskId: string) => void;
  getRandomColor: () => "pink" | "mint" | "blue" | "purple" | "orange";
  handleEditTask?: (task: Task) => void;  // Optional edit handler
}

const TasksList: React.FC<TasksListProps> = ({ 
  filteredTasks, 
  tasks, 
  completedTasks, 
  totalTasks, 
  showCompleted, 
  handleToggleComplete, 
  handleDeleteTask,
  getRandomColor,
  handleEditTask
}) => {
  // Add state for the selected task and modal visibility
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  
  // Add this useEffect to update selectedTask when tasks change
  useEffect(() => {
    // If we have a selected task and the tasks array has changed
    if (selectedTask) {
      // Find the updated version of the task in the new tasks array
      const updatedTask = tasks.find(task => task.id === selectedTask.id);
      
      // If the task still exists, update selectedTask with the new data
      if (updatedTask) {
        setSelectedTask(updatedTask);
      } else {
        // If the task was deleted, close the modal
        setShowTaskDetails(false);
      }
    }
  }, [tasks]); // This effect runs whenever the tasks array changes
  
  // Handler for when a task is clicked
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">    
      <div className="flex-1 overflow-y-auto scrollbar-hide pr-1">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-4 text-sm" style={{ color: COLORS.sidebarText }}>
            No tasks found
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                completed={task.completed}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
                priority={task.priority}
                dueDate={task.dueDate}
                duration={task.duration}
                getRandomColor={getRandomColor}
                onTaskClick={handleTaskClick}  // Add the click handler
                aiScheduled={task.aiScheduled}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Add the TaskDetailsModal */}
      <TaskDetailsModal
        task={selectedTask}
        showModal={showTaskDetails}
        onClose={() => setShowTaskDetails(false)}
        onDelete={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditTask}  // Pass the edit handler if available
      />
    </div>
  );
};

export default TasksList; 