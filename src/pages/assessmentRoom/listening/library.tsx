import React from 'react';

const ListeningLibrary: React.FC = () => {
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Listening Practice Library</h1>
      <ul className="space-y-2">
        <li className="p-2 bg-white rounded shadow">Listening Test 1</li>
        <li className="p-2 bg-white rounded shadow">Listening Test 2</li>
      </ul>
    </div>
  );
};

export default ListeningLibrary;

