// components/ChartComponent.tsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

interface ChartProps {
  data: any; // Pass the chart data
}

const ChartComponent: React.FC<ChartProps> = ({ data }) => {
  if (!data || !data.labels || !data.datasets || !data.datasets[0].data) {
    // If data is undefined or missing necessary properties, render a placeholder or handle it accordingly
    console.log(data);
    return <div>No data available for chart</div>;
  }

  return <Doughnut data={data} />;
};

export default ChartComponent;
