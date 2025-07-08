import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import styled from "styled-components";


const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

const LoginCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  box-sizing: border-box;
  width: 100%;
  max-width: 400px;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  box-sizing: border-box;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    outline: none;
  }
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
  box-sizing: border-box;

  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-top: -1rem;
  margin-bottom: -1rem;
  font-size: 0.9rem;
`;

const RegisterLink = styled.div`
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #7f8c8d;

  a {
    color: #3498db;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 1.5rem;
`;

const CheckboxGroup = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.98rem;
  color: #2c3e50;
  margin-top: -10px;
  margin-bottom: -6px;
  user-select: none;
`;
const ForgotLink = styled.div`
  text-align: right;
  margin-top: 0.2rem;
  margin-bottom: 0.7rem;
  a {
    color: #3498db;
    font-size: 0.97rem;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

export const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErro("");
    try {
      const response = await api.post("/auth/login", { email, senha });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data.admin));
      localStorage.setItem("adminNome", response.data.admin.nome);
      if (lembrar) {
        localStorage.setItem("lembrar", "1");
      } else {
        localStorage.removeItem("lembrar");
      }
      navigate("/admin");
    } catch (error) {
      setErro(
        error.response?.data?.error || "Erro ao fazer login. Tente novamente."
      );
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>Futebol Caixa</Logo>
        <Title>Login Administrativo</Title>

        {erro && <ErrorMessage>{erro}</ErrorMessage>}

        <Form onSubmit={handleLogin}>
          <InputGroup>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </InputGroup>
          <CheckboxGroup>
            <input
              type="checkbox"
              checked={lembrar}
              onChange={e => setLembrar(e.target.checked)}
              style={{ accentColor: '#3498db', width: 16, height: 16 }}
            />
            Lembrar de mim
          </CheckboxGroup>
          <ForgotLink>
            <Link to="/esqueci-senha">Esqueceu sua senha?</Link>
          </ForgotLink>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Carregando..." : "Entrar"}
          </Button>
        </Form>

        <RegisterLink>
          Não tem uma conta? <Link to="/registro">Registre-se</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};
