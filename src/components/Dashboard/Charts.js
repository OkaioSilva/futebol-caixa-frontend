import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const CaixaChart = ({ entradas, saidas }) => {
  const data = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Entradas (R$)',
        data: entradas,
        backgroundColor: '#4CAF50',
      },
      {
        label: 'Saídas (R$)',
        data: saidas,
        backgroundColor: '#F44336',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  return <Bar data={data} options={options} />;
};