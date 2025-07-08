import React, { useState } from 'react';
import api from '../../../services/api';

import styled from 'styled-components';
import { toast } from 'react-toastify';


const FormCard = styled.div`
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 2px 12px #0004;
  margin-bottom: 20px;
  background: #ddd;
`;

const FormTitle = styled.h3`
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.3rem;
  text-align: center;
`;

const FormStyle = styled.form`
  display: grid;
  gap: 15px;
  grid-template-columns:  1fr auto;
  align-items: flex-start;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  height: fit-content;

  &:hover {
    background: #27ae60;
  }
`;
export const FormMensalista = ({ onSuccess }) => {
  const [form, setForm] = useState({ nome: ''});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/mensalistas', form);
      setForm({ nome: '', });
      onSuccess();
      toast.success('Mensalista cadastrado!');
    } catch (err) {
      toast.error('Erro: ' + (err.response?.data?.error || 'Falha no cadastro'));
    }
  };

  return (

    <FormCard>
      <FormTitle>Nome do mensalista</FormTitle>
      <FormStyle onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nome completo"
          value={form.nome}
          onChange={(e) => setForm({...form, nome: e.target.value})}
          required
        />
        
        <SubmitButton type="submit">Salvar</SubmitButton>

      </FormStyle>
    </FormCard>
  );
};