import React, { useState } from "react";
import styled from "styled-components";

const Tabela = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    @media (max-width: 700px) {
        font-size: 0.92rem;
    }
    @media (max-width: 600px) {
        font-size: 0.85rem;
        display: block;
    }
`;
const Cabecalho = styled.th`
    background-color: #2c3e50;
    color: white;
    padding: 12px;
    text-align: center;
    box-sizing: border-box;
    @media (max-width: 600px) {
        display: none;
    }
`;
const Celula = styled.td`
    padding: 12px;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
    @media (max-width: 600px) {
        display: block;
        width: 100%;
        border: none;
        position: relative;
        padding-left: 110px;
        min-height: 36px;
        &::before {
            position: absolute;
            left: 8px;
            top: 8px;
            width: 100px;
            color: #888;
            font-weight: bold;
            font-size: 0.95em;
            white-space: nowrap;
            content: attr(data-label);
        }
    }
`;
const LinhaMovimentacao = styled.tr`
    &:nth-child(even) {
        background-color: #f2f2f2;
    }
    &:hover {
        background-color: #e6e6e6;
    }
    @media (max-width: 600px) {
        display: block;
        margin-bottom: 12px;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 1px 4px #0001;
        text-align: center;
    }
`;

export const MovimentacoesCaixa = ({ movimentacoes }) => {
    const [pagina, setPagina] = useState(1);
    const porPagina = 8;
    const totalPaginas = Math.ceil((movimentacoes?.length || 0) / porPagina);
    const paginados = Array.isArray(movimentacoes)
        ? movimentacoes.slice((pagina - 1) * porPagina, pagina * porPagina)
        : [];

    return (
        <div style={{
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            borderRadius: '8px',
            padding: '20px',
            boxSizing: 'border-box',
            marginBottom: '20px',
            background: '#ddd',
        }}>
            <h3 style={{textAlign: 'center'}}>Histórico de Movimentações</h3>
            <Tabela>
                <thead>
                    <tr>
                        <Cabecalho>Data</Cabecalho>
                        <Cabecalho>Tipo</Cabecalho>
                        <Cabecalho>Valor (R$)</Cabecalho>
                        <Cabecalho>Descrição</Cabecalho>
                    </tr>
                </thead>
                <tbody>
                    {paginados.map((mov) => (
                        <LinhaMovimentacao key={mov.id}>
                            <Celula data-label="Data">{mov.data_formatada}</Celula>
                            <Celula data-label="Tipo"
                                style={{
                                    color: mov.tipo === "entrada" ? "green" : "red",
                                    fontWeight: "bold",
                                }}
                            >
                                {mov.tipo.toUpperCase()}
                            </Celula>
                            <Celula data-label="Valor (R$)">
                                {parseFloat(mov.valor).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </Celula>
                            <Celula data-label="Descrição">{mov.descricao || "-"}</Celula>
                        </LinhaMovimentacao>
                    ))}
                </tbody>
            </Tabela>
            {totalPaginas > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
                    <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} style={{ padding: '6px 14px', borderRadius: 4, border: 'none', background: '#2c3e50', color: '#fff', fontWeight: 600, cursor: pagina === 1 ? 'not-allowed' : 'pointer' }}>Anterior</button>
                    <span style={{ alignSelf: 'center', fontWeight: 600 }}>Página {pagina} de {totalPaginas}</span>
                    <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} style={{ padding: '6px 14px', borderRadius: 4, border: 'none', background: '#2c3e50', color: '#fff', fontWeight: 600, cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer' }}>Próxima</button>
                </div>
            )}
        </div>
    );
};
