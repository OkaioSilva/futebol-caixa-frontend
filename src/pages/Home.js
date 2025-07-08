import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../services/api";
import { ResumoCaixa } from "../components/Admin/Listas/ResumoCaixa";


import { Link } from "react-router-dom";

const Navbar = styled.nav`
  background: #2c3e50;
  padding: 1rem 2vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px #0002;
  @media (max-width: 700px) {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 0.7rem 2vw;
  }
`;

const NavTitle = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  letter-spacing: 1px;
  @media (max-width: 700px) {
    font-size: 1rem;
    margin-bottom: 2px;
    }
    `;
    
    const NavLinks = styled.div`
    display: flex;
    gap: 10px;
    @media (max-width: 700px) {
    width: 100%;
    justify-content: flex-end;
    gap: 4px;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1.1rem;
  border-radius: 4px;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.3s, color 0.2s;
  &:hover {
    background: #34495e;
    color: #f1c40f;
  }
  @media (max-width: 700px) {
    font-size: 0.97rem;
    padding: 0.45rem 0.7rem;
  }
`;

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  align-text: center;
`;

const SectionTitle = styled.h2`
  text-align: center;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-top: 30px;
`;

const ResumoContainer = styled.div`
  background: #ddd;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const MensalistasContainer = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
`;

const MensalistaItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  box-shadow:0 2px 12px #0004;
  box-sizing: border-box;
  border-radius: 8px;

  &:last-child {
    border-bottom: none;
  }
`;

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  background-color: ${(props) =>
    props.$status === "pago"
      ? "#e8f5e9"
      : props.$status === "pendente"
      ? "#fff3e0"
      : "#ffebee"};
  color: ${(props) =>
    props.$status === "pago"
      ? "#2e7d32"
      : props.$status === "pendente"
      ? "#e65100"
      : "#c62828"};
`;

export const Home = () => {
  const [resumoFinanceiro, setResumoFinanceiro] = useState({
    entradas: 0,
    saidas: 0,
  });
  const [mensalistas, setMensalistas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carrega dados do caixa
        const resCaixa = await api.get("/caixa/public");
        setResumoFinanceiro(resCaixa.data);

        // Carrega mensalistas
        const resMensalistas = await api.get("/mensalistas/public");
        setMensalistas(resMensalistas.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  if (loading) {
    return <div>Carregando dados...</div>;
  }

  return (
    <HomeContainer>
      <Navbar>
        <NavTitle>Sistema de Gestão</NavTitle>
        <NavLinks>
          <NavLink to="/login">Login Admin</NavLink>
          <NavLink to="/admin">Área Admin</NavLink>
        </NavLinks>
      </Navbar>
      
      {/* Seção do Resumo Financeiro */}
      <ResumoContainer>
        <SectionTitle>Transparência Financeira</SectionTitle>
        <ResumoCaixa
          entradas={resumoFinanceiro.entradas}
          saidas={resumoFinanceiro.saidas}
        />
      </ResumoContainer>

      
      <MensalistasContainer>
        <SectionTitle>Mensalistas Ativos</SectionTitle>
        {mensalistas.map((mensalista) => (
          <MensalistaItem key={mensalista.id}>
            <div>
              
              <strong>{mensalista.nome}</strong>
              
            </div>
            <div style={{ textAlign: "center" }}>
              {mensalista.dataPagamento &&
                new Date(mensalista.dataPagamento).toLocaleDateString()}
            </div>
            <StatusBadge $status={mensalista.status.toLowerCase()}>
              {mensalista.status.toUpperCase()}
            </StatusBadge>
          </MensalistaItem>
        ))}
      </MensalistasContainer>
    </HomeContainer>
  );
};
