import React from 'react';
import { COLORS } from '@/constants/colors';

interface LoadingAnimationProps {
  message?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ message }) => {
  return (
    <div className="flex h-screen items-center justify-center flex-col" style={{ backgroundColor: COLORS.background }}>
      <div className="flex space-x-1 mb-4">
        {/* Four colored squares in a row */}
        <div 
          className="h-6 w-6 rounded-md animate-pulse"
          style={{ 
            backgroundColor: COLORS.eventPink,
            border: '2px solid #e3b3ac',
            animationDelay: '0ms',
            animationDuration: '1500ms'
          }}
        />
        <div 
          className="h-6 w-6 rounded-md animate-pulse"
          style={{ 
            backgroundColor: COLORS.eventMint,
            border: '2px solid #bacbb7',
            animationDelay: '300ms',
            animationDuration: '1500ms'
          }}
        />
        <div 
          className="h-6 w-6 rounded-md animate-pulse"
          style={{ 
            backgroundColor: COLORS.eventBlue,
            border: '2px solid #b6cede',
            animationDelay: '600ms',
            animationDuration: '1500ms'
          }}
        />
        <div 
          className="h-6 w-6 rounded-md animate-pulse"
          style={{ 
            backgroundColor: COLORS.eventOrange,
            border: '2px solid #e7c3a7',
            animationDelay: '900ms',
            animationDuration: '1500ms'
          }}
        />
      </div>
      
      {message && <div className="text-sm" style={{ color: COLORS.mediumBrown }}>{message}</div>}
    </div>
  );
};

export default LoadingAnimation; 