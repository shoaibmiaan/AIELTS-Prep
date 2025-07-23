// components/home/PerformanceChart.tsx
import React from 'react';
import { motion } from 'framer-motion';

const PerformanceChart: React.FC = () => {
  // Mock data for the chart
  const performanceData = [
    { month: 'Jan', reading: 6.0, writing: 5.5, listening: 6.5, speaking: 5.0 },
    { month: 'Feb', reading: 6.5, writing: 6.0, listening: 6.5, speaking: 5.5 },
    { month: 'Mar', reading: 7.0, writing: 6.0, listening: 7.0, speaking: 6.0 },
    { month: 'Apr', reading: 7.0, writing: 6.5, listening: 7.5, speaking: 6.5 },
    { month: 'May', reading: 7.5, writing: 7.0, listening: 8.0, speaking: 7.0 },
  ];

  // Find the maximum value to scale the chart
  const maxValue = Math.max(...performanceData.map(d => Math.max(d.reading, d.writing, d.listening, d.speaking)));

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span>Band Score</span>
        <span>9.0</span>
      </div>

      <div className="space-y-6">
        {performanceData.map((data, index) => (
          <div key={index} className="flex items-center">
            <div className="w-16 text-sm font-medium text-gray-500 dark:text-gray-400">{data.month}</div>
            <div className="flex-1 flex space-x-2">
              {['reading', 'writing', 'listening', 'speaking'].map((skill) => (
                <div key={skill} className="flex-1 flex flex-col items-center">
                  <div className="w-full h-32 flex flex-col justify-end">
                    <motion.div
                      className="bg-primary rounded-t relative group"
                      initial={{ height: 0 }}
                      animate={{ height: `${(data[skill as keyof typeof data] as number) / maxValue * 100}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    >
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {data[skill as keyof typeof data]}
                      </span>
                    </motion.div>
                  </div>
                  <span className="text-xs mt-1 text-gray-500 dark:text-gray-400 capitalize">{skill.charAt(0)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex mt-4 justify-between text-xs text-gray-500 dark:text-gray-400">
        {performanceData.map((data, index) => (
          <div key={index} className="w-16 text-center">
            {data.month}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary rounded mr-2"></div>
          <span className="text-xs">Reading</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-secondary rounded mr-2"></div>
          <span className="text-xs">Writing</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-accent rounded mr-2"></div>
          <span className="text-xs">Listening</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
          <span className="text-xs">Speaking</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;