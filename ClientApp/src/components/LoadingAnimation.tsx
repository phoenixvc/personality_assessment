import React from 'react';

interface LoadingAnimationProps {
  isLoading: boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-lg font-semibold text-blue-600">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;