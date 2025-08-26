import React, { useState } from 'react';
import api from '../../../services/api';
import styled from 'styled-components';
import { toast } from 'react-toastify';


const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  tr:nth-child(even) {
    background-color: #f2f2f2;
    }&:hover {
    background-color:  #e6e6e6;}
  @media (max-width: 700px) {
    font-size: 0.92rem;
  }

  @media (max-width: 500px) {
    font-size: 0.85rem;
  }
`;

const Th = styled.th`
  background: #2c3e50;
  color: white;
  padding: 12px;
  text-align: left;

  @media (max-width: 600px) {
    padding: 8px 2px;
    font-size: 0.95em;
    }
    `;

    const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;

  @media (max-width: 600px) {
    padding: 8px 2px 0 8px;
    font-size: 0.95em;
    word-break: break-word;
    color: #2c3e50;
    box-sizing: border-box;
    &.status-pago {
      color: green;
    }
    &.status-pendente {
      color: orange;
    }
    &.status-atrasado {
      color: red;
    }      
    select {
      text-align: center;
      width: 100%;
      
      }
  }
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  margin-left: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.delete ? '#e74c3c' : '#3498db'};
  color: white;
  transition: all 0.3s;

  &:hover {
    background-color: ${props => props.delete ? '#c0392b' : '#2980b9'};
  }

  @media (max-width: 600px) {
    margin-left: 0;
    margin-top: 6px;
    width: 100%;
  }
`;

export const ListaMensalistas = ({ mensalistas, onUpdateStatus }) => {
  const [pagina, setPagina] = useState(1);
  const porPagina = 8;
  const totalPaginas = Math.ceil((mensalistas?.length || 0) / porPagina);
  const paginados = Array.isArray(mensalistas)
    ? mensalistas.slice((pagina - 1) * porPagina, pagina * porPagina)
    : [];

  const [diaPagamento, setDiaPagamento] = useState({});
  const atualizarStatus = async (id, novoStatus) => {
    try {
      let body = { status: novoStatus };
      // Se for marcar como pago, exige seleção do dia
      const mensalista = mensalistas.find(m => m.id === id);
      if (novoStatus === 'pago') {
        if (!diaPagamento[id]) {
          toast.warn('Selecione o dia do futebol!');
          return;
        }
        body.dia_jogo = diaPagamento[id];
      }
      await api.put(`/admin/mensalistas/${id}/pagamento`, body);
      setDiaPagamento((prev) => ({ ...prev, [id]: '' }));
      onUpdateStatus();
    } catch (err) {
      toast.error('Erro ao atualizar: ' + err.response?.data?.error);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('URL completa:', `${api.defaults.baseURL}/admin/mensalistas/${id}`);

      const response = await api.delete(`/admin/mensalistas/${id}`);

      if (response.data.success) {
        toast.success('Excluído com sucesso!');

      }
    } catch (err) {
      console.error('Detalhes do erro:', err);
      toast.error('Erro: ' + (err.response?.data?.error || 'Falha ao excluir'));
    }
  };
  return (
    <div className="lista-card" style={{
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            borderRadius: '8px',
            padding: '20px',
            boxSizing: 'border-box',
            marginBottom: '20px',
            background: '#ddd',
        }}>
      <h3 style={{textAlign:'center'}}>Mensalistas</h3>
      <Table>
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th>Status</Th>
            <Th>Isenção/DM</Th>
            <Th></Th>
            {/* <Th>Situação</Th> */}
          </tr>
        </thead>
        <tbody>
          {paginados.map((m) => (
            <tr key={m.id}>
              <Td>{m.nome}</Td>
              <Td className={`status-${m.status}`}>{m.status.toUpperCase()}</Td>
              <Td style={{ color: m.is_dp || m.is_goleiro ? '#c0392b' : '#2ecc71', fontWeight: 600 }}>
                {m.is_dp ? 'DM (Isento)' : m.is_goleiro ? 'Goleiro (Isento)' : 'Ativo'}
              </Td>
              <Td>
                <select
                  value={m.status}
                  onChange={e => {
                    if (e.target.value === 'pago') {
                      if (!diaPagamento[m.id]) {
                        toast.warn('Selecione o dia do futebol!');
                        return;
                      }
                    }
                    atualizarStatus(m.id, e.target.value);
                  }}
                  disabled={m.is_dp || m.is_goleiro}
                >
                  <option value="pago">Pago</option>
                  <option value="pendente">Pendente</option>
                  <option value="atrasado">Atrasado</option>
                </select>
                {/* Sempre mostrar select do dia para marcar como pago */}
                {m.status !== 'pago' && (
                  <select
                    value={diaPagamento[m.id] || ''}
                    onChange={e => setDiaPagamento(prev => ({ ...prev, [m.id]: e.target.value }))}
                    style={{ marginLeft: 8 }}
                  >
                    <option value="">Selecione o dia</option>
                    <option value="segunda">Segunda</option>
                    <option value="quarta">Quarta</option>
                  </select>
                )}
                <ActionButton $isdelete={m.id.toString()} onClick={() => handleDelete(m.id)}>
                  Excluir
                </ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
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