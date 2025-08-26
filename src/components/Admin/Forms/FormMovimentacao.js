import React, { useState } from 'react';
import api from '../../../services/api';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const FormCard = styled.div`
  background: #ddd ;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px #0004;
  margin-bottom: 20px;
  border: none
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
  grid-template-columns: 2fr ;
  align-items: flex-start;
  padding: 10px
  box-sizing: border-box;
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

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  box-sizing: border-box;
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
export const FormMovimentacao = ({ onSuccess }) => {
  const [form, setForm] = useState({ 
    tipo: 'entrada', 
    valor: '', 
    descricao: '',
    dia_jogo: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/caixa', {
        ...form,
        valor: parseFloat(form.valor),
        dia_jogo: form.dia_jogo || null
      });
      setForm({ tipo: 'entrada', valor: '', descricao: '', dia_jogo: '' });
      onSuccess();
      toast.success('Movimentação registrada!');
    } catch (err) {
      toast.error('Erro: ' + (err.response?.data?.error || 'Falha no registro'));
    }
  };

  return (
    <FormCard>
      <FormTitle>Registrar Movimentação</FormTitle>
      <FormStyle onSubmit={handleSubmit}>
        <div>
          <Select
            value={form.tipo}
            onChange={(e) => setForm({...form, tipo: e.target.value})}
            required
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </Select>
        </div>
        <Input
          type="number"
          placeholder="Valor (R$)"
          step="0.01"
          value={form.valor}
          onChange={(e) => setForm({...form, valor: e.target.value})}
          required
        />
        <Select
          value={form.dia_jogo}
          onChange={e => setForm({...form, dia_jogo: e.target.value})}
          style={{marginBottom: 8}}
        >
          <option value="">Dia do jogo (opcional)</option>
          <option value="segunda">Segunda</option>
          <option value="quarta">Quarta</option>
        </Select>
        <Input
          type="text"
          placeholder="Descrição"
          value={form.descricao}
          onChange={(e) => setForm({...form, descricao: e.target.value})}
          required
        />
        <SubmitButton type="submit">Registrar</SubmitButton>
      </FormStyle>
    </FormCard>
  );
};