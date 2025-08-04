import React, { useState } from "react";
import RelatorioMensal from "./relatorio-mensal";

const ModalRelatorioMensal = () => {
    const [aberto, setAberto] = useState(false);

    return (
        <>
            <button
                onClick={() => setAberto(true)}
                style={{
                    marginBottom: 16,
                    padding: 12,
                    borderRadius: 8,
                    background: "#2ecc71",
                    color: "#fff",
                    fontWeight: 'bold',
                    border: 'none',
                    boxSizing: "border-box",
                    fontSize: 16,
                    cursor: "pointer",
                    width: "100%",
                    maxWidth: 350
                }}
            >
                Ver relatório mensal
            </button>
            {aberto && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(44, 204, 113, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        backdropFilter: "blur(2px)",
                        padding: 8
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            padding: 24,
                            borderRadius: 16,
                            width: "100%",
                            maxWidth: 700,
                            minWidth: 0,
                            maxHeight: "90vh",
                            overflowY: "auto",
                            boxShadow: "0 8px 32px #2ecc7140",
                            border: "2px solid #2ecc71",
                            position: "relative",
                            boxSizing: "border-box"
                        }}
                    >
                        <button
                            style={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                                background: "#2ecc71",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                padding: "6px 16px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: 16,
                                boxShadow: "0 2px 8px #2ecc7130"
                            }}
                            onClick={() => setAberto(false)}
                        >
                            Fechar
                        </button>
                        <h2 style={{ color: "#2ecc71", textAlign: "center", marginBottom: 24 }}>
                            Relatório Mensal do Caixa
                        </h2>
                        <RelatorioMensal />
                    </div>
                    <style>{`
                        @media (max-width: 800px) {
                            .modal-relatorio-mensal-content {
                                max-width: 98vw !important;
                                padding: 12px !important;
                            }
                        }
                        @media (max-width: 500px) {
                            .modal-relatorio-mensal-content {
                                max-width: 100vw !important;
                                min-width: 0 !important;
                                padding: 4px !important;
                                border-radius: 8px !important;
                            }
                        }
                    `}</style>
                </div>
            )}
        </>
    );
};

export default ModalRelatorioMensal;
