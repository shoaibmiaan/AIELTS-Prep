import React from 'react';
import { useRouter } from 'next/router';

const LearnLab: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">LearnLab</h1>
      <div className="grid grid-cols-2 gap-4">
        {['reading', 'writing', 'listening', 'speaking'].map((module) => (
          <button
            key={module}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => router.push(`/learnLab/${module}/library`)}
          >
            {module.charAt(0).toUpperCase() + module.slice(1)} Practice
          </button>
        ))}
      </div>
    </div>
  );
};

export default LearnLab;