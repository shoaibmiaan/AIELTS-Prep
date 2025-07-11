import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartProps {
  data: number[]; // The data for the chart, such as band scores or progress values
  labels: string[]; // Labels for the chart, such as test dates or categories
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, labels }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Progress Over Time',
        data: data,
        borderColor: '#4CAF50', // Line color
        backgroundColor: 'rgba(76, 175, 80, 0.2)', // Fill color
        fill: true,
        tension: 0.4, // Smoothing the curve
        pointRadius: 5, // Point size
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Progress Chart',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        min: 0,
        max: 10, // Assuming the scale is from 0 to 10 (e.g., IELTS band score)
      },
    },
  };

  return (
    <div className="chart-container" style={{ width: '100%', height: '400px' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default ProgressChart;
