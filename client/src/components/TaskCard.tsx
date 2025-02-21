import React from 'react';

interface TaskCardProps {
  title: string;
  id: string;
  onDelete?: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, id, onDelete }) => {
  return (
    <div className="px-3 py-2 bg-[#403F3E] text-[#FAF9F6] rounded-lg shadow-sm border border-[#4A4948] group relative">
      <div className="flex justify-between items-center">
        <span className="truncate">{title}</span>
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#FAF9F6] hover:text-red-300 ml-2"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
