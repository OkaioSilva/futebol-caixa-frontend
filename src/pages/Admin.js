import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styled from 'styled-components';
//forms 
import { FormConvite } from '../components/Admin/Invite/FormInvite';
import { FormMensalista } from '../components/Admin/Forms/FormMensalista';
import { FormMovimentacao } from '../components/Admin/Forms/FormMovimentacao';
import { FormVisitante } from '../components/Admin/Forms/FormVisitante';
// Listas
import { ListaMensalistas } from '../components/Admin/Listas/ListaMensalistas';
import { ListaVisitantes } from '../components/Admin/Listas/ListaVisitantes';
import { ResumoCaixa } from '../components/Admin/Listas/ResumoCaixa';
import { MovimentacoesCaixa } from '../components/Admin/Listas/MovimentacoesCaixa';
// modal
import ModalRelatorioMensal from '../components/Admin/caixa/ModalRelatorioMensal';
import OcorrenciasMensalista from '../components/Admin/OcorrenciasMensalista';


const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
  @media (max-width: 900px) {
    padding: 10px;
  }
  @media (max-width: 600px) {
    padding: 4px;
  }
`;
const AdminHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 18px 18px 12px 18px;
  background:rgb(218, 212, 212);
  border-radius: 10px;
  box-shadow: 0 2px 8px #0001;
  gap: 18px;
  @media (max-width: 700px) {
    // flex-direction: column;
    align-items: stretch;
    gap: 8px;
    // padding: 10px 6px 8px 6px;
    margin-bottom: 1rem;
    // box-sizing: border-box;
    width: 100vw;
  }
`;

const AdminHeaderTitle = styled.h1`
  color: #2c3e50;
  font-size: 2rem;
  margin: 0;
  flex: 1;
  text-align: center;
  @media (max-width: 700px) {
    font-size: 1.3rem;
    margin-bottom: 0;
  }
`;
const AdminHeaderButton = styled.div`
  font-size: 1.1rem;
  color: #2980b9;
  cursor: pointer;
  font-weight: 600;
  padding: 10px 16px;
  box-sizing: border-box;
  border-radius: 6px;
  background:rgba(225, 244, 252, 0.57);
  transition: background 0.2s;
  &:hover {
    background:rgba(13, 170, 248, 0.13);
  }
  @media (max-width: 700px) {
    // width: 100%;
    text-align: left;
    margin-bottom: 1px;
  }
`;
const AdminHeaderUser = styled.div`
  color:rgb(51, 80, 109);
  font-size: 1.1rem;
  text-align: right;
  font-weight: 500;
  @media (max-width: 700px) {
    text-align: right;
    margin-top: 2px;
  }
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;

  @media (max-width: 900px) {
    gap: 16px;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const FormsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 25px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 700px) {
    padding: 10px;
    gap: 12px;
  }
`;

const ListsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 25px;

  @media (max-width: 700px) {
    gap: 12px;
  }
`;

// Estilos para componentes filhos podem ser exportados se necessário em outros arquivos
export const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const FormContainer = styled(Card)`
  h2 {
    margin-top: 0;
    color: #2c3e50;
    font-size: 1.4rem;
    margin-bottom: 20px;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
  }

  input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
`;

export const FormActions = styled.div`
  margin-top: 20px;
  text-align: right;
`;

export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  background-color: ${props => props.primary ? '#3498db' : '#f5f5f5'};
  color: ${props => props.primary ? 'white' : '#333'};

  &:hover {
    background-color: ${props => props.primary ? '#2980b9' : '#e0e0e0'};
  }
`;


export const Admin = () => {
  const [mensalistas, setMensalistas] = useState([]);
  const [caixa, setCaixa] = useState({ entradas: 0, saidas: 0 });
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [visitantes, setVisitantes] = useState([]);
  const [adminNome, setAdminNome] = useState('');
  const navigate = useNavigate();

  const carregarDados = useCallback(async () => {
    try {
      const [resMensalistas, resCaixa, resVisitantes] = await Promise.all([
        api.get('/admin/mensalistas', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }),
        api.get('/admin/caixa'),
        api.get('/admin/visitantes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);
      setMensalistas(resMensalistas.data);
      setCaixa(resCaixa.data);
      setMovimentacoes(resCaixa.data.movimentacoes);
      setVisitantes(resVisitantes.data);
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const nome = localStorage.getItem('adminNome');
    setAdminNome(nome || '');
    if (!localStorage.getItem('token')) navigate('/');
    carregarDados();
  }, [carregarDados, navigate]);
  

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminHeaderButton onClick={() => navigate('/')}>Início</AdminHeaderButton>
        <AdminHeaderTitle>Painel Administrativo</AdminHeaderTitle>
        <AdminHeaderUser>
          {adminNome && (
            <span>Bem-vindo, {adminNome}</span>
          )}
        </AdminHeaderUser>
      </AdminHeader>
      <AdminGrid>
        {/* Formulários */}
        <FormsSection>
          <FormMensalista onSuccess={carregarDados} />
          <FormMovimentacao onSuccess={carregarDados} />
          <FormVisitante onSuccess={carregarDados} />
          <FormConvite>Enviar convite Adm</FormConvite>
          <ModalRelatorioMensal onSuccess={carregarDados} />
          <OcorrenciasMensalista onSuccess={carregarDados} />   
        </FormsSection>

        {/* Listas */}
        <ListsSection>
          <ResumoCaixa entradas={caixa.entradas} saidas={caixa.saidas} />
          <MovimentacoesCaixa movimentacoes={movimentacoes} />
          <ListaVisitantes visitantes={visitantes} />
          <ListaMensalistas
            mensalistas={mensalistas}
            onUpdateStatus={carregarDados}
          />
        </ListsSection>
      </AdminGrid>
    </AdminContainer>
  );

};