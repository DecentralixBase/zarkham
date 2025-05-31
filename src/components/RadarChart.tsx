import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  tokenAllocations: Array<{
    token: string;
    percentage: number;
  }>;
}

export default function RadarChart({ tokenAllocations }: RadarChartProps) {
  const data = {
    labels: tokenAllocations.map(item => item.token),
    datasets: [
      {
        label: 'Token Allocation',
        data: tokenAllocations.map(item => item.percentage),
        backgroundColor: 'rgba(0, 246, 255, 0.2)',
        borderColor: '#00f6ff',
        borderWidth: 2,
        pointBackgroundColor: '#00f6ff',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#00f6ff',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          backdropColor: 'transparent',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="glass-effect p-6">
      <h3 className="text-lg font-semibold text-white/90 mb-6">Token Allocation</h3>
      <div className="h-[300px] w-full">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
} 