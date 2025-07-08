import React, { useEffect, useState } from "react";
import api from "../../../services/api";

const RelatorioMensal = () => {
    const [relatorio, setRelatorio] = useState({ pendentes: [], maisDeUmAtraso: [] });
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [pagando, setPagando] = useState(null); // id do mensalista em pagamento
    const [valorPagamento, setValorPagamento] = useState(30);

    const fetchRelatorio = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/relatorio/mensal-detalhado');
            setRelatorio(res.data);
        } catch (erro) {
            setErro('Erro ao buscar relatório mensal detalhado');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRelatorio();
    }, []);

    const handlePagar = async (id) => {
        setPagando(id);
    };

    const confirmarPagamento = async (id) => {
        try {
            await api.put(`/admin/mensalistas/${id}/pagar-mensalidade`, { valor: valorPagamento });
            setPagando(null);
            setValorPagamento(30);
            await fetchRelatorio();
        } catch {
            alert('Erro ao registrar pagamento');
        }
    };

    const TableResponsive = {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: 32,
        fontSize: '1rem',
        maxWidth: '100vw',
    };
    const ThResponsive = {
        border: '1px solid #ddd',
        padding: '8px',
        fontSize: '1rem',
    };
    const TdResponsive = {
        border: '1px solid #ddd',
        padding: '8px',
        fontSize: '1rem',
        wordBreak: 'break-word',
        maxWidth: 120,
    };

    if (loading) {
        return <div>Carregando...</div>;
    }
    if (erro) {
        return <p style={{ color: 'red' }}>{erro}</p>;
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <h2>Relatório de Mensalidades Pendentes</h2>
            <table style={TableResponsive}>
                <thead>
                    <tr>
                        <th style={ThResponsive}>Mensalista</th>
                        <th style={ThResponsive}>Meses em atraso</th>
                        <th style={ThResponsive}>Valor devido (R$)</th>
                        <th style={ThResponsive}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {relatorio.pendentes.length === 0 && (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>Nenhum mensalista pendente</td></tr>
                    )}
                    {relatorio.pendentes.map((item) => (
                        <tr key={item.id} style={{ background: item.meses_pendentes > 1 ? '#ffe0e0' : 'white' }}>
                            <td style={TdResponsive}>{item.nome}</td>
                            <td style={TdResponsive}>{item.meses_pendentes}</td>
                            <td style={TdResponsive}>{Number(item.valor_devido).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td style={TdResponsive}>
                                {pagando === item.id ? (
                                    <>
                                        <input
                                            type="number"
                                            min={1}
                                            step={1}
                                            value={valorPagamento}
                                            onChange={e => setValorPagamento(Number(e.target.value))}
                                            style={{ width: 80, marginRight: 8 }}
                                        />
                                        <button onClick={() => confirmarPagamento(item.id)} style={{ background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 600, marginRight: 8 }}>Confirmar</button>
                                        <button onClick={() => setPagando(null)} style={{ background: '#bbb', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 600 }}>Cancelar</button>
                                    </>
                                ) : (
                                    <button onClick={() => handlePagar(item.id)} style={{ background: '#2ecc71', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 600 }}>Registrar Pagamento</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 style={{ marginTop: 24, color: '#c0392b' }}>Mensalistas com mais de uma mensalidade atrasada</h3>
            <table style={TableResponsive}>
                <thead>
                    <tr>
                        <th style={ThResponsive}>Mensalista</th>
                        <th style={ThResponsive}>Meses em atraso</th>
                        <th style={ThResponsive}>Valor devido (R$)</th>
                    </tr>
                </thead>
                <tbody>
                    {relatorio.maisDeUmAtraso.length === 0 && (
                        <tr><td colSpan={3} style={{ textAlign: 'center', color: '#888' }}>Nenhum mensalista com mais de uma mensalidade atrasada</td></tr>
                    )}
                    {relatorio.maisDeUmAtraso.map((item) => (
                        <tr key={item.id}>
                            <td style={TdResponsive}>{item.nome}</td>
                            <td style={TdResponsive}>{item.meses_pendentes}</td>
                            <td style={TdResponsive}>{Number(item.valor_devido).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};
export default RelatorioMensal;