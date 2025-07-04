import { useEffect, useState } from 'react';

type FeatureMap = {
  target: string[];
  inProgress: string[];
  done: string[];
};

const columnTitles = {
  target: '🎯 Target',
  inProgress: '🚧 In Progress',
  done: '✅ Done'
};

const columnColors = {
  target: 'bg-slate-100 border-slate-300',
  inProgress: 'bg-yellow-100 border-yellow-400',
  done: 'bg-green-100 border-green-400'
};

export default function RoadmapPage() {
  const [features, setFeatures] = useState<FeatureMap>({
    target: [],
    inProgress: [],
    done: []
  });

  useEffect(() => {
    fetch('/FeatureTracker.json')
      .then(res => res.json())
      .then(data => setFeatures(data))
      .catch(err => console.error('Failed to load tracker:', err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📌 Project Roadmap</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['target', 'inProgress', 'done'] as const).map((column) => (
          <div key={column}>
            <h2 className="text-lg font-semibold mb-2">{columnTitles[column]}</h2>
            <div className={`rounded border p-2 ${columnColors[column]}`}>
              {features[column].length === 0 && <p className="text-sm text-gray-500">No items</p>}
              {features[column].map((item, index) => (
                <div
                  key={index}
                  className="bg-white border rounded p-2 mb-2 shadow-sm text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
