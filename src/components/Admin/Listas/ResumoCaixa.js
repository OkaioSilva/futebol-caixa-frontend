import React from "react";
import styled from "styled-components";

// Componentes estilizados
const ResumoCard = styled.div`
  background: #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;

  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const ResumoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 15px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const ResumoItem = styled.div`
  padding: 15px;
  border-radius: 6px;
  text-align: center;

  span {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  strong {
    font-size: 1.2rem;
  }

  &.entrada {
    background-color: #e8f5e9;
    color: #2e7d32;
  }

  &.saida {
    background-color: #ffebee;
    color: #c62828;
  }

  &.saldo {
    background-color: #e3f2fd;
    color: #1565c0;
  }

  @media (max-width: 600px) {
    padding: 8px;

    strong {
      font-size: 1rem;
    }
  }
`;

export const ResumoCaixa = ({ entradas_segunda, entradas_quarta, saidas }) => {
  // Converter para número e tratar valores inválidos
  const numSegunda = Number(entradas_segunda) || 0;
  const numQuarta = Number(entradas_quarta) || 0;
  const numSaidas = Number(saidas) || 0;
  const totalEntradas = numSegunda + numQuarta;
  const saldo = totalEntradas - numSaidas;

  return (
    <ResumoCard>
      <h3 style={{textAlign: 'center'}}>Resumo Financeiro</h3>
      <ResumoGrid style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
        <ResumoItem className="entrada">
          <span>Entradas Segunda</span>
          <strong>R$ {numSegunda.toFixed(2)}</strong>
        </ResumoItem>
        <ResumoItem className="entrada">
          <span>Entradas Quarta</span>
          <strong>R$ {numQuarta.toFixed(2)}</strong>
        </ResumoItem>
        <ResumoItem className="saida">
          <span>Saídas</span>
          <strong>R$ {numSaidas.toFixed(2)}</strong>
        </ResumoItem>
        <ResumoItem className="saldo">
          <span>Saldo</span>
          <strong>R$ {saldo.toFixed(2)}</strong>
        </ResumoItem>
      </ResumoGrid>
      <div style={{marginTop: 10, textAlign: 'center', fontSize: '0.95em', color: '#555'}}>
        <b>Total de entradas:</b> R$ {totalEntradas.toFixed(2)}
      </div>
    </ResumoCard>
  );
};
