import React from 'react';

const Flashcard = ({ 
  front, 
  back, 
  isFlipped, 
  onFlip 
}: {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}) => {
  return (
    <div 
      className="w-full max-w-md mx-auto h-64 cursor-pointer perspective-1000"
      onClick={onFlip}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center justify-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white">{front}</h3>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl shadow-lg p-6 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
          <p className="text-xl text-center text-indigo-800 dark:text-indigo-200">{back}</p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;