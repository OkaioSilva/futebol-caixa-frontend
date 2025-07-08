import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import styled from 'styled-components'

// Componentes estilizados
const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(-45deg,rgb(27, 25, 24), #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
	animation: gradient 15s ease infinite;
	height: 100vh;
    @keyframes gradient{
        0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
    }
    padding: 2rem;
`;

const FormCard = styled.div`;
    background: white;
    padding: 3rem;
    border-radius: 16px;
    box-shadow: 0 2px 12px #0004;
    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

const Title = styled.h2`
    color:#2c3e50;
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.4rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 8px;
    transition: all 0.3s;
    font-size: 1rem;
    &:focus {
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        outline: none;
    }
`;

const Button = styled.button`
    background: #6e8efb;
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 8px;
    box-sizing: border-box;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
        background:rgba(121, 244, 90, 0.64);
        transform: translateY(-2px);
    }
    &.active {
        transform: translateY(0);
    }
`;

const ErrorMessage = styled.p`
    color: #e74c3c;
    text-align: center;
    margin-top: -1rem;
    margin-bottom: -1rem;
    font-size: 0.9rem;
`;

const RegisterLink = styled.div`
    margin-top: 2rem;
    font-size: 0.9rem;
    color:#f9f9f9;
    display: flex;
    flex-direction: column;
    
    a {
        color: white;
        text-decoration: none;
        font-weight: 600;

    &:hover {
        text-decoration: underline;
    }
    }
    p{
        text-align: center;
        color: #2c3e50;
    }
`;

export const Register = () => {
    const [form, setForm] = useState({ nome: '', email: '', senha: '', tokenConvite: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/registro', form);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.error || 'Erro no cadastro');
        }
    };

    return (
        <Container>
        <FormCard>
            <Title>Criar Conta Admin</Title>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            <Form onSubmit={handleSubmit}>
            <Input
                type="text"
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
            />
            <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
            />
            <Input
                type="password"
                placeholder="Senha"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                required
            />
            <Input
                type="text"
                placeholder="Token de Convite"
                value={form.tokenConvite}
                onChange={(e) => setForm({ ...form, tokenConvite: e.target.value })}
                required
            />
            <Button type="submit">Cadastrar</Button>
        </Form>
        <RegisterLink>
            <p>
            Já tem acesso?
            </p>
            <Button>
                <Link to="/login">Entrar</Link>
            </Button>
        </RegisterLink>
    </FormCard>
    </Container>
    );

    
};