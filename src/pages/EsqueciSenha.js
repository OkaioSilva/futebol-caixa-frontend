import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import api from "../services/api";

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(-45deg, #2c3e50, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;
const Card = styled.div`
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    padding: 2.5rem 2rem;
    max-width: 400px;
    width: 100%;
`;
const Title = styled.h2`
    color: #2c3e50;
    text-align: center;
    margin-bottom: 1.5rem;
`;
const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
`;
const Input = styled.input`
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    &:focus {
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52,152,219,0.2);
        outline: none;
    }
`;
const Button = styled.button`
    background: #3498db;
    color: #fff;
    border: none;
    padding: 1rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 0.5rem;
    &:hover { background: #2980b9; }
`;
const Message = styled.p`
    color: ${props => props.error ? '#e74c3c' : '#27ae60'};
    text-align: center;
    margin: 0.5rem 0 0.2rem 0;
    font-size: 0.98rem;
`;
const BackLink = styled.div`
    text-align: center;
    margin-top: 1.5rem;
    a { color: #3498db; text-decoration: none; font-weight: 600; }
`;

export default function EsqueciSenha() {
    const [email, setEmail] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setLoading(true);
        try {
            await api.post("/auth/esqueci-senha", { email });
            setEnviado(true);
        } catch (err) {
            setErro(err.response?.data?.error || "Erro ao enviar email. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Card>
                <Title>Recuperar senha</Title>
                {enviado ? (
                    <Message>Enviamos um link de redefinição para seu email.</Message>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Input
                            type="email"
                            placeholder="Digite seu email cadastrado"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? "Enviando..." : "Enviar link de redefinição"}
                        </Button>
                        {erro && <Message error>{erro}</Message>}
                    </Form>
                )}
                <BackLink>
                    <Link to="/login">Voltar ao login</Link>
                </BackLink>
            </Card>
        </Container>
    );
}
