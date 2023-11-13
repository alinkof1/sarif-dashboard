// components/ChartComponent.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';

interface ChartProps {
  data: any; // Pass the chart data
}

const ChartComponent: React.FC<ChartProps> = ({ data }) => {
  if (!data || !data.runs || data.runs.length === 0 || !data.runs[0].results) {
    // If data is undefined or missing necessary properties, render a placeholder or handle it accordingly
    return <div>No data available for chart</div>;
  }

  // Extract results from the first run
  const results = data.runs[0].results;

  // Create chart data from results
  const chartData = {
    labels: results.map((result: any) => result.ruleId),
    datasets: [
      {
        label: 'Result Count',
        data: results.map(() => 1), // Assuming each result has equal weight for simplicity
        backgroundColor: results.map((_, index: number) => `rgba(54, 162, 235, 0.6)`), // Use a blue color for bars
        borderColor: results.map(() => `rgba(54, 162, 235, 1)`), // Border color
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: [
        {
          type: 'category',
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      y: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  

  return <Bar data={chartData} options={chartOptions} />;
};

export default ChartComponent;
