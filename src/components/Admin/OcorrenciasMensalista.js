import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../../services/api";
import { toast } from 'react-toastify';

const tipos = [
    { value: "ficar de olho", label: "olho nele", color: "#f1c40f" },
    { value: "brigou", label: "Brigou", color: "#e67e22" },
    { value: "possível banimento", label: "Possível banimento", color: "#e74c3c" },
];

const badgeStyle = (tipo) => {
    const found = tipos.find(t => t.value === tipo);
    return {
        background: found ? found.color : "#bbb",
        color: "#fff",
        borderRadius: 8,
        padding: "2px 10px",
        boxSizing: "border-box",
        fontSize: 13,
        fontWeight: 600,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        marginRight: 8,
        display: "inline-block"
    };
};

// Styled Components para os botões
const Button = styled.button`
    border: none;
    border-radius: 5px;
    padding: 6px 16px;
    font-weight: 600;
    font-size: 14px;
    margin-right: 8px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    &:last-child { margin-right: 0; }
`;
const EditButton = styled(Button)`
    background: #f1c40f;
    color: #fff;
    &:hover { background: #e1b700; }
`;
const DeleteButton = styled(Button)`
    background: #e74c3c;
    color: #fff;
    &:hover { background: #c0392b; }
`;
const SaveButton = styled(Button)`
    background: #2ecc71;
    color: #fff;
    &:hover { background: #27ae60; }
`;
const CancelButton = styled(Button)`
    background: #bbb;
    color: #fff;
    &:hover { background: #888; }
`;

const OcorrenciasContainer = styled.div`
  background: #ddd;
  border-radius: 12px;
  padding: 24px;
  margin: 32px 0;
  box-shadow: 0 2px 12px #0004;
  @media (max-width: 900px) {
    padding: 12px;
    width: 100vw;
    .txt {
            box-sizing: border-box;
            
        }
  }
`;

const OcorrenciasTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 1rem;
  @media (max-width: 700px) {
    font-size: 0.92rem;
    
  }
  @media (max-width: 600px) {
    font-size: 0.85rem;
    display: block;
    
    thead, tr {
    width: 100vw;
    }
  }
`;
const OcorrenciasTh = styled.th`
  padding: 8px;
  background: #2c3e50;
  color: white;
  @media (max-width: 600px) {
    display: none;
    
  }
`;
const ResponsiveRow = styled.tr`
  @media (max-width: 600px) {
    display: block;
    margin-bottom: 18px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 1px 4px #0001;
    width: 100%;
    text-align: center;
     
    }
    `;
    
    const ResponsiveCell = styled.td`
    padding: 8px;
    vertical-align: middle;
    text-align: center;
    @media (max-width: 600px) {
        display: block;
        width: 100%;
        box-sizing: border-box;
        padding: 8px 0 8px 110px; /* padding-left maior para o label */
        border-bottom: none;
        text-align: left;
        position: relative;
        min-height: 36px;
        &::before {
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 95px;
            color: #2c3e50;
            font-weight: bold;
            font-size: 0.95em;
            white-space: nowrap;
            content: attr(data-label);
            pointer-events: none;
        }
        /* Badge e botões não colam no label */
        span, button {
            margin-left: 0;
        }
           
        
`;

const OcorrenciasMensalista = () => {
    const [mensalistas, setMensalistas] = useState([]);
    const [mensalistaId, setMensalistaId] = useState("");
    const [descricao, setDescricao] = useState("");
    const [tipo, setTipo] = useState(tipos[0].value);
    const [ocorrencias, setOcorrencias] = useState([]);
    const [editando, setEditando] = useState(null);
    const [descricaoEdit, setDescricaoEdit] = useState("");
    const [tipoEdit, setTipoEdit] = useState(tipos[0].value);
    const [erro] = useState("");

    useEffect(() => {
        api.get("/admin/mensalistas").then(res => setMensalistas(res.data));
    }, []);

    useEffect(() => {
        if (mensalistaId) {
            api.get(`/ocorrencias?mensalista_id=${mensalistaId}`)
                .then(res => setOcorrencias(res.data))
                .catch(() => setOcorrencias([]));
        } else {
            setOcorrencias([]);
        }
    }, [mensalistaId]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!mensalistaId || !descricao) {
            toast.error("Selecione um mensalista e preencha a descrição.");
            return;
        }
        try {
            await api.post("/ocorrencias", { mensalista_id: mensalistaId, descricao, tipo });
            setDescricao("");
            setTipo(tipos[0].value);
            // setErro("");
            const res = await api.get(`/ocorrencias?mensalista_id=${mensalistaId}`);
            setOcorrencias(res.data);
        } catch {
            toast.error("Erro ao adicionar ocorrência.");
        }
    };

    const handleEdit = (oc) => {
        setEditando(oc.id);
        setDescricaoEdit(oc.descricao);
        setTipoEdit(oc.tipo);
    };

    const handleSaveEdit = async (id) => {
        try {
            await api.put(`/ocorrencias/${id}`, { descricao: descricaoEdit, tipo: tipoEdit });
            setEditando(null);
            setDescricaoEdit("");
            setTipoEdit(tipos[0].value);
            const res = await api.get(`/ocorrencias?mensalista_id=${mensalistaId}`);
            setOcorrencias(res.data);
        } catch {
            toast.error("Erro ao editar ocorrência.");
        }
    };

    const handleDelete = async (id) => {
        // if (!window.confirm("Tem certeza que deseja excluir esta ocorrência?")) return;
        try {
            await api.delete(`/ocorrencias/${id}`);
            setOcorrencias(ocorrencias.filter(o => o.id !== id));

            if(true) { // Assuming success is always true here
                toast.success("Ocorrência excluída com sucesso.");
            }
        } catch {
            toast.error("Erro ao excluir ocorrência.");
        }
    };

    return (
        <OcorrenciasContainer>
            <h3 style={{fontSize: '1.2rem'}}>Ocorrências de Mensalistas</h3>
            <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
                <select value={mensalistaId} onChange={e => setMensalistaId(e.target.value)} required style={{ minWidth: 200, border: 'none', borderRadius: 5, minHeight: 45, background: "#646878a3", color: "#fff", fontWeight:'bold', flex: 1, maxWidth: 250 }}>
                    <option value="" style={{textAlign: 'center'}}>Selecione o mensalista</option>
                    {mensalistas.map(m => (
                        <option key={m.id} value={m.id}>{m.nome}</option>
                    ))}
                </select>
                <select style={{border:'none', borderRadius: 5, background: "#646878a3", color: "#fff", fontWeight:'bold', flex: 1, maxWidth: 180}} value={tipo} onChange={e => setTipo(e.target.value)} required>
                    {tipos.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
                <Button
                    as="button"
                    type="submit"
                    style={{ 
                        background: "#2ecc71",
                        color: "#fff",
                        minWidth: 120,
                        flex: 1,
                        maxWidth: 440,
                        }}>Adicionar</Button>
                <textarea
                    class="txt"
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                    placeholder="Descreva a ocorrência"
                    rows={2}
                    style={{ minWidth: "100%", resize: "none", minHeight: 80, marginTop: 8, borderRadius: 6, border: '1px solid #bbb', padding: 8 }}
                    required
                />
            </form>
            {erro && <p style={{ color: "red", marginBottom: 12 }}>{erro}</p>}
            <OcorrenciasTable>
                <thead>
                    <tr>
                        <OcorrenciasTh>Tipo</OcorrenciasTh>
                        <OcorrenciasTh>Descrição</OcorrenciasTh>
                        <OcorrenciasTh>Data</OcorrenciasTh>
                        <OcorrenciasTh>Admin</OcorrenciasTh>
                        <OcorrenciasTh>Ações</OcorrenciasTh>
                    </tr>
                </thead>
                <tbody>
                    {ocorrencias.map(oc => (
                        <ResponsiveRow key={oc.id} style={{ background: oc.tipo === "possível banimento" ? "#bd5c51" : oc.tipo === "brigou" ? "#e7a970" : "#f0e9b5" }}>
                            <ResponsiveCell data-label="Tipo"><span style={badgeStyle(oc.tipo)}>{tipos.find(t => t.value === oc.tipo)?.label || oc.tipo}</span></ResponsiveCell>
                            <ResponsiveCell data-label="Descrição" style={{
                                maxWidth: 350,
                                wordBreak: 'break-word',
                                whiteSpace: 'pre-line',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                verticalAlign: 'middle',
                                position: 'relative',
                                textAlign: 'left',
                            }}
                                title={oc.descricao}
                            >
                                {editando === oc.id ? (
                                    <textarea value={descricaoEdit} onChange={e => setDescricaoEdit(e.target.value)} rows={2} style={{ minWidth: 180, maxWidth: 340, resize: 'vertical' }} />
                                ) : (
                                    oc.descricao.length > 200 ? oc.descricao.slice(0, 200) + '...' : oc.descricao
                                )}
                            </ResponsiveCell>
                            <ResponsiveCell data-label="Data">{new Date(oc.data_ocorrencia).toLocaleString('pt-BR')}</ResponsiveCell>
                            <ResponsiveCell data-label="Admin">{oc.admin_nome}</ResponsiveCell>
                            <ResponsiveCell data-label="Ações" style={{ textAlign: "center", minWidth: 180 }}>
                                {editando === oc.id ? (
                                    <>
                                        <SaveButton onClick={() => handleSaveEdit(oc.id)}>Salvar</SaveButton>
                                        <CancelButton onClick={() => setEditando(null)}>Cancelar</CancelButton>
                                    </>
                                ) : (
                                    <>
                                        <EditButton onClick={() => handleEdit(oc)}>Editar</EditButton>
                                        <DeleteButton onClick={() => handleDelete(oc.id)}>Excluir</DeleteButton>
                                    </>
                                )}
                            </ResponsiveCell>
                        </ResponsiveRow>
                    ))}
                </tbody>
            </OcorrenciasTable>
        </OcorrenciasContainer>
    );
};

export default OcorrenciasMensalista;
