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
  const [form, setForm] = useState({ nome: '', dias_jogo: [], is_dp: false });

  const handleCheckbox = (dia) => {
    setForm((prev) => {
      let dias = prev.dias_jogo.includes(dia)
        ? prev.dias_jogo.filter(d => d !== dia)
        : [...prev.dias_jogo, dia];
      return { ...prev, dias_jogo: dias };
    });
  };

  const handleDP = () => {
    setForm((prev) => ({ ...prev, is_dp: !prev.is_dp }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let dias_jogo = form.dias_jogo.sort().join(' e ');
    try {
      await api.post('/admin/mensalistas', { nome: form.nome, dias_jogo, is_dp: form.is_dp });
      setForm({ nome: '', dias_jogo: [], is_dp: false });
      onSuccess();
      toast.success('Mensalista cadastrado!');
    } catch (err) {
      toast.error('Erro: ' + (err.response?.data?.error || 'Falha no cadastro'));
    }
  };

  return (
    <FormCard>
      <FormTitle>Nome do mensalista</FormTitle>
      <FormStyle onSubmit={handleSubmit} style={{gridTemplateColumns: '1fr', maxWidth: 400, margin: '0 auto'}}>
        <Input
          type="text"
          placeholder="Nome completo"
          value={form.nome}
          onChange={(e) => setForm({...form, nome: e.target.value})}
          required
        />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <label style={{ fontSize: '1rem' }}>
            <input
              type="checkbox"
              checked={form.dias_jogo.includes('segunda')}
              onChange={() => handleCheckbox('segunda')}
            /> Segunda
          </label>
          <label style={{ fontSize: '1rem' }}>
            <input
              type="checkbox"
              checked={form.dias_jogo.includes('quarta')}
              onChange={() => handleCheckbox('quarta')}
            /> Quarta
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
          <label style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="checkbox"
              checked={form.is_dp}
              onChange={handleDP}
            />
            Departamento Médico (Isento)
          </label>
        </div>
        <SubmitButton type="submit">Salvar</SubmitButton>
      </FormStyle>
    </FormCard>
  );
};