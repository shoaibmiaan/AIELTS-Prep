import React from 'react';

const SpeakingLearnLab: React.FC = () => {
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Speaking LearnLab Library</h1>
      <ul className="space-y-2">
        <li className="p-2 bg-white rounded shadow">Speaking Resource 1</li>
        <li className="p-2 bg-white rounded shadow">Speaking Resource 2</li>
      </ul>
    </div>
  );
};

export default SpeakingLearnLab;