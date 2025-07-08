import React, { useState } from 'react';
import api from '../../../services/api';


import styled from 'styled-components';
import { toast } from 'react-toastify';


const FormCard = styled.div`
  background: #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px #0004;
  margin-bottom: 20px;
  box-sizing: border-box;
`;

const FormTitle = styled.h3`
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.3rem;
`;

const FormStyle = styled.form`
  display: grid;
  gap: 15px;
  grid-template-rows:  1fr auto;
  align-items: flex-start;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
  box-sizing: border-box;

  &:hover {
    background: #27ae60;
  }
`;

export const FormVisitante = ({ onSuccess }) => {
  const [form, setForm] = useState({ nome: '', valor_pago: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/visitantes', {
        ...form,
        valor_pago: parseFloat(form.valor_pago)
      });
      setForm({ nome: '', valor_pago: '' });
      onSuccess();
      toast.success('Visitante registrado!');
    } catch (err) {
      toast.error('Erro: ' + (err.response?.data?.error || 'Falha no registro'));
    }
  };

  return (

    <FormCard>
      <FormTitle>Registrar Visitantes</FormTitle>
      <FormStyle onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({...form, nome: e.target.value})}
          required
        />
        <Input
          type="number"
          placeholder="Valor pago (R$)"
          step= "0.01"
          value={form.valor_pago}
          onChange={(e) => setForm({...form, valor_pago: e.target.value})}
          required
        />
        
        <SubmitButton type="submit">Registrar</SubmitButton>

      </FormStyle>
    </FormCard>
  );
};