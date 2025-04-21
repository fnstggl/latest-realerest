
import React from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  fullScreen = false,
  className = ''
}) => {
  return (
    <div className={`
      flex items-center justify-center
      ${fullScreen ? 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm' : 'min-h-[300px]'}
      ${className}
    `}>
      <div className="loading-container">
        <div className="pulsing-circle" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
