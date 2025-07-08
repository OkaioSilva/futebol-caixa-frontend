import React, {useState, useEffect } from "react";
import {Bar, Pie} from 'react-chartjs-2';
import axios from "axios";

const Dashboard = () => {
  const [caixaData, setCaixaData] = useState({ entradas: [], saidas: [] });
  const [mensalistas, setMensalistas] = useState([]);

  useEffect(() => {
    // Buscar dados da API
    axios.get('http://localhost:5000/caixa').then(res => {
      setCaixaData(res.data);
    });

    axios.get('http://localhost:5000/mensalistas').then(res => {
      setMensalistas(res.data);
    });
  }, []);

  // Dados para gráficos
  const entradasSaidasChart = {
    labels: ['Jan', 'Fev', 'Mar'],
    datasets: [
      {
        label: 'Entradas (R$)',
        data: caixaData.entradas,
        backgroundColor: '#4CAF50',
      },
      {
        label: 'Saídas (R$)',
        data: caixaData.saidas,
        backgroundColor: '#F44336',
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Controle Financeiro</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ width: '60%' }}>
          <Bar data={entradasSaidasChart} />
        </div>
        <div style={{ width: '40%' }}>
          <Pie data={'kaio'} />
        </div>
      </div>
      <h2>Mensalistas</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Status Pagamento</th>
          </tr>
        </thead>
        <tbody>
          {mensalistas.map((item) => (
            <tr key={item.id}>
              <td>{item.nome}</td>
              <td>{item.status_pagamento ? '✅ Em dia' : '❌ Atrasado'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;