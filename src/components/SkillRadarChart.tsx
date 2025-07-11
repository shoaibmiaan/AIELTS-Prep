import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface SkillData {
  skill: string;
  level: number;
}

interface SkillRadarChartProps {
  data: SkillData[];
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.skill),
    datasets: [
      {
        label: 'Skill Level',
        data: data.map(item => item.level),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent',
          color: 'rgba(200, 200, 200, 0.5)',
          font: {
            size: 10,
          }
        },
        pointLabels: {
          color: 'rgba(200, 200, 200, 0.8)',
          font: {
            size: 11,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.raw}%`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#ddd',
        bodyColor: '#ddd',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-full">
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default SkillRadarChart;