import React, { useState } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const FormCard = styled.div`
    background: #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px #0004;
    margin-bottom: 20px;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
    margin-bottom: 10px;
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
    &:hover {
        background: #27ae60;
    }
`;

export const FormConvite = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Função para validar formato de e-mail
    const isValidEmail = (email) => {
        // Regex simples para validação de e-mail
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !isValidEmail(email)) {
            toast.error('Digite um e-mail válido!');
            return;
        }
        setLoading(true);
        try {
            await api.post('/admin/convidar', { email });
            toast.success('Convite enviado com sucesso!');
            setEmail('');
        } catch (err) {
            // console.error(err); // Log completo para debug
            let mensagemErro = 'Tente novamente';
            if (err.response && err.response.data && err.response.data.error) {
                mensagemErro = err.response.data.error;
            } else if (err.message && !err.response) {
                mensagemErro = 'Erro de conexão com o servidor';
            }
            toast.error('Erro ao enviar convite: ' + mensagemErro);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormCard>
            <h3>Enviar convite</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email-convite" style={{ display: 'none' }}>E-mail do convidado</label>
                <Input
                    id="email-convite"
                    type="email"
                    placeholder="E-mail do convidado"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    aria-label="E-mail do convidado"
                    disabled={loading}
                />
                <SubmitButton type="submit" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar convite'}
                </SubmitButton>
            </form>
        </FormCard>
    );
};